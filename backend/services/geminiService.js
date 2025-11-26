// backend/services/geminiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            console.warn('⚠️ GEMINI_API_KEY not found in environment variables');
            throw new Error('Gemini API key not configured');
        }
        
        console.log('🔑 Initializing Gemini with API key:', process.env.GEMINI_API_KEY.substring(0, 10) + '...');
        
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // Use the available models from your API
        this.model = this.genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash-001", // Using the stable Flash model
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        });
        
        console.log('✅ Gemini service initialized with model: gemini-2.0-flash-001');
        this.currentModel = "gemini-2.0-flash-001";
    }

    async getResponse(userMessage) {
        try {
            console.log('🤖 Sending to Gemini:', userMessage);
            
            const prompt = `You are a Battery Health Expert AI assistant integrated with a machine learning system that predicts battery State of Health (SOH).

System Context:
- Uses Linear Regression machine learning model
- Analyzes 21 cell voltage measurements (U1-U21)
- Aggregates data into statistical features (mean, median, std, min, max, skew)
- Classifies batteries as healthy (SOH ≥ 60%) or problematic (SOH < 60%)

User question: ${userMessage}

Provide a helpful, expert response about battery technology. Focus on:
- Battery State of Health (SOH) analysis
- Maintenance best practices
- Recycling importance
- Lifespan optimization
- General battery technology

If the question is unrelated to batteries, gently steer the conversation back to battery topics while still being helpful.`;

            console.log('📤 Making Gemini API request...');
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            console.log('✅ Gemini response received successfully');
            return text;

        } catch (error) {
            console.error('❌ Gemini API error:', error.message);
            
            // Try alternative available models
            return this.tryAlternativeModels(userMessage);
        }
    }

    async tryAlternativeModels(userMessage) {
        console.log('🔄 Trying alternative models...');
        
        const alternativeModels = [
            "gemini-2.0-flash",      // Alternative flash model
            "gemini-2.5-flash",      // Latest flash model
            "gemini-2.5-pro",        // Pro model
            "gemini-2.0-flash-lite"  // Lite version
        ];

        for (const modelName of alternativeModels) {
            try {
                console.log(`🔄 Trying model: ${modelName}`);
                const altModel = this.genAI.getGenerativeModel({ 
                    model: modelName,
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                });
                
                const result = await altModel.generateContent(userMessage);
                const response = await result.response;
                console.log(`✅ Success with model: ${modelName}`);
                this.currentModel = modelName;
                this.model = altModel;
                return response.text();
                
            } catch (altError) {
                console.log(`❌ Model ${modelName} failed:`, altError.message);
                continue;
            }
        }
        
        throw new Error('All Gemini models failed. Using fallback responses.');
    }

    async testConnection() {
        try {
            console.log('🧪 Testing Gemini connection...');
            const testResult = await this.model.generateContent('Respond with "Gemini 2.0 Flash is working! Ready for battery health analysis." in a short test message.');
            const response = await testResult.response;
            return { 
                success: true, 
                message: response.text(),
                model: this.currentModel,
                available: true
            };
        } catch (error) {
            return { 
                success: false, 
                error: error.message,
                model: this.currentModel,
                available: false
            };
        }
    }
}

module.exports = new GeminiService();