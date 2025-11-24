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
      ? "#4ade80"
      : batterySOH >= 0.6
      ? "#facc15"
      : "#a855f7";
  };

  return (
    <LinearGradient colors={["#000000", "#2e005e"]} style={styles.container}>
      <View style={styles.topHalf}>
        <Text style={styles.title}>🔋 Battery Charge Challenge 🔋</Text>
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

        <TouchableOpacity onPress={() => setScreen("game1")} style={{ marginTop: 20 }}>
          <Text style={{ color: "#a78bfa", fontSize: 16 }}>← Back to Game 1</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topHalf: {
    flex: 0.45,
    backgroundColor: "#000",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  bottomHalf: {
    flex: 0.55,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 30,
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "#8b5cf6",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: { fontSize: 16, color: "#ccc", marginTop: 8 },
  score: { fontSize: 20, color: "#fff", marginTop: 15 },
  batteryCard: {
    width: "85%",
    padding: 25,
    borderRadius: 25,
    backgroundColor: "#fff",
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  batteryLabel: {
    fontSize: 28,
    color: "#000",
    marginBottom: 15,
    fontWeight: "bold",
  },
  sohBarContainer: {
    width: "100%",
    height: 20,
    backgroundColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
  },
  sohBar: { height: "100%", borderRadius: 10 },
  sohText: { fontSize: 18, fontWeight: "bold" },
  chargeButton: {
    backgroundColor: "#4ade80",
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
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  footer: { marginTop: 25, color: "#ccc", fontSize: 16 },
});