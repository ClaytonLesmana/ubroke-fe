import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  const { updatePassword } = useAuth();
  const params = useLocalSearchParams();

  useEffect(() => {
    // Check if we have a valid password reset session
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsValidSession(!!session);

      if (!session) {
        Alert.alert(
          "Invalid Reset Link",
          "This password reset link is invalid or has expired. Please request a new one.",
          [{ text: "OK", onPress: () => router.replace("/onboarding/auth") }]
        );
      }
    };

    checkSession();
  }, []);

  const validateForm = () => {
    if (!newPassword.trim()) {
      Alert.alert("Password Required", "Please enter a new password");
      return false;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        "Password Too Short",
        "Password must be at least 6 characters long"
      );
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Passwords Don't Match",
        "Please make sure both passwords match"
      );
      return false;
    }

    return true;
  };

  const handleUpdatePassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await updatePassword(newPassword);

      if (result.error) {
        Alert.alert("Password Update Error", result.error.message);
        return;
      }

      Alert.alert(
        "Password Updated",
        "Your password has been successfully updated. You can now sign in with your new password.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/onboarding/auth"),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Password Update Error",
        error.message || "Failed to update password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidSession) {
    return (
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        style={styles.container}
      >
        <View style={styles.content}>
          <ThemedText style={styles.headerText}>Invalid Reset Link</ThemedText>
          <ThemedText style={styles.subHeaderText}>
            Please check your email for a valid password reset link.
          </ThemedText>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f3460"]}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.headerText}>Set New Password 🔐</ThemedText>
          <ThemedText style={styles.subHeaderText}>
            Choose a strong password to secure your account.
          </ThemedText>
        </View>

        {/* Form */}
        <ThemedView style={styles.formContainer}>
          {/* New Password Input */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>New Password</ThemedText>
            <TextInput
              style={styles.textInput}
              placeholder="Min 6 characters"
              placeholderTextColor="#666"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>Confirm Password</ThemedText>
            <TextInput
              style={styles.textInput}
              placeholder="Re-enter your password"
              placeholderTextColor="#666"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Update Password Button */}
          <TouchableOpacity
            style={[
              styles.updateButton,
              isLoading && styles.updateButtonDisabled,
            ]}
            onPress={handleUpdatePassword}
            disabled={isLoading}
          >
            <LinearGradient
              colors={["#00FF7F", "#32CD32"]}
              style={styles.updateButtonGradient}
            >
              <ThemedText style={styles.updateButtonText}>
                {isLoading ? "Updating..." : "Update Password"}
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>

          {/* Security Note */}
          <ThemedText style={styles.securityNote}>
            🔒 Your password is encrypted and secure
          </ThemedText>
        </ThemedView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
  },
  subHeaderText: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#000000",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  updateButton: {
    borderRadius: 16,
    marginTop: 8,
    shadowColor: "#00FF7F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  updateButtonDisabled: {
    opacity: 0.6,
  },
  updateButtonGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  updateButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  securityNote: {
    fontSize: 14,
    color: "#00FF7F",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "500",
  },
});
