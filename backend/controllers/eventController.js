const Event = require("../models/Event");

// GET all events
const getEvents = async (req, res) => {

    try {

        const events = await Event.find().sort({ createdAt: -1 });

        res.status(200).json(events);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

};

// CREATE event
const createEvent = async (req, res) => {

    try {

        const event = await Event.create(req.body);

        res.status(201).json(event);

    } catch (error) {

        res.status(400).json({ message: error.message });

    }

};

// UPDATE event
const updateEvent = async (req, res) => {

    try {

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
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

        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {

            return res.status(404).json({
                message: "Event not found"
            });

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