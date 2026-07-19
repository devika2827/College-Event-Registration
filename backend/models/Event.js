const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({

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

    endTime:{
        type:String,
        required:true
    },

    venue:{
        type:String,
        required:true
    },

    capacity:{
        type:Number,
        required:true
    },

    description:{
        type:String
    },

    // banner:{
    //     type:String
    // },

    status:{
        type:String,
        enum:["Open","Closed"],
        default:"Open"
    }

},{
    timestamps:true
});

module.exports = mongoose.model("Event", eventSchema);