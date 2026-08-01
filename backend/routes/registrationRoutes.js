const express = require("express");

const router = express.Router();

const {
    getRegistrations,
    createRegistration
} = require("../controllers/registrationController");

// Get all registrations
router.get("/", getRegistrations);

// Register a student
router.post("/", createRegistration);

module.exports = router;