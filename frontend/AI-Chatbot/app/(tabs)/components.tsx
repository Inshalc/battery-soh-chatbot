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
import FilterSection from'@/components/ui/FilterSection.js';

export default function Components() {
  // fro header height padding
  const [headerHeight, setHeaderHeight] = useState(0);

  // for filterchips
  // for chips
  const categories = [
    { id: 0, label: 'All'},
    { id: 1, label: 'R²' },
    { id: 2, label: 'MSE' },
    { id: 3, label: 'MAE' },
    { id: 4, label: 'Training Time' },
  ];

  // for cards
  const cards = [
    {categoryId: 1, mainText: '1', subText: '1'},
    {categoryId: 2, mainText: '2', subText: '2'},
    {categoryId: 3, mainText: '3', subText: '3'},
    {categoryId: 4, mainText: '4', subText: '4'},
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
        <ProfileHeader onHeightChange={setHeaderHeight} title='Components'/>

        <GradientButton text="Gradient Button"></GradientButton>
        <ChatBubble text="This is a User Message" isUser={true}/>
        <ChatBubble text="This is an AI Message" isUser={false} />
        <IconButton bgColor="black" size={theme.fontSize.md} iconColor={theme.colors.textPrimary}></IconButton>
        <ChatInput />
        
        <GreetingCard />

        <FilterSection cards={cards} categories={categories}/>

      </View>
    </Screen>
    
    
  );
}