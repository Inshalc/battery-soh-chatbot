import React, { useState } from 'react';
import { Text, View, StyleSheet } from "react-native";
import Screen from '@/components/layout/Screen';
import ProfileHeader from "@/components/layout/ProfileHeader";
import GreetingCard from "@/components/ui/GreetingCard";
import FilterSection from '@/components/ui/FilterSection';
import { theme } from '@/themes/theme';
import AskAISection from '@/components/ui/AskAISection';
import { globalStyles } from '@/themes/globalStyles';

export default function Index() {
  // fro header height padding
  const [headerHeight, setHeaderHeight] = useState(0);

  // for output section, change cards to change text inside cards, change categories for text inside chips, and make sure id's match up (0 is for all)
  const categories = [
    { id: 0, label: 'All'},
    { id: 1, label: 'R²' },
    { id: 2, label: 'MSE' },
    { id: 3, label: 'MAE' },
    { id: 4, label: 'Training Time' },
  ];

  const cards = [
    {categoryId: 1, mainText: 'R²: 0.5081', subText: 'Lots of text abt what this value means and how it works yk'},
    {categoryId: 2, mainText: 'MSE: 0.0021', subText: 'Lots of text abt what this value means and how it works yk'},
    {categoryId: 3, mainText: 'MAE: 0.0359', subText: 'Lots of text abt what this value means and how it works yk'},
    {categoryId: 4, mainText: 'Training Time: 0.0033 s', subText: 'Lots of text abt what this value means and how it works yk'},
  ];

  // fro ask ai section, change messages fro messages, change cips for input chips, 
  const messages = [
    {id: 1, isUser: true, text: "What's my Battery SOH?"},
    {id: 2, isUser: false, text: "idk broski"},
  ];

  const chips = [
    {id: 1, text: "How are you"},
    {id: 2, text: "byebye"},
    {id: 3, text: "byebye"},
    {id: 4, text: "byebye"},
  ];

  return (
    <Screen 
      avoidTopInset={true} 
      style={
        [
          {paddingTop: headerHeight + theme.spacing.lg},
          {gap: theme.spacing.lg}
        ]
      }
    >
      <ProfileHeader onHeightChange={setHeaderHeight} title="Battery SOH Chatbot"/>
      <GreetingCard />

      <View>
        <Text style={globalStyles.title}>Have Questions?</Text>
        <AskAISection header="Chatbot.ai" messages={messages} chips={chips} />
      </View>

      <FilterSection header='Model Output' categories={categories} cards={cards} />
    </Screen>
  );
}