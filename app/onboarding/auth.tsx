import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/hooks/useAuth"; // ← Use the Supabase hook

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // ← Use real Supabase auth instead of mock
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    resetPassword,
    isAuthenticated,
    user,
  } = useAuth();

  // Handle navigation when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("User authenticated, navigating...");
      setIsLoading(false);
      // Navigate to profile page to continue onboarding
      router.replace("/onboarding/profile");
    }
  }, [isAuthenticated, user]);

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert("Email Required", "Please enter your email address");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return false;
    }

    if (!showForgotPassword && !password.trim()) {
      Alert.alert("Password Required", "Please enter your password");
      return false;
    }

    if (!showForgotPassword && password.length < 6) {
      Alert.alert(
        "Password Too Short",
        "Password must be at least 6 characters long"
      );
      return false;
    }

    if (
      !isLogin &&
      !showForgotPassword &&
      (!firstName.trim() || !lastName.trim())
    ) {
      Alert.alert("Name Required", "Please enter your first and last name");
      return false;
    }

    return true;
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert(
        "Email Required",
        "Please enter your email address to reset your password"
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(email.trim());

      if (result.error) {
        Alert.alert("Password Reset Error", result.error.message);
        return;
      }

      Alert.alert(
        "Password Reset Email Sent",
        "Check your email for password reset instructions. The link will be valid for 24 hours.",
        [
          {
            text: "OK",
            onPress: () => setShowForgotPassword(false),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Password Reset Error",
        error.message || "Failed to send password reset email."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ← Real email authentication
  const handleAuth = async () => {
    if (!validateForm()) return;

    if (showForgotPassword) {
      await handleForgotPassword();
      return;
    }

    setIsLoading(true);

    try {
      let result;

      if (isLogin) {
        result = await signInWithEmail(email.trim(), password);
      } else {
        result = await signUpWithEmail(email.trim(), password, {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        });
      }

      if (result.error) {
        // Handle specific error messages
        let errorMessage = result.error.message;

        if (result.error.message.includes("Invalid login credentials")) {
          errorMessage =
            "Invalid email or password. Please check your credentials and try again.";
        } else if (result.error.message.includes("User already registered")) {
          errorMessage =
            "An account with this email already exists. Please sign in instead.";
        } else if (
          result.error.message.includes("Signup requires a valid password")
        ) {
          errorMessage =
            "Please enter a valid password (minimum 6 characters).";
        }

        Alert.alert("Authentication Error", errorMessage);
        return;
      }

      // For signup, show confirmation message
      if (!isLogin && result.data?.user && !result.data.session) {
        Alert.alert(
          "Verification Email Sent",
          "Please check your email and click the verification link to complete your account setup.",
          [
            {
              text: "OK",
              onPress: () => {
                setIsLogin(true); // Switch to login mode
                setPassword(""); // Clear password
              },
            },
          ]
        );
        return;
      }

      // For successful login, don't set loading to false - let navigation handle it
      if (isLogin && result.data?.session) {
        // Login successful - navigation will be handled by auth state change
        // Don't set loading to false here
        return;
      }

      // For other cases, stop loading
      setIsLoading(false);
    } catch (error: any) {
      Alert.alert(
        "Authentication Error",
        error.message || "Something went wrong."
      );
      setIsLoading(false);
    }
  };

  // ← Real Google authentication
  const handleGoogleAuth = async () => {
    setIsLoading(true);

    try {
      const result = await signInWithGoogle();

      if (result.error) {
        Alert.alert("Google Sign-In Error", result.error.message);
        return;
      }

      // Auth state change will handle navigation
    } catch (error: any) {
      Alert.alert(
        "Google Sign-In Error",
        error.message || "Google sign-in failed."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f3460"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.headerText}>
              {showForgotPassword ? "Reset Password" : "Join the Glow-Up Gang!"}{" "}
              ✨
            </ThemedText>
            <ThemedText style={styles.subHeaderText}>
              {showForgotPassword
                ? "Enter your email to receive a password reset link."
                : "Sign up or log in to start your money journey."}
            </ThemedText>
          </View>

          {/* Auth Form */}
          <ThemedView style={styles.formContainer}>
            {!showForgotPassword && (
              <>
                {/* Toggle */}
                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      !isLogin && styles.toggleButtonActive,
                    ]}
                    onPress={() => setIsLogin(false)}
                  >
                    <ThemedText
                      style={[
                        styles.toggleText,
                        !isLogin && styles.toggleTextActive,
                      ]}
                    >
                      Sign Up
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      isLogin && styles.toggleButtonActive,
                    ]}
                    onPress={() => setIsLogin(true)}
                  >
                    <ThemedText
                      style={[
                        styles.toggleText,
                        isLogin && styles.toggleTextActive,
                      ]}
                    >
                      Log In
                    </ThemedText>
                  </TouchableOpacity>
                </View>

                {/* Name fields for signup only */}
                {!isLogin && (
                  <>
                    <View style={styles.inputContainer}>
                      <ThemedText style={styles.inputLabel}>
                        First Name
                      </ThemedText>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Alex"
                        placeholderTextColor="#666"
                        value={firstName}
                        onChangeText={setFirstName}
                        autoCapitalize="words"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <ThemedText style={styles.inputLabel}>
                        Last Name
                      </ThemedText>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Smith"
                        placeholderTextColor="#666"
                        value={lastName}
                        onChangeText={setLastName}
                        autoCapitalize="words"
                      />
                    </View>
                  </>
                )}
              </>
            )}

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Email</ThemedText>
              <TextInput
                style={styles.textInput}
                placeholder="you@cool.com"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Input */}
            {!showForgotPassword && (
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>Password</ThemedText>
                <TextInput
                  style={styles.textInput}
                  placeholder="Min 6 characters"
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            )}

            {/* Forgot Password Link */}
            {isLogin && !showForgotPassword && (
              <TouchableOpacity
                onPress={() => setShowForgotPassword(true)}
                style={styles.forgotPasswordLink}
              >
                <ThemedText style={styles.forgotPasswordText}>
                  Forgot your password?
                </ThemedText>
              </TouchableOpacity>
            )}

            {/* Back to Login Link */}
            {showForgotPassword && (
              <TouchableOpacity
                onPress={() => setShowForgotPassword(false)}
                style={styles.forgotPasswordLink}
              >
                <ThemedText style={styles.forgotPasswordText}>
                  Back to Sign In
                </ThemedText>
              </TouchableOpacity>
            )}

            {/* Email Auth Button */}
            <TouchableOpacity
              style={[
                styles.authButton,
                isLoading && styles.authButtonDisabled,
              ]}
              onPress={handleAuth}
              disabled={isLoading}
            >
              <LinearGradient
                colors={["#00FF7F", "#32CD32"]}
                style={styles.authButtonGradient}
              >
                <ThemedText style={styles.authButtonText}>
                  {isLoading
                    ? "Loading..."
                    : showForgotPassword
                    ? "Send Reset Email"
                    : isLogin
                    ? "Log In"
                    : "Sign Up"}
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>

            {!showForgotPassword && (
              <>
                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <ThemedText style={styles.dividerText}>OR</ThemedText>
                  <View style={styles.dividerLine} />
                </View>

                {/* Google Sign-In */}
                <TouchableOpacity
                  style={[
                    styles.googleButton,
                    isLoading && styles.googleButtonDisabled,
                  ]}
                  onPress={handleGoogleAuth}
                  disabled={isLoading}
                >
                  <View style={styles.googleButtonContent}>
                    <ThemedText style={styles.googleIcon}>🔍</ThemedText>
                    <ThemedText style={styles.googleButtonText}>
                      Continue with Google
                    </ThemedText>
                  </View>
                </TouchableOpacity>

                {/* Microcopy */}
                <ThemedText style={styles.microcopy}>
                  Let's make your wallet pop! 💸
                </ThemedText>
              </>
            )}
          </ThemedView>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
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
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: "#00FF7F",
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#CCCCCC",
  },
  toggleTextActive: {
    color: "#000000",
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
  forgotPasswordLink: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#00FF7F",
    fontWeight: "500",
  },
  authButton: {
    borderRadius: 16,
    marginTop: 8,
    shadowColor: "#00FF7F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  authButtonDisabled: {
    opacity: 0.6,
  },
  authButtonGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  authButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#CCCCCC",
    fontWeight: "600",
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  googleIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  microcopy: {
    fontSize: 14,
    color: "#00FF7F",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "500",
  },
});
