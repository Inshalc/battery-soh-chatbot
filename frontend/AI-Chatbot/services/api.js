// frontend/AI-Chatbot/services/api.js
import Constants from 'expo-constants';

// Get the correct API URL based on the environment
const getAPIBaseURL = () => {
  // Use the Expo manifest for development
  if (__DEV__) {
    // This automatically detects whether we're on device or simulator
    const debuggerHost = Constants.expoConfig?.hostUri;
    
    if (debuggerHost) {
      // Running on physical device - use the detected IP
      const host = debuggerHost.split(':')[0];
      return `http://${host}:3001/api`;
    }
  }
  
  // Fallback for simulator or production
  return 'http://localhost:3001/api';
};

export const apiService = {
  // Predict SOH from battery data
  async predictSOH(batteryData) {
    try {
      const API_URL = getAPIBaseURL();
      console.log('🔗 Using API URL:', API_URL);
      
      const response = await fetch(`${API_URL}/battery/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batteryData }),
      });
      return await response.json();
    } catch (error) {
      console.error('SOH Prediction API error:', error);
      throw error;
    }
  },

  // Send chat message to backend
  async sendChatMessage(message, batterySOH = null) {
    try {
      const API_URL = getAPIBaseURL();
      console.log('🔗 Using API URL:', API_URL);
      
      const response = await fetch(`${API_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, batterySOH }),
      });
      return await response.json();
    } catch (error) {
      console.error('Chat API error:', error);
      throw error;
    }
  },

  // Test with example data
  async testExample(exampleType = 'degraded') {
    try {
      const API_URL = getAPIBaseURL();
      const response = await fetch(`${API_URL}/battery/test-examples`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exampleType }),
      });
      return await response.json();
    } catch (error) {
      console.error('Test API error:', error);
      throw error;
    }
  }
};