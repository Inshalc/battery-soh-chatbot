// components/layout/Screen.tsx
import { theme } from '@/themes/theme';
import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenProps {
  children: ReactNode;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  avoidTopInset?: boolean;
}

export default function Screen({ children, padded = true, style, avoidTopInset = false }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const gutterH = 20; // your global horizontal padding

  return (
    <SafeAreaView style={[styles.root, !avoidTopInset && { paddingTop: insets.top }]}>
      <View
        style={[
          styles.body,
          padded && {
            paddingHorizontal: gutterH,
            paddingTop: avoidTopInset ? 0 : theme.spacing.sm,
            paddingBottom: theme.spacing.sm,
          },
          style,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0814' }, // from your theme.colors.background
  body: {
    flex: 1,
    width: '100%',
    maxWidth: 840,        // keeps tablets pretty
    alignSelf: 'center',  // centers the column within wide screens
  },
});