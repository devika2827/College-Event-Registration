const express = require("express");
const {regUser, loginUser, LogoutUser, getCurrentUser, verifyEmail, 
    resendVerificationEmail,refreshAccessToken,forgotPassword,resetforgotPassword,
    changeCurrentPassword } = require("../controllers/AuthenticaionController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(regUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyToken, LogoutUser);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:ResetToken").post(resetforgotPassword);
router.route("/change-password").post(verifyToken, changeCurrentPassword);
router.route("/current-user").post(verifyToken, getCurrentUser);
router.route("/resend-verification-email").post(verifyToken, resendVerificationEmail);

module.exports = router;