require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    console.log('Testing available models...');
    
    // Try to list models (if the API supports it)
    try {
      const models = await genAI.listModels();
      console.log('Available models:');
      models.forEach(model => {
        console.log(`- ${model.name} (${model.displayName})`);
      });
    } catch (listError) {
      console.log('Cannot list models, trying individual models...');
    }
    
    // Test individual models
    const testModels = [
      'gemini-1.0-pro',
      'gemini-1.0-pro-latest',
      'gemini-pro',
      'gemini-pro-latest',
      'models/gemini-pro'
    ];
    
    for (const modelName of testModels) {
      try {
        console.log(`\nTesting model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello');
        const response = await result.response;
        console.log(`✅ ${modelName} WORKS! Response: ${response.text().substring(0, 50)}...`);
        break; // Stop at first working model
      } catch (error) {
        console.log(`❌ ${modelName} failed: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('Overall error:', error.message);
  }
}

testModels();