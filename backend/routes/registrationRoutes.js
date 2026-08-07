const express = require("express");

const router = express.Router();

const {

    getRegistrations,

    getRegistration,

    createRegistration,

    updateRegistration,

    deleteRegistration

} = require("../controllers/registrationController");

router.get("/my", verifyToken, getMyRegistrations);
router.get("/", getRegistrations);

router.get("/:id", getRegistration);

router.post("/", createRegistration);

router.put("/:id", updateRegistration);

router.delete("/:id", deleteRegistration);


module.exports = router;
