import React, { useState } from 'react';
import ChatInput from '@/components/chat/ChatInput.js';
import ProfileHeader from '@/components/layout/ProfileHeader';
import Screen from '@/components/layout/Screen';
import { theme } from "@/themes/theme";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import MessageList from '@/components/chat/MessageList';


// for messagelist
export type ChatMsg = { id: number; isUser: boolean; text: string };

const initialMessages: ChatMsg[] = [
  {id: 1, isUser: true, text: "Hey, are we still meeting at 7 PM for the project review?"},
  {id: 2, isUser: false, text: "Yes, 7 PM works great! I've finished the initial database structure."},
  {id: 3, isUser: true, text: "Awesome! Could you send me the link to the dev environment before then?"},
  {id: 4, isUser: false, text: "Sure thing, just generated a new one. Sending it over now."},
  {id: 5, isUser: true, text: "Got it, thanks! See you in an hour."},
  {id: 6, isUser: false, text: "Perfect, see you soon."},
  {id: 7, isUser: true, text: "Just logged in. I noticed an issue with the user authentication logic. The token expiration seems wrong."},
  {id: 8, isUser: false, text: "Oh, thanks for the quick heads-up. I was using a placeholder value for testing."},
  {id: 9, isUser: false, text: "I'll push a fix right now. It should be using 1 hour expiration, not 1 minute."},
  {id: 10, isUser: true, text: "Thanks. While you're at it, can we adjust the primary color palette in the CSS variables?"},
  {id: 11, isUser: false, text: "Definitely. What shade are we thinking? A deeper blue?"},
  {id: 12, isUser: true, text: "Exactly. Try hex #1A237E. It should match the new brand guidelines."},
  {id: 13, isUser: false, text: "Got the new hex code. Implementing that color change now."},
  {id: 14, isUser: true, text: "Looks much better! Are the unit tests passing for the data validation module?"},
  {id: 15, isUser: false, text: "They were passing an hour ago, but let me re-run the pipeline just to be safe."},
  {id: 16, isUser: false, text: "Okay, I got a green build. All 48 tests passed successfully."},
  {id: 17, isUser: true, text: "Great news. That covers the riskiest parts."},
  {id: 18, isUser: false, text: "I've uploaded the meeting agenda to the shared drive, by the way."},
  {id: 19, isUser: true, text: "Just saw the notification. Looks comprehensive."},
  {id: 20, isUser: false, text: "Alright, final check: ready for the review meeting in five minutes?"}
];

export default function Chat() {
  const [messages, setMessages] = useState<ChatMsg[]>(initialMessages);

  const tabBarHeight = useHeaderHeight();

  const insets = useSafeAreaInsets();
  const bottomOffset = tabBarHeight + insets.bottom;

  // fro header height padding
  const [headerHeight, setHeaderHeight] = useState(0);

  return (
    <Screen 
      avoidTopInset={true} 

      style={
        [
          {paddingBottom: 2 * insets.bottom},
          {paddingTop: headerHeight},
          // {paddingBottom: theme.spacing.lg},
          {gap: theme.spacing.lg}
        ]
      }
    >
      <ProfileHeader onHeightChange={setHeaderHeight} title="Chatbot"/>

      {/* For input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={2 * insets.bottom}
        style={styles.kav}
      >
        <MessageList messages={messages}/>

        <View style={[styles.inputContainer]}>
        <ChatInput 
          placeholder='Enter Prompt...'
          onSend={(msg: string) => 
            setMessages(prev => [...prev, { id: Date.now(), text: msg, isUser: true }])
          }
          onPick={(file: { name?: string}) => alert(`Selected file: ${file.name || 'Unnamed file'}`)}
        />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kav: {
    flex: 1,
  },

  inputContainer: {
    backgroundColor: 'transparent',
  }
});