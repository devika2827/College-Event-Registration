const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {getEvents, createEvent, updateEvent, deleteEvent} = require("../controllers/eventController");

router.get("/", getEvents);
router.post("/", upload.single("banner"), createEvent);
router.put("/:id",upload.single("banner"), updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;