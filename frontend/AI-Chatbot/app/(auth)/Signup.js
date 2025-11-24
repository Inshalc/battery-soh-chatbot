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
import { theme } from '@/themes/theme';
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

export default function Signup({ setScreen }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "479594544895-3mljc4hvjbo113l3fmna0b3r1c59a8i9.apps.googleusercontent.com",
    webClientId: "479594544895-3mljc4hvjbo113l3fmna0b3r1c59a8i9.apps.googleusercontent.com",
    iosClientId: "479594544895-<YOUR_IOS_CLIENT_ID>.apps.googleusercontent.com",
    androidClientId: "479594544895-<YOUR_ANDROID_CLIENT_ID>.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${authentication.accessToken}` },
      })
        .then((res) => res.json())
        .then((userInfo) => {
          Alert.alert("Success", `Google account created for ${userInfo.email}`);
          setScreen("login");
        })
        .catch(() => setLoading(false));
    }
  }, [response]);

  const handleSignup = () => {
    if (!email || !username || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    const isValidEmail = /\S+@\S+\.\S+/.test(email);
    if (!isValidEmail) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", `Account created for ${email}`);
      setScreen("login");
    }, 1000);
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await promptAsync();
    } catch {
      setLoading(false);
      Alert.alert("Error", "Google signup failed");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LinearGradient colors={[theme.colors.accent, theme.colors.background]} style={styles.topSection}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to start using Battery Chatbox</Text>
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
              placeholder="Username"
              placeholderTextColor="#888"
              value={username}
              onChangeText={setUsername}
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
            style={[styles.signupButton, loading && styles.disabledButton]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signupButtonText}>Sign Up</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setScreen("login")}>
            <Text style={{ color: theme.colors.accentSecondary, textAlign: "center", marginTop: theme.spacing.sm }}>
              Already have an account? Back to Login
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            style={[styles.googleButton, loading && styles.disabledButton]}
            onPress={handleGoogleSignup}
            disabled={loading || !request}
          >
            <Text style={styles.googleText}>Sign up with Google</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  topSection: {
    flex: 1,
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    borderBottomLeftRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.lg,
  },
  bottomSection: { flex: 2, backgroundColor: theme.colors.background, padding: theme.spacing.lg, justifyContent: "center" },
  title: { fontSize: 36, fontWeight: "bold", color: theme.colors.textPrimary, marginBottom: 10 },
  subtitle: { fontSize: 16, color: theme.colors.textSecondary },
  inputContainer: { marginBottom: theme.spacing.md, borderRadius: theme.borderRadius.md, overflow: "hidden" },
  input: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  signupButton: {
    backgroundColor: theme.colors.accent,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    marginVertical: theme.spacing.sm,
  },
  signupButtonText: { color: theme.colors.textPrimary, fontWeight: "bold", fontSize: 18 },
  disabledButton: { opacity: 0.6 },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: theme.spacing.md },
  line: { flex: 1, height: 1, backgroundColor: theme.colors.border },
  orText: { color: theme.colors.textSecondary, marginHorizontal: 10 },
  googleButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  googleText: { color: "#000", fontWeight: "600", fontSize: 16 },
});