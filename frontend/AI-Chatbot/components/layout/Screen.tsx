// components/layout/Screen.tsx
import { theme } from '@/themes/theme';
import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ImageBackground } from 'react-native';
import { useState } from 'react';

interface ScreenProps {
  children: ReactNode;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  avoidTopInset?: boolean;
}

export default function Screen({ children, padded = true, style}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const gutterH = theme.spacing.md; // your global horizontal padding

  const [headerHeight, setHeaderHeight] = useState(0);

  return (
    <ImageBackground
      source={require('@/assets/images/stardust.png')}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      resizeMode="cover"
    >

      <SafeAreaView style={[styles.root]}>
        <View
          style={[
            styles.body,
            padded && {
              paddingHorizontal: gutterH,
              paddingTop: headerHeight + insets.top,
              paddingBottom: theme.spacing.sm,
            },
            style,
          ]}
        >
          {children}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' }, // from your theme.colors.background
  body: {
    flex: 1,
    width: '100%',
    maxWidth: 840,        // keeps tablets pretty
    alignSelf: 'center',  // centers the column within wide screens
  },
});