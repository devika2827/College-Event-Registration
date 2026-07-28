const express = require("express");
const cors = require("cors");
const dns=require("dns");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

const connectDB = require("./config/db");

const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/AuthenticationRoutes");

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5500", // Change if your frontend runs on another URL
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/events", eventRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((error) => {
    console.log(error.message);
    process.exit(1);
});
