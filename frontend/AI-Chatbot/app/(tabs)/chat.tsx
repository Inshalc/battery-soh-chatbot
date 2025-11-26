import React, { useState, useRef, useEffect } from 'react';
import ChatInput from '@/components/chat/ChatInput.js';
import Screen from '@/components/layout/Screen';
import { theme } from "@/themes/theme";
import { 
  KeyboardAvoidingView, 
  Platform, 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  Modal,
  Alert,
  StatusBar,
  SafeAreaView 
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MessageList from '@/components/chat/MessageList';
import { useLocalSearchParams } from 'expo-router';
import { apiService } from '@/services/api';
import BatteryInputForm from '@/components/battery/BatteryInputForm';

export type ChatMsg = { id: number; isUser: boolean; text: string };

const initialMessages: ChatMsg[] = [
  {
    id: 1, 
    isUser: false, 
    text: "🔋 Hello! I'm your Battery Health Assistant powered by Gemini AI.\n\nI can help you:\n• Check battery State of Health (SOH)\n• Analyze battery cell data\n• Answer battery questions\n• Provide maintenance tips\n\nTry asking about battery health or technology!"
  }
];

export default function Chat() {
  const [messages, setMessages] = useState<ChatMsg[]>(initialMessages);
  const [currentBatterySOH, setCurrentBatterySOH] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBatteryModal, setShowBatteryModal] = useState(false);
  const scrollViewRef = useRef(null);

  const insets = useSafeAreaInsets();
  const { preLoadedMessage } = useLocalSearchParams();
  const prefill = typeof preLoadedMessage === 'string' ? preLoadedMessage : '';

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      // scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isProcessing) return;

    const userMessage: ChatMsg = { id: Date.now(), text: message, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const response = await apiService.sendChatMessage(message, currentBatterySOH);
      
      const aiMessage: ChatMsg = { 
        id: Date.now() + 1, 
        text: response.response, 
        isUser: false 
      };
      setMessages(prev => [...prev, aiMessage]);

      if (response.soh !== undefined) {
        setCurrentBatterySOH(response.soh);
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMsg = {
        id: Date.now() + 1,
        text: "⚠️ Connection issue. Please try again.",
        isUser: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePredictionComplete = (prediction: any) => {
    setCurrentBatterySOH(prediction.prediction.soh);
    
    const predictionMessage: ChatMsg = {
      id: Date.now(),
      text: `🔋 Battery Analysis Complete!\n\nState of Health: ${prediction.prediction.soh_percentage}%\nStatus: ${prediction.prediction.status}\nMessage: ${prediction.prediction.message}`,
      isUser: false
    };
    setMessages(prev => [...prev, predictionMessage]);
    setShowBatteryModal(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.surface} />
      
      <Screen style={styles.screen}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.kav}
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
        >
          {/* Message List - Takes most space */}
          <View style={styles.messageArea}>
            <MessageList messages={messages} />
          </View>

          {/* Input Area - Fixed at bottom */}
          <View style={[styles.inputArea, { paddingBottom: insets.bottom }]}>
            
            {/* Battery SOH Status */}
            {currentBatterySOH && (
              <View style={styles.sohBanner}>
                <Text style={styles.sohText}>
                  🔋 SOH: {(currentBatterySOH * 100).toFixed(1)}% | 
                  {currentBatterySOH >= 0.6 ? ' ✅ Healthy' : ' ⚠️ Needs Attention'}
                </Text>
              </View>
            )}

            {/* Analyze Button */}
            <TouchableOpacity 
              style={styles.analyzeButton}
              onPress={() => setShowBatteryModal(true)}
            >
              <Text style={styles.analyzeButtonText}>🔋 Analyze Battery Data</Text>
            </TouchableOpacity>

            {/* Chat Input */}
            <View style={styles.chatInputContainer}>
              <ChatInput 
                placeholder='Ask about batteries or type "check health"...'
                preLoadedInput={prefill}
                onSend={handleSendMessage}
                onPick={(file: { name?: string }) => {
                  Alert.alert('File Selected', `Analyze battery data from ${file.name}?`);
                }}
                disabled={isProcessing}
              />
            </View>

            {/* Processing Indicator */}
            {isProcessing && (
              <View style={styles.processingContainer}>
                <Text style={styles.processingText}>AI is thinking...</Text>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>

        {/* Battery Modal */}
        <Modal
          visible={showBatteryModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <BatteryInputForm 
            onPredictionComplete={handlePredictionComplete}
            onClose={() => setShowBatteryModal(false)}
          />
        </Modal>
      </Screen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  kav: {
    flex: 1,
  },
  messageArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  inputArea: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  sohBanner: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  sohText: {
    color: theme.colors.success,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
  analyzeButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
  chatInputContainer: {
    // ChatInput has its own styling
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  processingText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    fontStyle: 'italic',
  },
});