require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const axios = require("axios");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3001;
const FLASK_API_URL = process.env.FLASK_API_URL || "http://localhost:5001";

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  message: { error: "Too many requests. Please try again in a minute." },
});
app.use("/api/", limiter);

// Health check — forward to Flask, add server status
app.get("/api/health", async (req, res) => {
  try {
    const { data } = await axios.get(`${FLASK_API_URL}/api/health`, {
      timeout: 5000,
    });
    res.json({ ...data, node_server: "ok" });
  } catch (err) {
    res.status(503).json({
      status: "error",
      node_server: "ok",
      flask_api: "unreachable",
      error: err.message,
    });
  }
});

// Analyze endpoint — forward to Flask
app.post("/api/analyze", async (req, res) => {
  const { text } = req.body || {};
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Please provide a 'text' field." });
  }
  try {
    const { data } = await axios.post(
      `${FLASK_API_URL}/api/analyze`,
      { text },
      { timeout: 15000 }
    );
    res.json(data);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }
    res.status(503).json({
      error: "ML service unavailable. Ensure the Flask API is running.",
    });
  }
});

// Catch-all
app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.listen(PORT, () => {
  console.log(`✅ SentimentIQ server running on http://localhost:${PORT}`);
  console.log(`🔗 Forwarding ML requests to ${FLASK_API_URL}`);
});
