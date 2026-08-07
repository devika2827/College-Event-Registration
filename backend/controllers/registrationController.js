const Registration = require("../models/Registration");

/* ======================================
   GET ALL REGISTRATIONS
====================================== */

const getRegistrations = async (req, res) => {

    try {

        const registrations = await Registration.find().sort({
            createdAt: -1
        });

        res.status(200).json(registrations);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


/* ======================================
   CREATE REGISTRATION
====================================== */

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


/* ======================================
   GET REGISTRATION BY ID
====================================== */

const getRegistration = async (req, res) => {

    try {

        const registration = await Registration.findById(req.params.id);

        if (!registration) {

            return res.status(404).json({
                message: "Registration not found"
            });

        }

        res.status(200).json(registration);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


/* ======================================
   UPDATE REGISTRATION
====================================== */

const updateRegistration = async (req, res) => {

    try {

        const registration = await Registration.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new: true,
                runValidators: true
            }

        );

        if (!registration) {

            return res.status(404).json({
                message: "Registration not found"
            });

        }

        res.status(200).json(registration);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

};


/* ======================================
   DELETE REGISTRATION
====================================== */

const deleteRegistration = async (req, res) => {

    try {

        const registration = await Registration.findByIdAndDelete(req.params.id);

        if (!registration) {

            return res.status(404).json({
                message: "Registration not found"
            });

        }

        res.status(200).json({
            message: "Registration deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const getMyRegistrations = async (req, res) => {
    try {

        const registrations = await Registration.find({
            "teamLeader.email": req.user.email
        }).sort({ createdAt: -1 });

        res.status(200).json(registrations);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};



module.exports = {

    getRegistrations,

    getRegistration,

    createRegistration,

    updateRegistration,

    deleteRegistration,
   
    getMyRegistrations

};
