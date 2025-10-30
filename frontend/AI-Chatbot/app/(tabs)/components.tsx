// REMOVE IN PRODUCTION
// USED TO ONLY VIEW COMPONENTS
import ChatBubble from "@/components/chat/ChatBubble.js";
import ChatInput from "@/components/chat/ChatInput";
import Screen from '@/components/layout/Screen';
import GradientButton from "@/components/ui/GradientButton";
import IconButton from "@/components/ui/IconButton";
import { theme } from "@/themes/theme";
import { View } from "react-native";

export default function Components() {
  return (
    <Screen>
      <View
        style={{
            flex: 1,
            justifyContent: 'center',
            // alignItems: 'center',
        }}
      >
        <GradientButton text="Gradient Button"></GradientButton>
        <ChatBubble text="This is a User Message" isUser={true}/>
        <ChatBubble text="This is an AI Message" isUser={false} />
        <ChatBubble></ChatBubble>
        <IconButton bgColor="black" size={theme.fontSize.md} iconColor={theme.colors.textPrimary}></IconButton>
        <ChatInput />
        

          
      </View>
    </Screen>
  );
}