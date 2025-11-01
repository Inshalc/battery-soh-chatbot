import React, { useState } from 'react';
import { Text, View } from "react-native";
import Screen from '@/components/layout/Screen';
import ProfileHeader from "@/components/layout/ProfileHeader";
import GreetingCard from "@/components/ui/GreetingCard";
import FilterSection from '@/components/ui/FilterSection';

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

  return (
    <Screen avoidTopInset={true} style={{paddingTop: headerHeight}}>
      <ProfileHeader onHeightChange={setHeaderHeight} title="Battery SOH Chatbot"/>
      <GreetingCard />

      <FilterSection header='Model Output' categories={categories} cards={cards} />
    </Screen>
  );
}