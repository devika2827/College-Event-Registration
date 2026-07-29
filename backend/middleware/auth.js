const { User } = require("../models/Authentication");
const jwt = require("jsonwebtoken");

export const verifyToken = async (req, res,next) => {
    const token = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "Unauthorized request" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry"); 
        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    }catch (error) {
        return res.status(401).json({ message: "Unauthorized request" });
    }
}