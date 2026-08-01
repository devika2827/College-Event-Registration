const Registration = require("../models/Registration");

// GET all registrations
const getRegistrations = async (req, res) => {

    try {

        const registrations = await Registration.find().sort({ createdAt: -1 });

        res.status(200).json(registrations);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// CREATE registration
const createRegistration = async (req, res) => {

    try {

        const registration = await Registration.create(req.body);

        res.status(201).json(registration);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

};

module.exports = {

    getRegistrations,

    createRegistration

};