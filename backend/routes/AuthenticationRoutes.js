const express = require("express");
const {regUser,loginUser} = require("../controllers/AuthenticaionController");
const router = express.Router();

router.route("/register").post(regUser);
router.route("/login").post(loginUser);
module.exports = router;