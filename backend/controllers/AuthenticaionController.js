const { User } = require("../models/Authentication");
const sendEmail = require("../utils/Authentication").sendEmail;
// Register user
const regUser = async (req, res) => {

    const {email,username, password} = req.body;

    const existedUser = await User.findOne({
        $or: [{email},{username}]
    });

    if (existedUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    try {
        const user = await User.create({ email, username, password, isEmailVerified: false });
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

        const user = await User.findByIdAndUpdate(UserID, { refreshToken: user.generateRefreshToken() });
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };

    } catch (error) {

        res.status(400).json({ message: error.message });

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


module.exports = { regUser, loginUser };



