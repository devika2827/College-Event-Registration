const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { getRegistrations, getRegistration, createRegistration, 
    updateRegistration, deleteRegistration, getMyRegistrations, 
    getRegistrationsForMyEvents, lookupTeam, joinTeam 
    } = require("../controllers/registrationController");


router.get("/my", verifyToken, getMyRegistrations);
router.get("/mine-as-host", verifyToken, getRegistrationsForMyEvents);  
router.get("/", getRegistrations);
router.get("/:id", getRegistration);
router.post("/", verifyToken, createRegistration);
router.patch("/:registrationId/join", verifyToken, joinTeam);
router.put("/:id", updateRegistration);
router.delete("/:id", deleteRegistration);
router.get("/lookup/:registrationId", lookupTeam);

module.exports = router;
