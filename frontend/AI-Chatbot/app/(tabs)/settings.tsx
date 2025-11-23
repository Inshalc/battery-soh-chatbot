import { Text, View } from "react-native";
import React, { useState } from 'react';
import Screen from "@/components/layout/Screen";
import { ScrollView } from "react-native";
import { theme } from "@/themes/theme";

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

      </ScrollView>
    </Screen>
  );
}