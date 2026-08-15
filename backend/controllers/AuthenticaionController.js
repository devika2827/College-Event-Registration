const { User } = require("../models/Authentication");
const { emailVerificationMail, forgotPasswordMail, sendEmail } = require("../utils/Authentication");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const regUser = async (req, res) => {

    const {name, email, username, password} = req.body;
    const existedUser = await User.findOne({
        $or: [{email}]
    });
    if (existedUser) {
        return res.status(400).json({ message: "Email already registered" });
    }
    const existedUser2 = await User.findOne({
        $or: [{username}]
    });

    if (existedUser2) {
        return res.status(400).json({ message: "Username already taken" });
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
        mailgenContent: emailVerificationMail(user.username,`${process.env.FRONTEND_URL}/Authentication/html/verify-email.html?token=${unHashedToken}`)
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");

    if(!createdUser){
        return res.status(400).json({ message: "User not found" });
    }

    return res.status(201).json({ message: "Account created. A verification email has been sent to your email address.", user: createdUser });

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

         if (!user.Verified) {
            return res.status(403).json({
            message: "Please verify your email before logging in",
            unverified: true,
            email: user.email
            });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");

        const options = {
            httpOnly: true,
            secure: true, 
            sameSite: "none",
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
        console.error(error);
        return res.status(500).json({ message: error.message });
    }

};
const LogoutUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        user.refreshToken = undefined;
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        };

        await user.save({ validateBeforeSave: false });

        return res.status(200)
                .clearCookie("accessToken", options)
                .clearCookie("refreshToken", options)
                .json({ message: "User logged out successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

const getCurrentUser = async (req, res) => {
    return res
    .status(200)
    .json({ user: req.user, message: "Current user retrieved successfully" });
};

const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;

    if (!verificationToken) {

        return res.status(400).json({
            message: "Verification token is required"
        });
    }

    try {
        const hashedToken = crypto
            .createHash("sha256")
            .update(verificationToken)
            .digest("hex");

        const user = await User.findOne({

            emailVerificationToken: hashedToken,

            emailVerificationExpiry: {
                $gt: Date.now()
            }
        });

        if (!user) {
            return res.status(400).json({ message:"Invalid or expired verification token"});
        }

        user.Verified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpiry = undefined;

        await user.save({
            validateBeforeSave: false
        });

        return res.status(200).json({ success: true,
            message:"Email verified successfully"});

    } catch (error) {
        console.error( "Email verification error:",error);
        return res.status(500).json({message:"Unable to verify email"});
    }
};

const resendVerificationEmail = async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            message: "Email is required"
        });
    }

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.Verified) {
            return res.status(409).json({
                message: "Email is already verified"
            });
        }

        const {
            unHashedToken,
            hashedToken,
            expiryTime
        } = user.generateTemporaryToken();

        user.emailVerificationToken = hashedToken;
        user.emailVerificationExpiry = expiryTime;

        await user.save({
            validateBeforeSave: false
        });

        await sendEmail({
            to: user.email,
            subject: "Email Verification",
            mailgenContent: emailVerificationMail(
                user.username,
                `${process.env.FRONTEND_URL}/Authentication/html/verify-email.html?token=${unHashedToken}`
            )
        });

        return res.status(200).json({
            message: "A new verification email has been sent."
        });

    } catch (error) {

        console.error(
            "Resend verification email error:",
            error
        );

        return res.status(500).json({
            message: "Unable to send verification email"
        });
    }
};


const refreshAccessToken = async (req, res) => {

    const incomingRefreshToken =
        req.cookies?.refreshToken ||
        req.body?.refreshToken;

    if (!incomingRefreshToken) {
        return res.status(401).json({
            message: "Refresh token is required"
        });
    }

    try {

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(
            decodedToken?._id
        );

        if (!user) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        if (user.refreshToken !== incomingRefreshToken) {
            return res.status(401).json({
                message: "Refresh token is expired or invalid"
            });
        }

        const {
            accessToken,
            refreshToken: newRefreshToken
        } = await generateAccessAndRefreshTokens(
            user._id
        );

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        };

        return res
            .status(200)
            .cookie(
                "accessToken",
                accessToken,
                options
            )
            .cookie(
                "refreshToken",
                newRefreshToken,
                options
            )
            .json({
                success: true,
                accessToken,
                refreshToken: newRefreshToken,
                message: "Access token refreshed successfully"
            });

    } catch (error) {

        console.error(
            "Refresh token error:",
            error
        );

        return res.status(403).json({
            message: "Invalid or expired refresh token"
        });
    }
};


const forgotPassword = async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            message: "Email is required"
        });
    }

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const {
            unHashedToken,
            hashedToken,
            expiryTime
        } = user.generateTemporaryToken();

        user.forgotPasswordToken = hashedToken;
        user.forgotPasswordTokenExpiry = expiryTime;

        await user.save({
            validateBeforeSave: false
        });

        await sendEmail({
            to: user.email,
            subject: "Password Reset",
            mailgenContent: forgotPasswordMail(
                user.username,
                `${process.env.FRONTEND_URL}/Authentication/html/forgot-password-reset.html?token=${unHashedToken}`
            )
        });

        return res.status(200).json({
            message: "Password reset email sent successfully"
        });

    } catch (error) {

        console.error(
            "Forgot password error:",
            error
        );

        return res.status(500).json({
            message: "Unable to send password reset email"
        });
    }
};


const resetforgotPassword = async (req, res) => {

    const { ResetToken } = req.params;
    const { newPassword } = req.body;

    if (!ResetToken) {
        return res.status(400).json({
            message: "Reset token is required"
        });
    }

    if (!newPassword) {
        return res.status(400).json({
            message: "New password is required"
        });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long"
        });
    }

    try {

        const hashedToken = crypto
            .createHash("sha256")
            .update(ResetToken)
            .digest("hex");

        const user = await User.findOne({
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: {
                $gt: Date.now()
            }
        });

        if (!user) {
            return res.status(400).json({
                message: "Token is invalid or expired"
            });
        }

        user.password = newPassword;

        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;

        await user.save();

        return res.status(200).json({
            message: "Password reset successfully"
        });

    } catch (error) {

        console.error(
            "Reset password error:",
            error
        );

        return res.status(500).json({
            message: "Unable to reset password"
        });
    }
};


const changeCurrentPassword = async (req, res) => {

    const {
        oldPassword,
        newPassword
    } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({
            message: "Old password and new password are required"
        });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({
            message: "New password must be at least 8 characters long"
        });
    }

    try {

        const user = await User.findById(
            req.user?._id
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isPasswordValid =
            await user.isPasswordCorrect(
                oldPassword
            );

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid old password"
            });
        }

        user.password = newPassword;

        await user.save({
            validateBeforeSave: false
        });

        return res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {

        console.error(
            "Change password error:",
            error
        );

        return res.status(500).json({
            message: "Unable to change password"
        });
    }
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

