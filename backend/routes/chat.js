// backend/routes/chat.js
const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

// Enhanced smart responses (backup)
const smartResponses = {
    greeting: `🔋 **Battery Health Assistant - Powered by Gemini AI**\n\nHello! I'm your AI-powered battery expert using Google's Gemini 2.0 Flash model. I can help you:\n\n• **Analyze battery health** using our ML system (21 cell voltages → SOH prediction)\n• **Provide maintenance recommendations** for optimal performance\n• **Explain battery recycling** processes and importance\n• **Optimize battery lifespan** with best practices\n• **Answer technical questions** about battery technology\n\nWhat would you like to know about batteries today?`,

    battery_health: `**🔬 Battery Health Analysis System**\n\nOur advanced system uses **machine learning** to predict battery State of Health:\n\n📊 **ML Pipeline:**\n- **Input:** 21 cell voltage measurements (U1-U21)\n- **Processing:** Statistical feature aggregation (mean, median, std, min, max, skew)\n- **Model:** Linear Regression trained on battery data\n- **Output:** Accurate SOH prediction with health classification\n\n🎯 **Health Classification:**\n- 🟢 **80-100%:** Excellent condition (like-new performance)\n- 🟡 **60-80%:** Good condition (normal aging, monitor regularly)\n- 🟠 **40-60%:** Fair condition (significant degradation)\n- 🔴 **<40%:** Poor condition (replace soon)\n\n💡 **Industry Standard:** 60% threshold ensures reliable operation in most applications.`,

    lithium: `**⚡ Lithium-Ion Battery Technology**\n\n🔋 **Technical Specifications:**\n- **Energy Density:** 150-250 Wh/kg (high efficiency)\n- **Cycle Life:** 300-500+ charge cycles\n- **Self-Discharge:** ~5% per month (low loss)\n- **Voltage Range:** 3.0V - 4.2V per cell\n- **Memory Effect:** None (unlike older technologies)\n\n🚀 **Advanced Features:**\n- Rapid charging capabilities\n- High power density for demanding applications\n- Excellent temperature performance range\n- Advanced Battery Management Systems (BMS)\n\n🛡️ **Safety Systems:**\n- Thermal runaway protection\n- Overcharge/over-discharge prevention\n- Cell balancing technology\n- State of Health monitoring\n\nOur ML system specifically analyzes lithium-ion battery packs using 21 cell voltage measurements.`,

    maintenance: `**🛠️ Battery Maintenance Excellence**\n\n📈 **Proactive Maintenance Strategy:**\n\n🔋 **Daily Operational Practices:**\n- Maintain 20-80% charge for daily cycling\n- Avoid temperature extremes (>35°C or <0°C)\n- Use manufacturer-certified charging equipment\n- Prevent physical stress and impacts\n\n⚡ **Charging Optimization:**\n- Implement partial charging cycles (20-80%)\n- Avoid continuous 0-100% deep cycles\n- Utilize smart charging algorithms\n- Monitor charging temperature\n\n📦 **Storage Protocols:**\n- Store at 40-60% state of charge\n- Maintain 15-25°C storage temperature\n- Conduct quarterly charge maintenance\n- Use climate-controlled environments\n\n🔍 **Monitoring & Analytics:**\n- Regular SOH analysis using our ML system\n- Track performance degradation trends\n- Monitor cell voltage balance\n- Predictive maintenance scheduling`,

    recycling: `**🌱 Battery Recycling & Circular Economy**\n\n♻️ **Environmental Imperative:**\n- **Material Recovery:** 95%+ of lithium, cobalt, nickel\n- **Pollution Prevention:** Zero landfill contamination\n- **Resource Conservation:** Reduced mining requirements\n- **Carbon Reduction:** Lower lifecycle emissions\n\n🔬 **Advanced Recycling Process:**\n1. **Collection & Sorting:** Chemical identification\n2. **Safe Discharge:** Energy recovery systems\n3. **Mechanical Processing:** Shredding and separation\n4. **Hydrometallurgical Treatment:** Material purification\n5. **Manufacturing Ready:** High-purity materials\n\n📊 **Sustainability Impact:**\n- 70% reduction in water usage vs. mining\n- 40% lower energy consumption\n- 85% reduction in greenhouse gases\n- Complete heavy metal containment\n\n📍 **Responsible Disposal:** Certified recycling centers only - never municipal waste!`,

    analysis: `**🔍 Battery Health Analysis Available**\n\n🎯 **Ready to analyze your battery health?**\n\nOur machine learning system provides comprehensive battery assessment:\n\n📋 **Required Input:**\n- 21 cell voltage measurements (U1-U21)\n- Voltage range: 2.5V - 4.5V per cell\n- Typical operating conditions data\n\n🔧 **Analysis Process:**\n1. Input cell voltages via "Analyze Battery"\n2. Automated statistical feature calculation\n3. Linear Regression ML model processing\n4. SOH prediction and classification\n5. Detailed health report generation\n\n📊 **Results Include:**\n- **State of Health percentage** (primary metric)\n- **Health status classification** (Healthy/Attention)\n- **Maintenance recommendations** (actionable insights)\n- **Performance predictions** (remaining lifespan)\n\n🚀 **Get started with the Analyze Battery feature above!**`
};

