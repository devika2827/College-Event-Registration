const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {getEvents, getSingleEvent, getMyEvents, createEvent, updateEvent, deleteEvent, getRegistrationsForMyEvents} = require("../controllers/eventController");

router.get("/", getEvents);
router.get("/my", verifyToken, getMyEvents);
router.get("/:id", getSingleEvent);
router.get("/registrations/mine", verifyToken, getRegistrationsForMyEvents);
router.post("/", verifyToken, createEvent);
router.put("/:id", verifyToken, updateEvent);
router.delete("/:id", verifyToken, deleteEvent);

module.exports = router;
