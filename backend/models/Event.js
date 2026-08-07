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

    minTeamSize:{
        type:Number,
        required:true,
        min:1
    },

    maxTeamSize:{
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

    mode:{
        type:String,
        enum:["Offline","Online"],
        default:"Offline"
    },

    venue:{
        type:String,
        required:function() { return this.mode !== "Online"; }
    },

    eligibility:{
        type:String,
        enum:["Open","College Only"],
        default:"Open"
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