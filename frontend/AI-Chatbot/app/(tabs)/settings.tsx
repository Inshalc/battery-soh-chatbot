import { Text, View } from "react-native";
import React, { useState } from 'react';
import Screen from "@/components/layout/Screen";
import { ScrollView } from "react-native";
import { theme } from "@/themes/theme";
import GreetingCard from "@/components/ui/GreetingCard";

export default function Settings() {
  // fro header height padding
  const [headerHeight, setHeaderHeight] = useState(0);

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}

        contentContainerStyle={
          [
            {paddingTop: headerHeight + theme.spacing.lg},
            {paddingBottom: theme.spacing.lg},
            {gap: theme.spacing.lg}
          ]
        }
      >

        <GreetingCard greeting="Hi!" description="This is the setting page, where you can change any settings you want" />
        <GreetingCard greeting="App Information" description={"Version: 1.0.0\nBuild: 14"} />

      </ScrollView>
    </Screen>
  );
}