import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Alert,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from '@/themes/theme';
import Screen from "../layout/Screen";

const TOTAL_BATTERIES = 10;

export default function Game2({ setScreen, finalScore, missedQuestions }) {
  const [score, setScore] = useState(finalScore);
  const [currentBattery, setCurrentBattery] = useState(1);
  const [batterySOH, setBatterySOH] = useState(Math.random() * 0.5 + 0.5);

  const chargeAnim = useRef(new Animated.Value(1)).current;
  const sohAnim = useRef(new Animated.Value(batterySOH)).current;

  useEffect(() => {
    sohAnim.setValue(batterySOH);
  }, [batterySOH]);

  const animateSOH = (newSOH) => {
    Animated.timing(sohAnim, {
      toValue: newSOH,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const animateButton = () => {
    chargeAnim.setValue(1);
    Animated.sequence([
      Animated.timing(chargeAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(chargeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleTap = () => {
    animateButton();
    let change = Math.random() * 0.15 + 0.05;
    let newSOH = batterySOH + change;
    if (newSOH > 1) newSOH = 1;

    setBatterySOH(newSOH);
    animateSOH(newSOH);

    if (newSOH >= 0.95) {
      Alert.alert("Overcharged!", `Battery #${currentBattery} overcharged! Lost 1 point.`);
      setScore((prev) => (prev > 0 ? prev - 1 : 0));
      nextBattery();
    } else if (newSOH >= 0.8) {
      setScore((prev) => prev + 1);
      Alert.alert("Well Done!", `Battery #${currentBattery} charged efficiently! +1 point.`);
      nextBattery();
    }
  };

  const nextBattery = () => {
    if (currentBattery < TOTAL_BATTERIES) {
      setCurrentBattery(currentBattery + 1);
      setBatterySOH(Math.random() * 0.5 + 0.5);
    } else {
      Alert.alert(
        "Challenge Complete!",
        `Final Score: ${score} / ${TOTAL_BATTERIES}`,
        [
          { text: "Replay", onPress: () => setScreen("game1") },
          { text: "Back to Login", onPress: () => setScreen("login") },
        ]
      );
    }
  };

  const sohInterpolated = sohAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const getSOHColor = () => {
    return batterySOH >= 0.8
      ? theme.colors.success
      : batterySOH >= 0.6
      ? theme.colors.warning
      : theme.colors.accent;
  };

  return (
    <Screen padded={false}>
      <LinearGradient colors={['transparent', theme.colors.accent]} style={styles.container}>
        <View style={styles.topHalf}>
          <Text style={styles.title}>Battery Charge Challenge</Text>
          <Text style={styles.subtitle}>Tap to charge efficiently!</Text>
          <Text style={styles.score}>Score: {score}</Text>
        </View>

        <View style={styles.bottomHalf}>
          <View style={styles.batteryCard}>
            <Text style={styles.batteryLabel}>Battery #{currentBattery}</Text>
            <View style={styles.sohBarContainer}>
              <Animated.View
                style={[
                  styles.sohBar,
                  { width: sohInterpolated, backgroundColor: getSOHColor() },
                ]}
              />
            </View>
            <Text style={styles.sohText}>
              SOH: {(batterySOH * 100).toFixed(0)}%
            </Text>
          </View>

          <TouchableWithoutFeedback onPress={handleTap}>
            <Animated.View
              style={[
                styles.chargeButton,
                { transform: [{ scale: chargeAnim }] },
              ]}
            >
              <Text style={styles.chargeButtonText}>⚡ Charge ⚡</Text>
            </Animated.View>
          </TouchableWithoutFeedback>

          <Text style={styles.footer}>Battery {currentBattery} of {TOTAL_BATTERIES}</Text>

          <TouchableOpacity onPress={() => setScreen("login")} style={{ marginTop: 20 }}>
            <Text style={{ color: theme.colors.textPrimary, fontSize: theme.fontSize.md }}>← Back to Games</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topHalf: {
    flex: 0.4,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: theme.spacing.lg,
  },
  bottomHalf: {
    flex: 0.55,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: theme.spacing.lg,
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: theme.colors.textPrimary,
    textShadowColor: theme.colors.accentSecondary,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,

    textAlign: 'center',
  },
  subtitle: { fontSize: theme.fontSize.md, color: theme.colors.textSecondary, marginTop: 8 },
  score: { fontSize: 20, color: theme.colors.textPrimary, marginTop: 15 },
  batteryCard: {
    width: "85%",
    padding: 25,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    marginBottom: 30,
    shadowColor: theme.shadows.soft.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  batteryLabel: {
    fontSize: 28,
    color: theme.colors.textPrimary,
    marginBottom: 15,
    fontWeight: "bold",
  },
  sohBarContainer: {
    width: "100%",
    height: 20,
    backgroundColor: theme.colors.border,
    borderRadius: 10,
    marginBottom: 10,
  },
  sohBar: { height: "100%", borderRadius: 10 },
  sohText: { fontSize: 18, fontWeight: "bold", color: theme.colors.textPrimary },
  chargeButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  chargeButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: "bold",
  },
  footer: { marginTop: 25, color: theme.colors.textSecondary, fontSize: 16 },
});