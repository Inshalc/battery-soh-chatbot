const express = require('express');
const router = express.Router();

// Helper function for battery health advice
function getBatteryHealthAdvice(soh) {
    if (soh >= 0.8) {
        return "Your battery is in excellent condition! Continue with regular maintenance practices.";
    } else if (soh >= 0.6) {
        return "Your battery is in good condition but showing some aging. Monitor regularly and maintain good charging habits.";
    } else {
        return "Your battery requires attention. Consider replacement soon and avoid demanding applications.";
    }
}

// Comprehensive battery knowledge base
function getBatteryResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    const knowledgeBase = {
        'state of health': 'State of Health (SOH) measures a battery\'s current condition compared to its original state. It indicates capacity retention - a 100% SOH means like-new performance, while lower values show degradation. SOH considers factors like capacity loss, internal resistance, and charge retention ability.',
        
        'what is soh': 'SOH stands for State of Health. It\'s a percentage representing a battery\'s current capacity relative to its original capacity. For example, 80% SOH means the battery holds 80% of its original charge capacity. This is different from State of Charge (SOC) which shows current charge level.',
        
        'how to keep a battery healthy': 'To maintain battery health:\n• Avoid extreme temperatures (both hot and cold)\n• Prevent deep discharges - keep between 20-80% charge\n• Use manufacturer-approved chargers\n• Store at 40-60% charge for long periods\n• Avoid frequent fast charging\n• Perform regular calibration cycles',
        
        'why is recycling batteries important': 'Battery recycling is crucial because:\n• Prevents hazardous materials from polluting environment\n• Conserves valuable resources (lithium, cobalt, nickel)\n• Reduces need for new mining operations\n• Supports circular economy for battery materials\n• Reduces greenhouse gas emissions from production',
        
        'how to extend battery lifespan': 'Extend battery life by:\n• Avoid frequent full discharges\n• Keep charge between 20-80%\n• Minimize heat exposure\n• Use smart charging practices\n• Store properly when not in use\n• Avoid overcharging\n• Use compatible charging equipment',
        
        'battery maintenance tips': 'Essential battery maintenance:\n• Keep terminals clean and corrosion-free\n• Avoid physical damage\n• Store in cool, dry places\n• Use voltage stabilizers if needed\n• Perform regular capacity tests\n• Follow manufacturer guidelines\n• Monitor for swelling or damage',
        
        'recycling batteries': 'Battery recycling process:\n1. Collection and sorting by chemistry type\n2. Safe discharge and dismantling\n3. Material recovery (metals, plastics)\n4. Purification of recovered materials\n5. Manufacturing new products\n• Recycling rates vary by battery type\n• Proper disposal prevents environmental harm',
        
        'what is battery soh': 'Battery State of Health (SOH) is a key metric that indicates:\n• Remaining capacity compared to original\n• Overall battery condition and aging\n• Prediction of remaining useful life\n• SOH < 60% often indicates need for replacement\n• Regular SOH monitoring helps optimize battery usage',
        
        'soh threshold': 'The 60% SOH threshold is commonly used because:\n• Below 60%, batteries often can\'t provide required power\n• Significant capacity loss affects performance\n• Increased risk of sudden failure\n• Many applications require minimum 60% SOH for reliable operation\n• This threshold can be adjusted based on specific use cases'
    };
    
    // Find the best matching response
    for (const [key, response] of Object.entries(knowledgeBase)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    
    // Default battery response
    return "I specialize in battery technology! I can help with:\n• State of Health (SOH) explanations\n• Battery maintenance and best practices\n• Recycling information and importance\n• Lifespan extension advice\n• General battery technology questions\n\nWhat specific aspect would you like to know about?";
}

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

        const lowerMessage = message.toLowerCase();

        // Check if it's a CURRENT battery status query (needs SOH data)
        const isCurrentStatusQuery = 
            lowerMessage.includes('check') || 
            lowerMessage.includes('status') ||
            lowerMessage.includes('my battery') ||
            lowerMessage.match(/how is.*battery/) ||
            lowerMessage.match(/battery.*status/) ||
            (lowerMessage.includes('health') && lowerMessage.includes('my'));

        // Handle CURRENT battery status queries
        if (isCurrentStatusQuery) {
            if (batterySOH !== undefined && batterySOH !== null) {
                const status = batterySOH >= 0.6 ? 'healthy' : 'has a problem';
                const healthMessage = `The battery State of Health (SOH) is ${(batterySOH * 100).toFixed(1)}%. Based on the threshold of 60%, the battery ${status}.`;
                const advice = getBatteryHealthAdvice(batterySOH);
                
                return res.json({
                    response: `${healthMessage} ${advice}`,
                    type: 'health_status',
                    soh: batterySOH,
                    isHealthy: batterySOH >= 0.6,
                    advice: advice
                });
            } else {
                return res.json({
                    response: "I can check battery health status, but I need the current State of Health (SOH) value. Please provide the battery SOH or run a prediction first.",
                    type: 'health_request'
                });
            }
        }

        // For all other battery-related questions, use our knowledge base
        const isBatteryQuestion = 
            lowerMessage.includes('battery') || 
            lowerMessage.includes('soh') ||
            lowerMessage.includes('lithium') ||
            lowerMessage.includes('charge') ||
            lowerMessage.includes('recycl') ||
            lowerMessage.includes('health') ||
            lowerMessage.includes('maintain') ||
            lowerMessage.includes('extend') ||
            lowerMessage.includes('lifespan');

        if (isBatteryQuestion) {
            const batteryResponse = getBatteryResponse(message);
            return res.json({
                response: batteryResponse,
                type: 'battery_info'
            });
        }

        // For non-battery questions
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

module.exports = router;