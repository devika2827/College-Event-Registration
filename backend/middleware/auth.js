const { User } = require("../models/Authentication");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res,next) => {
    const token = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ", "");
    
    if (!token) {
        return res.status(401).json({ message: "User not logged in" });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded?._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry"); 

        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user = user;
        next();
        
    }catch (error) {
        console.error(error);
        return res.status(401).json({ message: error.message });
    }
}

module.exports = { verifyToken };