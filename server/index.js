require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const axios = require("axios");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3001;
const FLASK_API_URL = process.env.FLASK_API_URL || "http://localhost:5001";
const UPSTREAM_TIMEOUT = parseInt(process.env.UPSTREAM_TIMEOUT || "60000", 10);
const HEALTH_TIMEOUT = parseInt(process.env.HEALTH_TIMEOUT || "10000", 10);

// Trust proxy for Render reverse proxy (1 hop)
// Accurately identifies client IPs from X-Forwarded-For without trusting arbitrary upstream proxies
app.set("trust proxy", 1);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Rate limiting for ML inference requests
// Excludes health checks to prevent polling from blocking predictions
const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX || "60", 10), // 60 requests per minute per IP
  standardHeaders: true, // Return standard RateLimit headers
  legacyHeaders: false, // Disable X-RateLimit headers
  message: {
    error: "Too many analysis requests. Please wait a moment before trying again.",
  },
});

// Health check — forward to Flask, add server status (excluded from prediction rate limiter)
app.get("/api/health", async (req, res) => {
  try {
    const { data } = await axios.get(`${FLASK_API_URL}/api/health`, {
      timeout: HEALTH_TIMEOUT,
    });
    res.json({ ...data, node_server: "ok" });
  } catch (err) {
    res.status(503).json({
      status: "error",
      model_ready: false,
      node_server: "ok",
      flask_api: "unreachable",
      error: "ML service is warming up. Please wait for cold start to complete.",
    });
  }
});

// Analyze endpoint — forward to Flask with dedicated rate limiting and cold-start tolerance
app.post("/api/analyze", analyzeLimiter, async (req, res) => {
  const { text } = req.body || {};
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Please provide a 'text' field." });
  }
  try {
    const { data } = await axios.post(
      `${FLASK_API_URL}/api/analyze`,
      { text },
      { timeout: UPSTREAM_TIMEOUT }
    );
    res.json(data);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }
    const isTimeout =
      err.code === "ECONNABORTED" ||
      err.code === "ETIMEDOUT" ||
      (err.message && err.message.toLowerCase().includes("timeout"));
    res.status(503).json({
      error: isTimeout
        ? "ML service timed out while waking up. The model is still cold-starting on Render; please retry in a few moments."
        : "ML service is warming up or temporarily unavailable. Please allow a moment for cold start and try again.",
    });
  }
});

// Catch-all
app.use((req, res) => res.status(404).json({ error: "Not found" }));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ SentimentIQ server running on http://localhost:${PORT}`);
    console.log(`🔗 Forwarding ML requests to ${FLASK_API_URL}`);
  });
}

module.exports = app;

