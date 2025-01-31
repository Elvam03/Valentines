const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // To load environment variables

const app = express();
app.use(express.json());
app.use(cors());

// Serve a simple response for the root path
app.get("/", (req, res) => {
    res.send("Welcome to the Valentine's server!");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define Message Schema
const MessageSchema = new mongoose.Schema({
    name: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", MessageSchema);

app.post("/send-message", async (req, res) => {
    try {
        const { name, message } = req.body;
        const newMessage = new Message({ name, message });
        const savedMessage = await newMessage.save();
        res.json({ success: true, message: "Message saved!", data: savedMessage });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error saving message" });
    }
});


// API Route to Save a Message
app.post("/send-message", async (req, res) => {
    try {
        const { name, message } = req.body;
        const newMessage = new Message({ name, message });
        await newMessage.save();
        res.json({ success: true, message: "Message saved!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error saving message" });
    }
});

// API Route to Get All Messages
app.get("/messages", async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching messages" });
    }
});

// Start Server
const PORT = process.env.PORT || 5002; // Make sure the port matches the one you're using
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
