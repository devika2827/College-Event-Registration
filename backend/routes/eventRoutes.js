const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const requireAuth = require("../middleware/auth");
const {getEvents, createEvent, updateEvent, deleteEvent, getRegistrationsForMyEvents} = require("../controllers/eventController");

router.get("/", requireAuth, getEvents);
router.get("/my", requireAuth, getMyEvents);
router.get("/registrations/mine", requireAuth, getRegistrationsForMyEvents);
router.post("/", requireAuth, upload.single("banner"), createEvent);
router.put("/:id", requireAuth, upload.single("banner"), updateEvent);
router.post("/", requireAuth, createEvent);
router.put("/:id", requireAuth, updateEvent);
router.delete("/:id", requireAuth, deleteEvent);

module.exports = router;