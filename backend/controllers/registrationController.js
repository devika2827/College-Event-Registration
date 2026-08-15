const Registration = require("../models/Registration");
const Event = require("../models/Event");

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

const createRegistration = async (req, res) => {

    try {
        const registrationId = await generateUniqueRegistrationId();
        const registration = await Registration.create({
            ...req.body,
            registrationId,
            teamLeader: {
                ...req.body.teamLeader,
                registeredBy: req.user._id
            }
        });
        res.status(201).json(registration);

    } catch (error) {

        res.status(400).json({ message: error.message});

    }

};

const withdrawFromRegistration = async (req, res) => {
    try {
        const { registrationId } = req.params;
        const userId = req.user._id.toString();

        const registration = await Registration.findOne({ registrationId });

        if (!registration) {
            return res.status(404).json({ message: "Registration not found." });
        }

        const isLeader = registration.teamLeader.registeredBy.toString() === userId;

        if (isLeader) {

            if (registration.teamMembers.length > 0) {
                return res.status(400).json({
                    message: "You can't withdraw while other members are still active. All other team members must withdraw before you can cancel the registration."
                });
            }

            await Registration.findByIdAndDelete(registration._id);
            return res.status(200).json({ message: "Registration cancelled." });

        }

        const memberIndex = registration.teamMembers.findIndex(
            m => m.registeredBy && m.registeredBy.toString() === userId
        );

        if (memberIndex === -1) {
            return res.status(403).json({ message: "You are not part of this registration." });
        }

        registration.teamMembers.splice(memberIndex, 1);
        await registration.save();

        res.status(200).json({ message: "You have left the team." });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteRegistration = async (req, res) => {

    try {
        const registration = await Registration.findById(req.params.id).populate("eventId");

        if (!registration) {
            return res.status(404).json({
                message: "Registration not found"
            });

        }

        if (!registration.eventId || !registration.eventId.createdBy || registration.eventId.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this registration."
            });
        }

        await Registration.findByIdAndDelete(req.params.id);
        
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
            $or: [
                { "teamLeader.registeredBy": req.user._id },
                { "teamMembers.registeredBy": req.user._id }
            ]
        })
        .populate("eventId", "name date category venue banner mode")
        .sort({ createdAt: -1 });

        res.status(200).json(registrations);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

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

        if (currentSize >= registration.teamSize) {
            return res.status(400).json({ message: "This team is already full." });
        }

        const alreadyJoined =
            registration.teamLeader.email === member.email ||
            registration.teamMembers.some(m => m.email === member.email);

        if (alreadyJoined) {
            return res.status(400).json({ message: "This email has already joined this team." });
        }

        registration.teamMembers.push({
            ...member,
            registeredBy: req.user._id
        });
        await registration.save();

        res.status(200).json(registration);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createRegistration,
    deleteRegistration,
    getMyRegistrations,
    getRegistrationsForMyEvents,
    lookupTeam,
    joinTeam,
    withdrawFromRegistration
};
