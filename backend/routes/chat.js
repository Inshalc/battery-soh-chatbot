// backend/routes/chat.js
const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

// Add this function to clean Gemini's markdown
function cleanGeminiResponse(text) {
    if (!text) return text;
    
    // Remove bold markers (**text** → text)
    let cleaned = text.replace(/\*\*(.*?)\*\*/g, '$1');
    
    // Remove other markdown if needed
    cleaned = cleaned.replace(/\*(.*?)\*/g, '$1'); // Remove italics
    cleaned = cleaned.replace(/`(.*?)`/g, '$1');   // Remove code blocks
    
    // Clean up excessive newlines
    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    return cleaned.trim();
}

// Helper function for battery health advice
function getBatteryHealthAdvice(soh) {
    if (soh >= 0.8) {
        return "🎉 Your battery is in excellent condition! Continue with your current maintenance practices.";
    } else if (soh >= 0.6) {
        return "✅ Your battery is in good condition but showing some aging. Monitor regularly and maintain good charging habits.";
    } else {
        return "⚠️ Your battery requires attention. Consider replacement soon and avoid demanding applications.";
    }
}

/**
 * Chat with battery assistant - WITH CLEANED RESPONSES
 */
router.post('/message', async (req, res) => {
    try {
        const { message, batterySOH } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                error: 'Message is required and must be a string'
            });
        }

        const lowerMessage = message.toLowerCase().trim();
        console.log('💬 Received message:', message, 'SOH:', batterySOH);

        // Handle battery health status check
        if ((lowerMessage.includes('check') || lowerMessage.includes('status') || lowerMessage.includes('health')) && 
            (lowerMessage.includes('battery') || lowerMessage.includes('soh'))) {
            
            if (batterySOH !== undefined && batterySOH !== null) {
                const status = batterySOH >= 0.6 ? 'healthy' : 'has a problem';
                // Clean this response too if it has markdown
                const healthMessage = `🔋 Battery Health Report\n\nState of Health: ${(batterySOH * 100).toFixed(1)}%\nStatus: ${status}\nThreshold: 60% (industry standard)\nML Model: Linear Regression\nInput Data: 21 cell voltages aggregated to 6 features`;
                const advice = getBatteryHealthAdvice(batterySOH);
                
                return res.json({
                    response: `${healthMessage}\n\n${advice}`,
                    type: 'health_status',
                    soh: batterySOH,
                    isHealthy: batterySOH >= 0.6
                });
            } else {
                return res.json({
                    response: "I'd be happy to check your battery health! First, please use the 'Analyze Battery' feature to measure the State of Health using our machine learning model. This requires 21 cell voltage measurements from your battery pack.",
                    type: 'health_request'
                });
            }
        }

        // USE GEMINI FOR ALL MESSAGES
        console.log('🚀 Forwarding to Gemini service...');
        try {
            const geminiResponse = await geminiService.getResponse(message);
            console.log('✅ Gemini response successful');
            
            // CLEAN THE RESPONSE BEFORE SENDING
            const cleanedResponse = cleanGeminiResponse(geminiResponse);
            
            return res.json({
                response: cleanedResponse,
                type: 'gemini_response',
                soh: batterySOH,
                cleaned: true
            });

        } catch (geminiError) {
            console.error('❌ Gemini failed:', geminiError.message);
            
            // Enhanced fallback (already clean)
            let fallbackResponse = "I specialize in battery technology and health analysis. ";
            
            if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
                fallbackResponse = "Hello! I'm your Battery Health Assistant. I can help with battery State of Health analysis, maintenance tips, and recycling information. How can I assist you with batteries today?";
            } else if (lowerMessage.includes('lithium')) {
                fallbackResponse = "Lithium-ion batteries offer high energy density and are used in EVs and electronics. Our system analyzes 21 cell voltages using Linear Regression to predict battery health. Proper maintenance extends their lifespan significantly.";
            } else if (lowerMessage.includes('soh') || lowerMessage.includes('state of health')) {
                fallbackResponse = "State of Health (SOH) measures battery condition. Our ML system uses 21 cell voltage measurements aggregated into statistical features to predict SOH. You can analyze your battery using the Analyze Battery feature.";
            } else if (lowerMessage.includes('maintain') || lowerMessage.includes('care')) {
                fallbackResponse = "To maintain battery health: avoid extreme temperatures, keep charge between 20-80%, use compatible chargers, store at 40-60% charge, and perform regular calibration cycles.";
            } else {
                fallbackResponse += "Our system uses Linear Regression machine learning on 21 cell voltages to predict battery health. You can analyze your battery or ask me about maintenance, recycling, or battery technology.";
            }
            
            return res.json({
                response: fallbackResponse,
                type: 'fallback_response',
                soh: batterySOH
            });
        }

    } catch (error) {
        console.error('💥 Chat route error:', error);
        res.status(500).json({
            error: 'Chat service temporarily unavailable',
            details: error.message
        });
    }
});

module.exports = router;