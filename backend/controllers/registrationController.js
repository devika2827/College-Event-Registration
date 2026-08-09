const Registration = require("../models/Registration");

function generateRegistrationId(){
    const random = Math.floor(Math.random() * 9000) + 1000;
    return "EH" + random;
}

async function generateUniqueRegistrationId(){
    let id;
    let exists = true;

    while(exists){
        id = generateRegistrationId();
        exists = await Registration.exists({ registrationId: id });
    }

    return id;
}

/* GET ALL REGISTRATIONS */

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


/* CREATE REGISTRATION */

const createRegistration = async (req, res) => {

    try {

        const registrationId = await generateUniqueRegistrationId();
        const registration = await Registration.create({
            ...req.body,
            registrationId
        });
        res.status(201).json(registration);

    } catch (error) {

        res.status(400).json({ message: error.message});

    }

};

/* GET REGISTRATION BY ID */

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

/* UPDATE REGISTRATION */

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


/* DELETE REGISTRATION */

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

/* GET REGISTRATIONS FOR STUDENT DASHBOARD */

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

/* GET REGGISTRATIONS FOR ADMIN DASHBOARD */
const Event = require("../models/Event");

const getRegistrationsForMyEvents = async (req, res) => {
    try {
        const myEventIds = await Event.find({ createdBy: req.user._id }).distinct("_id");

        const registrations = await Registration.find({
            eventId: { $in: myEventIds }
        })
        .populate("eventId", "name date category")
        .sort({ createdAt: -1 });

        res.status(200).json(registrations);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* LOOKUP TEAM BY REGISTRATION ID (for the "Join Team" flow) */

const lookupTeam = async (req, res) => {
    try {
        const { registrationId } = req.params;

        const registration = await Registration.findOne({ registrationId });

        if (!registration) {
            return res.status(404).json({ message: "Registration ID not found." });
        }

        res.status(200).json({
            eventId: registration.eventId,
            teamName: registration.teamName,
            leaderName: registration.teamLeader.name,
            currentSize: 1 + registration.teamMembers.length
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* JOIN AN EXISTING TEAM */

const joinTeam = async (req, res) => {
    try {
        const { registrationId } = req.params;
        const { eventId, member } = req.body;

        const registration = await Registration.findOne({ registrationId });

        if (!registration) {
            return res.status(404).json({ message: "Registration ID not found." });
        }

        if (registration.eventId.toString() !== eventId) {
            return res.status(400).json({ message: "This Registration ID belongs to a different event." });
        }

        const currentSize = 1 + registration.teamMembers.length;

        if (currentSize >= registration.maxTeamSize) {
            return res.status(400).json({ message: "This team is already full." });
        }

        const alreadyJoined =
            registration.teamLeader.email === member.email ||
            registration.teamMembers.some(m => m.email === member.email);

        if (alreadyJoined) {
            return res.status(400).json({ message: "This email has already joined this team." });
        }

        registration.teamMembers.push(member);
        await registration.save();

        res.status(200).json(registration);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getRegistrations,
    getRegistration,
    createRegistration,
    updateRegistration,
    deleteRegistration,
    getMyRegistrations,
    getRegistrationsForMyEvents,
    lookupTeam,
    joinTeam
};
