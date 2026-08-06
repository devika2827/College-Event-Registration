const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name:{
        type:String,
        required:true
    },

    category:{
        type:String,
        required:true
    },

    date:{
        type:Date,
        required:true
    },

    registrationDeadline:{
        type:Date,
        required:true
    },

    startTime:{
        type:String,
        required:true
    },

    teamSize:{
        type:Number,
        required:true,
        min:1
    },

    organizerName:{
        type:String,
        required:true
    },

    organizerContact:{
        type:String,
        required:true
    },

    venue:{
        type:String,
        required:true
    },

    description:{
        type:String
    },

    rules: {
        type: [String],
        default: []
    },

    banner:{
        type:String,
        default:""
    },

    status:{
        type:String,
        enum:["Open","Closed"],
        default:"Open"
    }

},{
    timestamps:true
});

module.exports = mongoose.model("Event", eventSchema);