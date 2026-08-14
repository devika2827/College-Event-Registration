const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        index:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },

    name:{
        type:String,
        required:false,
        trim:true
    },

    password:{
        type:String,
        required:[true, "Password is required"]
    },

    Verified:{
        type:Boolean,
        default:false
    },

    refreshToken:{
        type:String
    },

    forgotPasswordToken:{
        type:String
    },

    forgotPasswordTokenExpiry:{
        type:Date
    },

    emailVerificationToken:{
        type:String
    },

    emailVerificationExpiry:{
        type:Date
    }

},{
    timestamps:true
});


userSchema.pre("save", async function(){

    if(!this.isModified("password")){
        return ;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordCorrect = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.generateAccessToken = function(){
    const payload = { _id: this._id, email: this.email, username: this.username };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
    return accessToken;
}

userSchema.methods.generateRefreshToken = function(){
    const payload = { _id: this._id };
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
    return refreshToken;
}

userSchema.methods.generateTemporaryToken = function(){
    const unHashedToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(unHashedToken).digest('hex');
    const expiryTime = Date.now() + 20 * 60 * 1000; 
    return { unHashedToken, hashedToken, expiryTime };
}

module.exports = { User: mongoose.model("User", userSchema) };