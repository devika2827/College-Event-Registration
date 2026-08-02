const Event = require("../models/Event");
const Registration = require("../models/Registration");

// GET all events (public — students browsing)
const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET only the logged-in admin's own events
const getMyEvents = async (req, res) => {
    try {
        const events = await Event.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
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

        const exising = await Event.findById(req.params.id);

        if (!existing) {

            return res.status(404).json({
                message: "Event not found"
            });
        }

        if (existing.createdBy.toString() !== req.user._id) {
            return res.status(403).json({ message: "Not authorized to edit this event" });
        }

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

        const event = await Event.findById(req.params.id);

        if (!event) {

            return res.status(404).json({
                message: "Event not found"
            });

        }

        if (event.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this event" });
        }

        await Event.findByIdAndDelete(req.params.id);

        res.json({
            message: "Event deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const getRegistrationsForMyEvents = async (req, res) => {

    try {

        const myEventIds = await Event.find({ createdBy: req.user._id }).distinct("_id");

        const registrations = await Registration.find({ event: { $in: myEventIds } })
            .populate("event", "name date category")
            .sort({ createdAt: -1 });

        res.status(200).json(registrations);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

};

module.exports = {
    getEvents,
    getMyEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getRegistrationsForMyEvents
};

