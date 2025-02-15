const axios = require("axios");
const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

console.log("\n✅ Bot Ready! Processing Join Requests...");

// Auto-Approve Function
async function approveRequests() {
  try {
    const response = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`, {
      params: { allowed_updates: ["chat_join_request"] }
    });

    if (!response.data.ok) throw new Error("Error Fetching Updates");

    const updates = response.data.result;
    for (const update of updates) {
      if (update.chat_join_request) {
        const { chat, from } = update.chat_join_request;
        console.log(`✅ Approving ${from.username || from.id}`);

        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/approveChatJoinRequest`, {
          chat_id: chat.id,
          user_id: from.id
        });
      }
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run Every 10 Seconds
setInterval(approveRequests, 10000);

// Start Server
app.listen(PORT, () => console.log(`🚀 Server Running on Port ${PORT}`));