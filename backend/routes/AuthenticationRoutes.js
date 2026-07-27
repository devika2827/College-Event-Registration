const express = require("express");
const {regUser} = require("../controllers/AuthenticaionController");
const router = express.Router();

router.route("/register").post(regUser);

module.exports = router;