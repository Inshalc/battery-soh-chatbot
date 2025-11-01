import React, { useState } from 'react';
import { Text, View } from "react-native";
import Screen from '@/components/layout/Screen';
import ProfileHeader from "@/components/layout/ProfileHeader";
import GreetingCard from "@/components/ui/GreetingCard";

export default function Index() {
  // fro header height padding
  const [headerHeight, setHeaderHeight] = useState(0);

  return (
    <Screen avoidTopInset={true} style={{paddingTop: headerHeight}}>
      <ProfileHeader onHeightChange={setHeaderHeight} />
      <GreetingCard />
    </Screen>
  );
}