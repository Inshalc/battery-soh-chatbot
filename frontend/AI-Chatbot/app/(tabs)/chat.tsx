import ChatInput from '@/components/chat/ChatInput.js';
import Screen from '@/components/layout/Screen';
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Chat() {
  const nsets = useSafeAreaInsets();

  return (
    <Screen>
      <View>
        <Text></Text>
      </View>

      <ChatInput placeholder='Send a Message...'/>
    </Screen>
  );
}

const styles = StyleSheet.create({
  
});