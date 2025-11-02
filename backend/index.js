const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/battery', require('./routes/battery'));
app.use('/api/chat', require('./routes/chat'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date().toISOString(),
    services: {
      battery_prediction: 'active',
      chatbot: 'active',
      gemini_ai: process.env.GEMINI_API_KEY ? 'configured' : 'not configured'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔋 Battery API: http://localhost:${PORT}/api/battery`);
  console.log(`💬 Chat API: http://localhost:${PORT}/api/chat`);
});

module.exports = app;