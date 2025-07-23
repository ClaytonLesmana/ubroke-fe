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
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [accountCount, setAccountCount] = useState("");
  const [assets, setAssets] = useState("");
  const [liabilities, setLiabilities] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { updateOnboardingData, onboardingData } = useOnboarding();
  const { user, userProfile, isEmailVerified, resendEmailVerification } =
    useAuth();

  useEffect(() => {
    // Pre-fill with existing data
    if (onboardingData) {
      setFirstName(onboardingData.firstName || "");
      setLastName(onboardingData.lastName || "");
      setAge(onboardingData.age?.toString() || "");
      setAccountCount(onboardingData.accountCount?.toString() || "");
      setAssets(onboardingData.assets?.toString() || "");
      setLiabilities(onboardingData.liabilities?.toString() || "");
    }

    // Pre-fill with user profile data if available
    if (userProfile) {
      setFirstName(userProfile.first_name || "");
      setLastName(userProfile.last_name || "");
      setAge(userProfile.age?.toString() || "");
      setAccountCount(userProfile.account_count?.toString() || "");
      setAssets(userProfile.assets?.toString() || "");
      setLiabilities(userProfile.liabilities?.toString() || "");
    }
  }, [onboardingData, userProfile]);

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      const result = await resendEmailVerification();

      if (result.error) {
        Alert.alert("Error", result.error.message);
      } else {
        Alert.alert(
          "Verification Email Sent",
          "Please check your email for the verification link."
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to send verification email"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");
    const number = parseFloat(numericValue);

    if (isNaN(number)) return "";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const parseCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    return numericValue ? parseFloat(numericValue) : undefined;
  };

  const validateAndContinue = async () => {
    // Basic validation
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Name Required", "Please enter your first and last name");
      return;
    }

    if (age && (parseInt(age) < 13 || parseInt(age) > 120)) {
      Alert.alert("Invalid Age", "Please enter a valid age");
      return;
    }

    setIsLoading(true);

    try {
      const profileData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: age ? parseInt(age) : undefined,
        accountCount: accountCount ? parseInt(accountCount) : undefined,
        assets: parseCurrency(assets),
        liabilities: parseCurrency(liabilities),
      };

      await updateOnboardingData(profileData);
      router.push("/onboarding/income");
    } catch (error) {
      Alert.alert("Error", "Failed to save profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/onboarding/income");
  };

  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f3460"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.headerText}>
            Tell us about yourself 👤
          </ThemedText>
          <ThemedText style={styles.subHeaderText}>
            Help us personalize your experience
          </ThemedText>
        </View>

        {/* Email Verification Banner */}
        {user && !isEmailVerified && (
          <ThemedView style={styles.verificationBanner}>
            <ThemedText style={styles.verificationText}>
              📧 Please verify your email address ({user.email})
            </ThemedText>
            <TouchableOpacity
              onPress={handleResendVerification}
              disabled={isLoading}
              style={styles.resendButton}
            >
              <ThemedText style={styles.resendButtonText}>
                {isLoading ? "Sending..." : "Resend Email"}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <ThemedText style={styles.progressText}>Step 1 of 2 (50%)</ThemedText>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={["#00FF7F", "#32CD32"]}
              style={[styles.progressFill, { width: "50%" }]}
            />
          </View>
        </View>

        {/* Form */}
        <ThemedView style={styles.formContainer}>
          {/* Name Fields */}
          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <ThemedText style={styles.inputLabel}>First Name *</ThemedText>
              <TextInput
                style={styles.textInput}
                placeholder="Alex"
                placeholderTextColor="#666"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <ThemedText style={styles.inputLabel}>Last Name *</ThemedText>
              <TextInput
                style={styles.textInput}
                placeholder="Smith"
                placeholderTextColor="#666"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Age and Account Count */}
          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <ThemedText style={styles.inputLabel}>Age (optional)</ThemedText>
              <TextInput
                style={styles.textInput}
                placeholder="25"
                placeholderTextColor="#666"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <ThemedText style={styles.inputLabel}>Bank Accounts</ThemedText>
              <TextInput
                style={styles.textInput}
                placeholder="3"
                placeholderTextColor="#666"
                value={accountCount}
                onChangeText={setAccountCount}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
          </View>

          {/* Assets */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>
              Assets (optional) 💰
            </ThemedText>
            <TextInput
              style={styles.textInput}
              placeholder="$15,000"
              placeholderTextColor="#666"
              value={assets ? formatCurrency(assets) : assets}
              onChangeText={setAssets}
              keyboardType="numeric"
            />
            <ThemedText style={styles.helperText}>
              Savings, investments, property value, etc.
            </ThemedText>
          </View>

          {/* Liabilities */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>
              Liabilities (optional) 💳
            </ThemedText>
            <TextInput
              style={styles.textInput}
              placeholder="$5,000"
              placeholderTextColor="#666"
              value={liabilities ? formatCurrency(liabilities) : liabilities}
              onChangeText={setLiabilities}
              keyboardType="numeric"
            />
            <ThemedText style={styles.helperText}>
              Credit card debt, loans, mortgages, etc.
            </ThemedText>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              disabled={isLoading}
            >
              <ThemedText style={styles.skipButtonText}>
                Skip for now
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.continueButton,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={validateAndContinue}
              disabled={isLoading}
            >
              <LinearGradient
                colors={["#00FF7F", "#32CD32"]}
                style={styles.continueButtonGradient}
              >
                <ThemedText style={styles.continueButtonText}>
                  {isLoading ? "Saving..." : "Continue"}
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Privacy Note */}
          <ThemedText style={styles.privacyNote}>
            🔒 Your information is secure and never shared with third parties
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
  },
  verificationBanner: {
    backgroundColor: "rgba(255, 165, 0, 0.2)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 165, 0, 0.3)",
  },
  verificationText: {
    color: "#FFA500",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  resendButton: {
    alignSelf: "center",
    backgroundColor: "rgba(255, 165, 0, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resendButtonText: {
    color: "#FFA500",
    fontSize: 14,
    fontWeight: "600",
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressText: {
    fontSize: 14,
    color: "#CCCCCC",
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "600",
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  row: {
    flexDirection: "row",
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
  helperText: {
    fontSize: 12,
    color: "#CCCCCC",
    marginTop: 4,
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  skipButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#CCCCCC",
  },
  continueButton: {
    flex: 1,
    borderRadius: 16,
    shadowColor: "#00FF7F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  continueButtonGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  privacyNote: {
    fontSize: 12,
    color: "#00FF7F",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "500",
  },
});
