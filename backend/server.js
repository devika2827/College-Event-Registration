const express = require("express");
const cors = require("cors");

import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
});

import connectDB from "./config/db.js";

const eventRoutes = require("./routes/eventRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/events", eventRoutes);

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
