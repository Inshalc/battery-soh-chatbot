import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Linking,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from '@/themes/theme';
import Screen from "../layout/Screen";

const questions = [
  {
    id: 1,
    soh: 0.82,
    question: "A battery with 82% SOH performs almost like new.",
    correct: "reuse",
    explanation: "High SOH means it can still be used efficiently in devices or backup systems.",
    link: "https://batteryuniversity.com/article/bu-808-how-to-prolong-lithium-based-batteries"
  },
  {
    id: 2,
    soh: 0.58,
    question: "A battery with 58% SOH struggles to hold a charge.",
    correct: "recycle",
    explanation: "Below 60% SOH means it's inefficient and should be recycled for safety.",
    link: "https://batteryuniversity.com/article/bu-808-how-to-prolong-lithium-based-batteries"
  },
  {
    id: 3,
    soh: 0.65,
    question: "A battery at 65% SOH still performs decently.",
    correct: "reuse",
    explanation: "Still above 60%, so it can be reused before recycling later.",
    link: "https://batteryuniversity.com/article/bu-1003a-battery-aging-in-an-electric-vehicle-efficiency"
  },
  {
    id: 4,
    soh: 0.45,
    question: "A battery overheats quickly and has only 45% SOH.",
    correct: "recycle",
    explanation: "It's unsafe for reuse — recycling prevents damage and recovers materials.",
    link: "https://batteryuniversity.com/article/bu-304a-safety-concerns-with-li-ion"
  },
  {
    id: 5,
    soh: 0.90,
    question: "A nearly new battery at 90% SOH used for less than a year.",
    correct: "reuse",
    explanation: "Still excellent for reuse, extending its life before disposal.",
    link: "https://batteryuniversity.com/article/bu-1003a-battery-aging-in-an-electric-vehicle-efficiency"
  },
  {
    id: 6,
    soh: 0.52,
    question: "A power tool battery that charges slowly, 52% SOH.",
    correct: "recycle",
    explanation: "Performance degradation means it should be recycled safely.",
    link: "https://batteryuniversity.com/article/bu-808-how-to-prolong-lithium-based-batteries"
  },
  {
    id: 7,
    soh: 0.72,
    question: "A car battery has 72% SOH and stable voltage.",
    correct: "reuse",
    explanation: "It can still power vehicles or devices effectively.",
    link: "https://batteryuniversity.com/article/bu-1003a-battery-aging-in-an-electric-vehicle-efficiency"
  },
  {
    id: 8,
    soh: 0.49,
    question: "Battery runs out after a few minutes of use, 49% SOH.",
    correct: "recycle",
    explanation: "Below 60% SOH means inefficient — recycle to prevent waste.",
    link: "https://batteryuniversity.com/article/bu-808-how-to-prolong-lithium-based-batteries"
  },
  {
    id: 9,
    soh: 0.68,
    question: "A storage battery with 68% SOH works fine for low power use.",
    correct: "reuse",
    explanation: "Above 60% SOH makes it reusable for smaller tasks.",
    link: "https://batteryuniversity.com/article/bu-1003a-battery-aging-in-an-electric-vehicle-efficiency"
  },
  {
    id: 10,
    soh: 0.38,
    question: "A corroded battery, 38% SOH, and leaking fluid.",
    correct: "recycle",
    explanation: "Damaged batteries must be recycled immediately for safety.",
    link: "https://batteryuniversity.com/article/bu-304a-safety-concerns-with-li-ion"
  },
  {
    id: 11,
    soh: 0.61,
    question: "A backup battery used for 2 years, 61% SOH.",
    correct: "reuse",
    explanation: "Still just over the threshold — can be reused in low-demand applications.",
    link: "https://batteryuniversity.com/article/bu-1003a-battery-aging-in-an-electric-vehicle-efficiency"
  },
  {
    id: 12,
    soh: 0.56,
    question: "A tablet battery takes hours to charge and drains fast.",
    correct: "recycle",
    explanation: "Poor performance and low SOH means recycling is best.",
    link: "https://batteryuniversity.com/article/bu-808-how-to-prolong-lithium-based-batteries"
  },
  {
    id: 13,
    soh: 0.77,
    question: "An electric scooter battery with 77% SOH.",
    correct: "reuse",
    explanation: "Still reliable for daily use before eventual recycling.",
    link: "https://batteryuniversity.com/article/bu-1003a-battery-aging-in-an-electric-vehicle-efficiency"
  },
  {
    id: 14,
    soh: 0.42,
    question: "Battery has swelling on the sides and 42% SOH.",
    correct: "recycle",
    explanation: "Swelling indicates risk — recycle immediately for safety.",
    link: "https://batteryuniversity.com/article/bu-304a-safety-concerns-with-li-ion"
  },
  {
    id: 15,
    soh: 0.83,
    question: "A phone battery at 83% SOH used for less than a year.",
    correct: "reuse",
    explanation: "Still very healthy — safe for continued use.",
    link: "https://batteryuniversity.com/article/bu-1003a-battery-aging-in-an-electric-vehicle-efficiency"
  }
];