// Helper function
function getBatteryHealthAdvice(soh) {
    if (soh >= 0.8) return "🎉 **Excellent Condition!** Your battery performs like new. Continue current maintenance practices for optimal longevity.";
    if (soh >= 0.6) return "✅ **Good Condition!** Your battery shows normal aging patterns. Maintain consistent charging habits and monitor regularly.";
    return "⚠️ **Attention Required!** Significant degradation detected. Consider replacement planning and avoid high-demand applications.";
}

router.post('/message', async (req, res) => {
    try {
        const { message, batterySOH } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message is required' });
        }

        const lowerMessage = message.toLowerCase().trim();
        console.log('💬 Received:', message, 'SOH:', batterySOH);

        // Battery health status check
        if ((lowerMessage.includes('check') || lowerMessage.includes('status') || lowerMessage.includes('health')) && 
            (lowerMessage.includes('battery') || lowerMessage.includes('soh'))) {
            
            if (batterySOH !== undefined && batterySOH !== null) {
                const status = batterySOH >= 0.6 ? 'healthy' : 'has a problem';
                const statusIcon = batterySOH >= 0.6 ? '🟢' : '🔴';
                const report = `🔋 **Battery Health Analysis Report**\n\n${statusIcon} **State of Health:** ${(batterySOH * 100).toFixed(1)}%\n📊 **Status:** ${status}\n⚡ **Classification:** ${batterySOH >= 0.6 ? 'Operational - Healthy' : 'Degraded - Attention Required'}\n🎯 **Threshold:** 60% (industry standard)\n🤖 **ML Model:** Linear Regression\n📈 **Input Features:** 21 cell voltages → 6 statistical aggregates`;
                
                return res.json({
                    response: `${report}\n\n${getBatteryHealthAdvice(batterySOH)}`,
                    type: 'health_status',
                    soh: batterySOH,
                    isHealthy: batterySOH >= 0.6
                });
            } else {
                return res.json({
                    response: smartResponses.analysis,
                    type: 'analysis_guide'
                });
            }
        }

        // Use Gemini AI for all responses
        let geminiUsed = false;
        try {
            console.log('🚀 Using Gemini AI...');
            const geminiResponse = await geminiService.getResponse(message);
            geminiUsed = true;
            
            return res.json({
                response: geminiResponse,
                type: 'gemini_ai_response',
                soh: batterySOH,
                ai_model: 'Gemini 2.0 Flash'
            });
        } catch (geminiError) {
            console.log('🔄 Gemini unavailable, using enhanced knowledge base');
        }

        // Enhanced fallback responses
        let response = smartResponses.greeting;
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            response = smartResponses.greeting;
        } else if (lowerMessage.includes('lithium') || lowerMessage.includes('li-ion')) {
            response = smartResponses.lithium;
        } else if (lowerMessage.includes('soh') || lowerMessage.includes('state of health') || lowerMessage.includes('battery health')) {
            response = smartResponses.battery_health;
        } else if (lowerMessage.includes('maintain') || lowerMessage.includes('care') || lowerMessage.includes('tip')) {
            response = smartResponses.maintenance;
        } else if (lowerMessage.includes('recycl') || lowerMessage.includes('environment') || lowerMessage.includes('sustain')) {
            response = smartResponses.recycling;
        } else if (lowerMessage.includes('analyze') || lowerMessage.includes('predict') || lowerMessage.includes('test')) {
            response = smartResponses.analysis;
        } else if (lowerMessage.includes('what can you do') || lowerMessage.includes('help')) {
            response = smartResponses.greeting;
        }

        return res.json({
            response: response,
            type: geminiUsed ? 'gemini_ai_response' : 'enhanced_knowledge_base',
            soh: batterySOH,
            ai_model: geminiUsed ? 'Gemini 2.0 Flash' : 'Enhanced Knowledge Base'
        });

    } catch (error) {
        console.error('💥 Chat route error:', error);
        res.status(500).json({ 
            error: 'Chat service temporarily unavailable',
            details: error.message 
        });
    }
});

// Test endpoint
router.get('/test-gemini', async (req, res) => {
    try {
        const testResult = await geminiService.testConnection();
        res.json({
            ...testResult,
            note: 'Using Gemini 2.0 Flash model from available models list'
        });
    } catch (error) {
        res.json({ 
            success: false, 
            error: error.message,
            available_models: [
                'gemini-2.5-flash',
                'gemini-2.5-pro', 
                'gemini-2.0-flash',
                'gemini-2.0-flash-001',
                'gemini-2.0-flash-lite'
            ]
        });
    }
});

module.exports = router;