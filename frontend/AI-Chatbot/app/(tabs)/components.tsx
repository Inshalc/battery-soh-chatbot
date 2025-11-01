// REMOVE IN PRODUCTION
// USED TO ONLY VIEW COMPONENTS
import React, { useState } from 'react';
import ChatBubble from "@/components/chat/ChatBubble.js";
import ChatInput from "@/components/chat/ChatInput";
import ProfileHeader from "@/components/layout/ProfileHeader.js";
import Screen from '@/components/layout/Screen';
import GradientButton from "@/components/ui/GradientButton";
import GreetingCard from "@/components/ui/GreetingCard.js";
import IconButton from "@/components/ui/IconButton";
import { theme } from "@/themes/theme";
import { View } from "react-native";
import FilterChips from '@/components/ui/FilterChips';
import OutputInterface from'@/components/ui/OutputInterface.js';

export default function Components() {
  // fro header height padding
  const [headerHeight, setHeaderHeight] = useState(0);

  // for filterchips
  const categories = [
    { id: 1, label: 'First Item' },
    { id: 2, label: 'Second Item' },
    { id: 3, label: 'Third Item' },
    { id: 4, label: 'Fourth Item' },
  ];

  return (
    

    <Screen avoidTopInset={true} style={{paddingTop: headerHeight}}>
      <View
        style={{
            flex: 1,
            justifyContent: 'center',
            // alignItems: 'center',
        }}
      >
        <ProfileHeader onHeightChange={setHeaderHeight} />

        <GradientButton text="Gradient Button"></GradientButton>
        <ChatBubble text="This is a User Message" isUser={true}/>
        <ChatBubble text="This is an AI Message" isUser={false} />
        <IconButton bgColor="black" size={theme.fontSize.md} iconColor={theme.colors.textPrimary}></IconButton>
        <ChatInput />
        
        <GreetingCard />
        

        <FilterChips categories={categories}/>

        <OutputInterface />

      </View>
    </Screen>
    
    
  );
}