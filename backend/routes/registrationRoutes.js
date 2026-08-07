const express = require("express");

const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {

    getRegistrations,

    getRegistration,

    createRegistration,

    updateRegistration,

    deleteRegistration,
     getMyRegistrations

} = require("../controllers/registrationController");

router.get("/", getRegistrations);

router.get("/:id", getRegistration);

router.post("/", createRegistration);

router.put("/:id", updateRegistration);

router.delete("/:id", deleteRegistration);

router.get("/my", verifyToken, getMyRegistrations);


module.exports = router;
