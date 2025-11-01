import React, { useState } from 'react';
import ChatInput from '@/components/chat/ChatInput.js';
import ProfileHeader from '@/components/layout/ProfileHeader';
import Screen from '@/components/layout/Screen';
import { theme } from "@/themes/theme";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const INPUT_HEIGHT = 56;
const tabBarHeight = 52;

export default function Chat() {

  const insets = useSafeAreaInsets();
  const bottomOffset = tabBarHeight + insets.bottom;

  // fro header height padding
  const [headerHeight, setHeaderHeight] = useState(0);

  return (
    <Screen avoidTopInset={true} style={{paddingTop: headerHeight}}>
      <ProfileHeader onHeightChange={setHeaderHeight} title="Chatbot"/>

      <View>
        <Text></Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={bottomOffset}
        style={styles.kav}
      >
        <View style={[styles.inputContainer]}>
          <ChatInput placeholder='Send a Message...' />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: tabBarHeight,
  },

  inputContainer: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,

    paddingHorizontal: 20,
    paddingBottom: theme.spacing.sm

  }
});