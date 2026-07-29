const express = require("express");
const {regUser,loginUser,LogoutUser} = require("../controllers/AuthenticaionController");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(regUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyToken, LogoutUser);
module.exports = router;