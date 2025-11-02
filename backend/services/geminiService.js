const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    console.log('🔧 Initializing Gemini Service...');
    
    if (process.env.GEMINI_API_KEY) {
      try {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ 
          model: "gemini-pro",
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        });
        this.isConfigured = true;
        console.log('✅ Gemini Service configured successfully');
      } catch (error) {
        console.error('❌ Gemini configuration error:', error);
        this.isConfigured = false;
      }
    } else {
      console.log('❌ Gemini API key not found');
      this.isConfigured = false;
    }
  }

  async generateResponse(userMessage) {
    if (!this.isConfigured) {
      throw new Error('Gemini not configured');
    }

    try {
      const prompt = `You are a battery technology expert. Provide accurate, concise information about battery health, SOH, maintenance, and recycling. Keep responses focused and practical.

User Question: ${userMessage}`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }
}

module.exports = new GeminiService();