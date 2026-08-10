const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { withdrawFromRegistration, createRegistration, 
     deleteRegistration, getMyRegistrations, 
    getRegistrationsForMyEvents, lookupTeam, joinTeam 
    } = require("../controllers/registrationController");


router.get("/my", verifyToken, getMyRegistrations);
router.get("/mine-as-host", verifyToken, getRegistrationsForMyEvents);  
router.post("/", verifyToken, createRegistration);
router.patch("/:registrationId/join", verifyToken, joinTeam);
router.delete("/:registrationId/leave", verifyToken, withdrawFromRegistration);
router.delete("/:id", deleteRegistration);
router.get("/lookup/:registrationId", lookupTeam);

module.exports = router;
