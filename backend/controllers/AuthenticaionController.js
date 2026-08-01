const { User } = require("../models/Authentication");
const { emailVerificationMail } = require("../utils/Authentication");
const sendEmail = require("../utils/Authentication").sendEmail;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const regUser = async (req, res) => {

    const {name, email, username, password} = req.body;

    const existedUser = await User.findOne({
        $or: [{email},{username}]
    });

    if (existedUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    let user;
    try {
        user = await User.create({ name, email, username, password, Verified: false });
    } catch (error) {
        return res.status(400).json({ message: error.message });
        
    }
    const  { unHashedToken, hashedToken, expiryTime } = user.generateTemporaryToken();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = expiryTime;
    await user.save({ validateBeforeSave: false });
    await sendEmail({
        to: user?.email,
        subject: 'Email Verification',
        mailgenContent: emailVerificationMail(user.username, `${req.protocol}://${req.get('host')}/api/v1/users/verify-email/${unHashedToken}`)
    });
    const createdUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");
    if(!createdUser){
        return res.status(400).json({ message: "User not found" });
    }
    return res.status(201).json({ message: "User registered successfully", user: createdUser });
};
const generateAccessAndRefreshTokens = async (UserID) => {
    try {
        const user = await User.findById(UserID);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw error;
    }
};
const loginUser = async (req, res) => {

    const { username, password,email } = req.body;
    if (!username && !email) {
        return res.status(400).json({ message: "Please provide username or email" });
    }

    try {
        const user = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");

        const options = {
            httpOnly: true,
            secure: true
        };

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                success: true,
                accessToken,
                refreshToken,
                user: loggedInUser,
                message: "User logged in successfully"
            },
        );

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

};
const LogoutUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        user.refreshToken = undefined;
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        const options = {
            httpOnly: true,
            secure: true
        };
        await user.save({ validateBeforeSave: false });
        return res.status(200)
                .clearCookie("accessToken", options)
                .clearCookie("refreshToken", options)
                .json({ message: "User logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const getCurrentUser = async (req, res) => {
    return res
    .status(200)
    .json({ user: req.user, message: "Current user retrieved successfully" });
};
const verifyEmail = async(req, res)=> {
    const {verificationToken} = req.params;
    if(!verificationToken){
        return res.status(400).json({ message: "Verification token is required" });
    }
    let hashedToken;
    try {
        hashedToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    const user = await User.findOne( { emailVerificationToken: hashedToken },
        {emailVerificationExpiry: { $gt: Date.now() }} );
    if(!user){
        return res.status(400).json({ message: "Invalid or Expired verification token" });
    }
    user.Verified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json({ message: "Email verified successfully" });
};
const resendVerificationEmail = async (req, res) => {
    const User=findById(req.user._id);
    if(!User){
        return res.status(409).json({ message: "User not found" });
    }
    if(user.Verified){
        return res.status(409).json({ message: "Email already verified" });
    }
    const  { unHashedToken, hashedToken, expiryTime } = user.generateTemporaryToken();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = expiryTime;
    await user.save({ validateBeforeSave: false });
    await sendEmail({
        to: user?.email,
        subject: 'Email Verification',
        mailgenContent: emailVerificationMail(user.username, `${req.protocol}://${req.get('host')}/api/v1/users/verify-email/${unHashedToken}`)
    });
    return res.status(201).json({ message: "User registered successfully", user: createdUser });

};
const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        return res.status(401).json({ message: "Refresh token is required" });
    }
    try{
        const decodedtoken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user=await User.findById(decodedtoken?._id);
        if (!user){
            return res.status(401).json({ message: "Invalid refresh token" });
        }
        if(user.refreshToken !== incomingRefreshToken){
            return res.status(401).json({ message: "Refresh token is expired" });
        }
        const options = {
            httpOnly: true,
            secure: true
        };
        const { accessToken, refreshToken: newrefreshToken } = await generateAccessAndRefreshTokens(user._id);
        user.refreshToken = newrefreshToken;
        await user.save();
        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json({
                success: true,
                accessToken,
                refreshToken: newrefreshToken,
                message: "Access token refreshed successfully"
            });
    } catch (error) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
};
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const { unHashedToken, hashedToken, expiryTime } = user.generateTemporaryToken();
    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordTokenExpiry = expiryTime;
    await user.save({ validateBeforeSave: false });
    await sendEmail({
        to: user?.email,
        subject: 'Password Reset',
        mailgenContent: forgotPasswordMail(user.username, `${req.protocol}://${req.get('host')}/api/v1/users/forgot-password/${unHashedToken}`)
    });
    return res.status(200).json({ message: "Password reset email sent successfully" });
};
const resetforgotPassword = async (req, res) => {
    const {ResetToken} = req.params
    const {newPassword} = req.body

    let hashedToken= crypto
    .createHash("sha256")
    .update(ResetToken)
    .digest("hex")

    const user=await User.findOne({
        forgotPasswordToken:hashedToken,
        forgotPasswordTokenExpiry:{ $gt: Date.now()}
    })
    if(!user){
        return res.status(489).json({ message: "Token is invalid or expired"})
    }
    user.forgotPasswordToken=undefined;
    user.forgotPasswordTokenExpiry=undefined;

    user.password=newPassword;
    await user.save({ validateBeforeSave:false});

    return res.status(200).json({ message: "Password reset succesfully"});
};
const changeCurrentPassword= async (req ,res) =>{
    const{oldPassword , newPassword}=req.body;
    const user= await User.findById(req.user?._id);
    const isPasswordValid=user.isPasswordCorrect(oldPassword);

    if(!isPasswordValid){
        return res.status(400).json({ message: "Invalid old password"})
    }
    user.password=newPassword;
    await user.save({validateBeforeSave:false});

    return res.status(200).json({message: "Password changed successfully"});


};
module.exports={regUser, 
                loginUser, 
                LogoutUser, 
                getCurrentUser, 
                verifyEmail, 
                resendVerificationEmail,
                refreshAccessToken, 
                forgotPassword, 
                resetforgotPassword, 
                changeCurrentPassword };

