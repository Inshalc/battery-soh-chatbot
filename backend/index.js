import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import predictRouter from "./routes/predict.js";
import chatbotRouter from "./routes/chatbot.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/predict-soh", predictRouter);
app.use("/ask-battery", chatbotRouter);

// Health check
app.get("/", (req, res) => res.send("Backend running ✅"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
