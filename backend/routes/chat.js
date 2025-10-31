const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * Chat with battery assistant
 * POST /api/chat/message
 * Body: { message: string, batterySOH?: number }
 */
router.post('/message', async (req, res) => {
  try {
    const { message, batterySOH } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string'
      });
    }

    // Check if it's a battery health query
    const lowerMessage = message.toLowerCase();
    const isHealthQuery = lowerMessage.includes('health') || 
                         lowerMessage.includes('soh') || 
                         lowerMessage.includes('status') ||
                         lowerMessage.includes('check battery') ||
                         lowerMessage.match(/(how is|what is).*(battery|health)/);

    // Handle battery health queries
    if (isHealthQuery) {
      if (batterySOH !== undefined && batterySOH !== null) {
        const status = batterySOH >= 0.6 ? 'healthy' : 'has a problem';
        const healthMessage = `The battery State of Health (SOH) is ${(batterySOH * 100).toFixed(1)}%. ` +
                             `Based on the threshold of 60%, the battery ${status}.`;
        
        return res.json({
          response: healthMessage,
          type: 'health_status',
          soh: batterySOH,
          isHealthy: batterySOH >= 0.6
        });
      } else {
        return res.json({
          response: "I can check battery health status, but I need the current State of Health (SOH) value. Please provide the battery SOH or run a prediction first.",
          type: 'health_request'
        });
      }
    }

    // Check if it's a general battery question (not requiring SOH)
    const isBatteryQuestion = lowerMessage.includes('battery') || 
                             lowerMessage.includes('charge') ||
                             lowerMessage.includes('lifespan') ||
                             lowerMessage.includes('recycl') ||
                             lowerMessage.includes('health') ||
                             lowerMessage.includes('maintain') ||
                             lowerMessage.includes('extend') ||
                             lowerMessage.includes('keep') ||
                             lowerMessage.includes('tips');

    // For general battery questions, use OpenAI
    if (isBatteryQuestion) {
      const openaiResponse = await getOpenAIResponse(message);
      return res.json({
        response: openaiResponse,
        type: 'battery_info'
      });
    }

    // For non-battery questions, provide a focused response
    const focusedResponse = "I'm specialized in battery technology and health. I can help you with questions about battery State of Health (SOH), maintenance, recycling, or extending battery lifespan. What would you like to know about batteries?";
    
    res.json({
      response: focusedResponse,
      type: 'general_guidance'
    });

  } catch (error) {
    console.error('Chat route error:', error);
    res.status(500).json({
      error: 'Chat service unavailable',
      details: error.message
    });
  }
});

/**
 * Get response from OpenAI API
 */
async function getOpenAIResponse(userMessage) {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful battery technology expert. Provide accurate, concise information about:
          - Battery health and State of Health (SOH)
          - Battery maintenance and best practices
          - Extending battery lifespan
          - Battery recycling and sustainability
          - Battery safety tips
          - Lithium-ion battery technology
          
          Keep responses practical and focused (2-3 paragraphs maximum). 
          If asked about non-battery topics, politely redirect to battery-related questions.`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 350,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;

  } catch (error) {
    console.error('OpenAI API error:', error.response?.data || error.message);
    
    // Fallback responses if OpenAI fails
    const fallbackResponses = {
      'how to keep a battery healthy': 'To keep batteries healthy: avoid extreme temperatures, prevent deep discharges, use manufacturer-approved chargers, and store at 40-60% charge when not in use for long periods.',
      'why is recycling batteries important': 'Battery recycling prevents hazardous materials from polluting the environment, conserves valuable resources like lithium and cobalt, and reduces the need for new mining operations.',
      'how to extend battery lifespan': 'Extend battery lifespan by avoiding frequent full discharges, keeping batteries between 20-80% charge, minimizing exposure to heat, and using smart charging practices.'
    };
    
    const lowerMessage = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(fallbackResponses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    
    return "I apologize, but I'm having trouble accessing battery information right now. Please try again in a few moments.";
  }
}

module.exports = router;