export default function Game1({ setScreen, setFinalScore, setMissedQuestions }) {
  const [score, setScore] = useState(0);
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [missed, setMissed] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const reuseAnim = useRef(new Animated.Value(1)).current;
  const recycleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setFeedback(null);
  }, [index]);

  const animateButton = (animValue) => {
    Animated.sequence([
      Animated.timing(animValue, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(animValue, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleDecision = (decision) => {
    const current = questions[index];
    const isCorrect = decision === current.correct;
    if (isCorrect) setScore((prev) => prev + 1);
    else setMissed((prev) => [...prev, current]);

    setTimeout(() => {
      setFeedback({
        correct: isCorrect,
        message: isCorrect ? `✅ Correct! You chose ${decision}.` : `❌ Incorrect. You chose ${decision}.`,
        explanation: current.explanation,
        link: current.link,
      });

      setTimeout(() => {
        if (index + 1 < questions.length) {
          setIndex(index + 1);
        } else {
          setFinalScore(score + (isCorrect ? 1 : 0));
          setMissedQuestions(missed);
          setScreen("game2");
        }
      }, 2000);
    }, 500);
  };

  const current = questions[index];
  const sohColor = current.soh >= 0.7 ? theme.colors.success : current.soh >= 0.6 ? theme.colors.warning : theme.colors.accent;

  return (
    <Screen padded={false}>
      <LinearGradient colors={['transparent', theme.colors.accent]} style={styles.container}>
        <View style={styles.topHalf}>
          <Text style={styles.title}>⚡ Battery Master ⚡</Text>
          <Text style={styles.subtitle}>Decide to reuse or recycle each battery!</Text>
          <Text style={styles.score}>Score: {score}</Text>
        </View>

        <View style={styles.bottomHalf}>
          <Animated.View style={[styles.card, { borderColor: sohColor, opacity: fadeAnim }]}>
            <Text style={styles.batteryTitle}>Battery #{current.id}</Text>
            <Text style={styles.questionText}>{current.question}</Text>
            <Text style={[styles.sohText, { color: sohColor }]}>SOH: {(current.soh * 100).toFixed(0)}%</Text>
          </Animated.View>

          {!feedback && (
            <View style={styles.buttonsContainer}>
              <TouchableWithoutFeedback onPress={() => { animateButton(reuseAnim); handleDecision("reuse"); }}>
                <Animated.View style={[styles.button, { backgroundColor: theme.colors.success, transform: [{ scale: reuseAnim }] }]}>
                  <Text style={styles.buttonText}>Reuse</Text>
                </Animated.View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPress={() => { animateButton(recycleAnim); handleDecision("recycle"); }}>
                <Animated.View style={[styles.button, { backgroundColor: theme.colors.danger, transform: [{ scale: recycleAnim }] }]}>
                  <Text style={styles.buttonText}>Recycle</Text>
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          )}

          {feedback && (
            <View style={styles.feedbackBox}>
              <Text style={[styles.feedbackText, { color: feedback.correct ? theme.colors.success : theme.colors.danger }]}>{feedback.message}</Text>
              <Text style={styles.explanationText}>{feedback.explanation}</Text>
              <Text style={styles.linkText} onPress={() => Linking.openURL(feedback.link)}>🔗 Learn more</Text>
            </View>
          )}

          <Text style={styles.footer}>Question {index + 1} of {questions.length}</Text>

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
  topHalf: { flex: 0.4, backgroundColor: 'transparent', borderBottomLeftRadius: theme.borderRadius.lg, borderBottomRightRadius: theme.borderRadius.lg, alignItems: "center", justifyContent: "center", paddingTop: theme.spacing.lg },
  bottomHalf: { flex: 0.55, justifyContent: "flex-start", alignItems: "center", paddingTop: theme.spacing.lg },
  title: { fontSize: 38, fontWeight: "bold", color: theme.colors.textPrimary, textShadowColor: theme.colors.accentSecondary, textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6 },
  subtitle: { fontSize: theme.fontSize.md, color: theme.colors.textSecondary, marginTop: 8 },
  score: { fontSize: 20, color: theme.colors.textPrimary, marginTop: 15 },
  card: { width: "85%", padding: 25, borderRadius: theme.borderRadius.lg, backgroundColor: theme.colors.surface, alignItems: "center", borderWidth: 4, shadowColor: theme.shadows.soft.shadowColor, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 },
  batteryTitle: { fontSize: 28, color: theme.colors.textPrimary, marginBottom: 10, fontWeight: "bold" },
  questionText: { fontSize: 17, color: theme.colors.textSecondary, textAlign: "center", marginBottom: 10 },
  sohText: { fontSize: 22, fontWeight: "bold" },
  buttonsContainer: { flexDirection: "row", justifyContent: "space-between", width: "80%", marginTop: 40 },
  button: { flex: 1, marginHorizontal: 10, paddingVertical: 16, borderRadius: 16, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6 },
  buttonText: { color: theme.colors.textPrimary, fontSize: 18, fontWeight: "bold" },
  feedbackBox: { marginTop: 30, width: "85%", backgroundColor: theme.colors.surface, borderRadius: 16, padding: 20, shadowColor: theme.shadows.soft.shadowColor, shadowOpacity: 0.3, shadowRadius: 10 },
  feedbackText: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  explanationText: { color: theme.colors.textSecondary, fontSize: 15, textAlign: "center", marginBottom: 10 },
  linkText: { color: theme.colors.accentSecondary, fontSize: 15, textAlign: "center", textDecorationLine: "underline" },
  footer: { marginTop: 25, color: theme.colors.textSecondary, fontSize: 16 },
});