const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    rollNo: {
        type: String,
        required: true
    },

    year: {
        type: Number,
        required: true
    },

    teamName: {
        type: String,
        default: ""
    },

    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },

    registrationId: {
        type: String,
        required: true,
        unique: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Registration", registrationSchema);