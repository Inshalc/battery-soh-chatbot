# Battery Pack SOH Prediction with AI Chatbot

A comprehensive battery health monitoring system that predicts State of Health (SOH) using machine learning and provides AI-powered battery assistance. This project addresses the challenge of retired battery assessment by combining Linear Regression predictions with Gemini AI chatbot capabilities.

## Project Overview

This system provides efficient State of Health (SOH) testing for retired batteries, offering a sustainable alternative to traditional costly and time-consuming methods. The PulseBat dataset provides pulse voltage response data across various cells and conditions, enabling accurate SOH predictions.

### Key Features
- ML-powered SOH prediction using Linear Regression on 21 cell voltages
- AI chatbot integration with Google Gemini for intelligent battery assistance
- 60% threshold classification for clear health status reporting
- Mobile-first interface built with React Native and Expo
- Real-time analysis with statistical feature aggregation

## System Architecture
Frontend (React Native + Expo)
↓
Backend (Node.js + Express) → Gemini AI API
↓
ML Model (Python + Scikit-learn)

text

## Core Features

### Battery Health Analysis
- 21-cell voltage input (U1-U21) from battery packs
- Statistical feature aggregation (mean, median, std, min, max, skew)
- Linear Regression ML model for accurate SOH prediction
- Binary classification using 60% threshold (Healthy/Problem)

### AI-Powered Chatbot
- Gemini AI integration for intelligent responses
- Battery-specific knowledge base with expert information
- Real-time health status queries based on current SOH data
- Maintenance and recycling guidance powered by AI

### Mobile Interface
- Cross-platform compatibility (iOS/Android via Expo)
- Intuitive battery data input with example presets
- Real-time analysis results with clear health indicators
- Professional chat interface with message history

## Technical Stack

### Frontend
- React Native with Expo for cross-platform development
- TypeScript for type safety and better developer experience
- Expo Router for file-based navigation
- Custom UI components with consistent design system

### Backend
- Node.js with Express.js for robust API server
- RESTful API design with proper error handling
- CORS enabled for mobile application access
- Google Gemini API integration for AI capabilities

### Machine Learning
- Python 3.9 with scikit-learn for model training
- Linear Regression model for SOH prediction
- StandardScaler for feature normalization
- Joblib for model persistence and loading

### AI Integration
- Google Gemini API (gemini-2.0-flash-001 model)
- Custom prompt engineering for battery expertise
- Intelligent fallback system for API failures

## Project Structure
battery-soh-chatbot/
├── backend/ # Node.js Express server
│ ├── routes/ # API route handlers
│ │ ├── battery.js # SOH prediction endpoints
│ │ └── chat.js # Chatbot message handling
│ ├── services/ # Business logic services
│ │ └── geminiService.js # Gemini AI integration
│ ├── index.js # Server entry point
│ └── package.json # Backend dependencies
├── frontend/ # React Native Expo application
│ └── AI-Chatbot/ # Mobile app
│ ├── app/ # Expo Router file-based routing
│ │ ├── (tabs)/ # Tab navigation screens
│ │ │ ├── chat.tsx # Main chat interface
│ │ │ └── index.tsx # Home screen
│ │ └── _layout.tsx # Root layout configuration
│ ├── components/ # Reusable React components
│ │ ├── battery/ # Battery input and analysis
│ │ ├── chat/ # Chat interface components
│ │ └── ui/ # Base UI components
│ ├── services/ # API service layer
│ │ └── api.js # Backend communication
│ ├── themes/ # Design system and styling
│ └── package.json # Frontend dependencies
└── ml-model/ # Python machine learning
├── src/ # Training and inference scripts
│ ├── train_model.py # Model training script
│ ├── quick_test.py # Model inference script
│ └── config.py # Configuration settings
├── models/ # Saved trained models
│ └── model.pkl # Linear Regression model
├── data/ # Training datasets
├── scalers/ # Feature scalers
└── results/ # Model performance metrics

text

## Installation & Setup

### Prerequisites
- Node.js 16+ 
- Python 3.9+
- Expo CLI
- Google Gemini API key

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your GEMINI_API_KEY to the .env file

# Start the development server
npm start
2. Machine Learning Model
bash
# Navigate to ML model directory
cd ml-model

# Create virtual environment
python -m venv .venv

# Activate virtual environment
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
3. Frontend Setup
bash
# Navigate to frontend directory
cd frontend/AI-Chatbot

# Install dependencies
npm install

# Start Expo development server
npx expo start
4. Mobile Testing
Install Expo Go app on your iOS/Android device

Scan the QR code from the Expo terminal

Ensure your phone and computer are on the same network

Usage Guide
Battery Analysis Workflow
Open the application and navigate to the Chat tab

Tap "Analyze Battery" to open the input form

Choose example data:

"Fill Healthy Example" - Shows SOH > 60%

"Fill Unhealthy Example" - Shows SOH < 60%

Analyze to get SOH prediction and health classification

View results with detailed statistical features

AI Chatbot Interaction
Ask the chatbot questions like:

"Check my battery health" (after analysis)

"How does the ML model work?"

"What is battery State of Health?"

"Battery maintenance best practices"

"Why is battery recycling important?"

Project Requirements Met
Linear Regression Model - Trained on battery data for SOH prediction

21-cell Voltage Aggregation - Statistical features: mean, median, std, min, max, skew

60% Threshold Classification - Clear healthy/problem classification

Chatbot Integration - Health status reporting and battery knowledge

Gemini AI API - Intelligent responses to general battery questions

Mobile Application - Cross-platform compatibility with Expo

API Documentation
Battery Endpoints
POST /api/battery/predict - Predict SOH from 21 cell voltages

GET /api/battery/model-info - Get model information and features

POST /api/battery/health-status - Classify SOH value using threshold

POST /api/battery/test-examples - Test with predefined examples

Chat Endpoints
POST /api/chat/message - Send message to AI chatbot

GET /api/chat/test-gemini - Test Gemini API connection
