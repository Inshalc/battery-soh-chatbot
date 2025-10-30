import express from "express";
import axios from "axios";

const router = express.Router();

// POST /predict-soh
router.post("/", async (req, res) => {
  try {
    // Forward body to Python service
    const pythonRes = await axios.post("http://localhost:8000/predict", req.body, { timeout: 10000 });
    const soh = pythonRes.data.soh;

    // Use threshold if provided, else default 0.6
    const threshold = req.body.threshold ?? 0.6;
    const status = soh < threshold ? "Battery has a problem" : "Battery is healthy";

    res.json({ soh, status });
  } catch (err) {
    console.error("predict route error:", err.response?.data || err.message || err);
    res.status(500).json({ error: "Prediction service failed", details: err.response?.data || err.message });
  }
});

export default router;
