const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbot.js");
const wrapAsync = require("../utils/wrapAsync.js");

// Chatbot search route
router.post("/search", wrapAsync(chatbotController.chatbotSearch));

// Test route to verify API is working
router.get("/test", (req, res) => {
    res.json({ message: "Chatbot API is working!", timestamp: new Date() });
});

module.exports = router;
