const mongoose = require("mongoose");

const leaderSchema = new mongoose.Schema({

    registeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    college: {
        type: String,
        required: true,
        trim: true
    },

    department: {
        type: String,
        required: true,
        trim: true
    },

    year: {
        type: String,
        required: true
    },

    rollNo: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true
    },

    phone: {
        type: String,
        required: true,
        trim: true
    }

}, { _id: false });


const memberSchema = new mongoose.Schema({

    registeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    college: {
        type: String,
        required: true,
        trim: true
    },

    department: {
        type: String,
        required: true,
        trim: true
    },

    year: {
        type: String,
        required: true
    },

    rollNo: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true
    },

    phone: {
        type: String,
        required: true,
        trim: true
    }

}, { _id: false });


const registrationSchema = new mongoose.Schema({
   
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },

    eventName: {
    type: String,
    required: true,
    trim: true
    },

    registrationId: {
        type: String,
        required: true,
        unique: true
    },

    participationType: {
        type: String,
        enum: ["Solo", "Team"],
        required: true
    },

    teamName: {
        type: String,
        required: true,
        trim: true
    },

    teamSize: {
        type: Number,
        required: true,
        min: 1
    },

    teamLeader: {
        type: leaderSchema,
        required: true
    },

    teamMembers: {
        type: [memberSchema],
        default: []
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Registration", registrationSchema);