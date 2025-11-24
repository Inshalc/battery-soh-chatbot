import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { useRouter } from 'expo-router';

import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

import Signup from "./Signup";
import Game1 from "../../components/games/Game1.js";
import Game2 from "../../components/games/Game2.js";

import { theme } from '@/themes/theme';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const [screen, setScreen] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [missedQuestions, setMissedQuestions] = useState([]);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "479594544895-3mljc4hvjbo113l3fmna0b3r1c59a8i9.apps.googleusercontent.com",
    iosClientId: "479594544895-<YOUR_IOS_CLIENT_ID>.apps.googleusercontent.com",
    androidClientId: "479594544895-<YOUR_ANDROID_CLIENT_ID>.apps.googleusercontent.com",
  });

  const router = useRouter();

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${authentication.accessToken}` },
      })
        .then((res) => res.json())
        .then((userInfo) => {
          Alert.alert("Success", `Welcome ${userInfo.name}!`);
          // setScreen("game1");
          router.replace('/(tabs)')
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [response]);

  const handleEmailLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Enter both email and password");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Alert.alert("Success", `Logged in as ${email}`);
    //   setScreen("game1");
    router.replace('/(tabs)');
    }, 1000);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await promptAsync();
    } catch {
      setLoading(false);
      Alert.alert("Error", "Google sign-in failed");
    }
  };

  if (screen === "signup") return <Signup setScreen={setScreen} />;
  if (screen === "game1") return (
    <Game1
      setScreen={setScreen}
      setFinalScore={setFinalScore}
      setMissedQuestions={setMissedQuestions}
    />
  );
  if (screen === "game2") return (
    <Game2
      setScreen={setScreen}
      finalScore={finalScore}
      missedQuestions={missedQuestions}
    />
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LinearGradient colors={[theme.colors.accent, theme.colors.background]} style={styles.topSection}>
          <Text style={styles.title}>Welcome Back To Battery Chatbox</Text>
          <Text style={styles.subtitle}>Login to continue</Text>
        </LinearGradient>

        <View style={styles.bottomSection}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.disabledButton]}
            onPress={handleEmailLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Login</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupLink}
            onPress={() => setScreen("signup")}
          >
            <Text style={{ color: theme.colors.accentSecondary, textAlign: "center" }}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            style={[styles.googleButton, loading && styles.disabledButton]}
            onPress={handleGoogleSignIn}
            disabled={loading || !request}
          >
            <Text style={styles.googleText}>Login with Google</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  topSection: { flex: 1, minHeight: 250, justifyContent: "center", alignItems: "center", padding: theme.spacing.lg, borderBottomLeftRadius: theme.borderRadius.lg, borderBottomRightRadius: theme.borderRadius.lg },
  bottomSection: { flex: 2, backgroundColor: theme.colors.background, padding: theme.spacing.lg, justifyContent: "center" },
  title: { fontSize: 36, fontWeight: "bold", color: theme.colors.textPrimary, marginBottom: 10 },
  subtitle: { fontSize: 16, color: theme.colors.textSecondary },
  inputContainer: { marginBottom: theme.spacing.md, borderRadius: theme.borderRadius.md, overflow: "hidden" },
  input: { backgroundColor: theme.colors.surface, padding: theme.spacing.md, fontSize: theme.fontSize.md, color: theme.colors.textPrimary, borderWidth: 1, borderColor: theme.colors.border },
  loginButton: { backgroundColor: theme.colors.accent, padding: theme.spacing.md, borderRadius: theme.borderRadius.md, alignItems: "center", marginVertical: theme.spacing.sm },
  loginButtonText: { color: theme.colors.textPrimary, fontWeight: "bold", fontSize: 18 },
  disabledButton: { opacity: 0.6 },
  signupLink: { marginVertical: theme.spacing.sm },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: theme.spacing.md },
  line: { flex: 1, height: 1, backgroundColor: theme.colors.border },
  orText: { color: theme.colors.textSecondary, marginHorizontal: 10 },
  googleButton: { backgroundColor: "#fff", padding: theme.spacing.md, borderRadius: theme.borderRadius.md, alignItems: "center" },
  googleText: { color: theme.colors.textPrimary, fontWeight: "600", fontSize: 16 },
});