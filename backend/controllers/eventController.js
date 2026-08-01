const Event = require("../models/Event");

// GET all events
const getEvents = async (req, res) => {
    try {
        const events = await Event.find({createdBy: req.user._id}).sort({ createdAt: -1 });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};

// CREATE event
const createEvent = async (req, res) => {
    try {
        const eventData = { ...req.body, createdBy: req.user._id };

        if (req.file) {
            eventData.banner = req.file.filename;
        }

        const event = await Event.create(eventData);
        res.status(201).json(event);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }

};

// UPDATE event
const updateEvent = async (req, res) => {

    try {
        const eventData = { ...req.body };

        if (req.file) {
            eventData.banner = req.file.filename;
        }

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            eventData,
            {
                new: true,
                runValidators: true
            }
        );

        if (event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to edit this event" });
        }
        
        if (!event) {

            return res.status(404).json({
                message: "Event not found"
            });

        }

        res.json(event);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

};

// DELETE event
const deleteEvent = async (req, res) => {

    try {

        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {

            return res.status(404).json({
                message: "Event not found"
            });

        }

        if (event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this event" });
        }

        res.json({
            message: "Event deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
};