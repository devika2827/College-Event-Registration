const { User } = require("../models/Authentication");
const sendEmail = require("../utils/Authentication").sendEmail;
// Register user
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
        user = await User.create({ name, email, username, password, isEmailVerified: false });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    const  { unHashedToken, hashedToken, expiryTime } = user.generateTemporaryToken();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = expiryTime;
    await user.save({ validateBeforeSave: false });
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${unHashedToken}`;
    const mailgenContent = emailVerificationTemplate(user.username, verificationLink);
    await sendEmail({
        to: user?.email,
        subject: 'Email Verification',
        mailgenContent: emailgenContent(user.username, `${req.protocol}://${req.get('host')}/api/v1/users/verify-email/${unHashedToken}`)
    });
    await user.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");
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
        user.new= true;
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
}

const emailVerificationTemplate = async(req, res)=> {
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
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json({ message: "Email verified successfully" });
}

module.exports = { regUser, loginUser, LogoutUser, getCurrentUser, emailVerificationTemplate };



