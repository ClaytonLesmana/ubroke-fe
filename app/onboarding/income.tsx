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

export default function IncomePage() {
  const [salary, setSalary] = useState("");
  const [salaryFrequency, setSalaryFrequency] = useState<
    "weekly" | "biweekly" | "monthly"
  >("monthly");
  const [nextPayDate, setNextPayDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { updateOnboardingData, onboardingData } = useOnboarding();

  useEffect(() => {
    // Pre-fill with existing data
    if (onboardingData) {
      setSalary(onboardingData.salary?.toString() || "");
      setSalaryFrequency(onboardingData.salaryFrequency || "monthly");
      setNextPayDate(onboardingData.nextPayDate || "");
    }
  }, [onboardingData]);

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

  const calculateBreakdown = () => {
    const salaryNum = parseCurrency(salary);
    if (!salaryNum) return null;

    let monthly = 0;
    switch (salaryFrequency) {
      case "weekly":
        monthly = salaryNum * 4.33; // Average weeks per month
        break;
      case "biweekly":
        monthly = salaryNum * 2.17; // Average biweeks per month
        break;
      case "monthly":
        monthly = salaryNum;
        break;
    }

    return {
      weekly: monthly / 4.33,
      biweekly: monthly / 2.17,
      monthly: monthly,
      annual: monthly * 12,
    };
  };

  const breakdown = calculateBreakdown();

  const validateAndContinue = async () => {
    setIsLoading(true);

    try {
      const incomeData = {
        salary: parseCurrency(salary),
        salaryFrequency,
        nextPayDate: nextPayDate || undefined,
      };

      await updateOnboardingData(incomeData);
      router.push("/onboarding/tutorial");
    } catch (error) {
      Alert.alert("Error", "Failed to save income data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/onboarding/tutorial");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
            What's your income situation? 💰
          </ThemedText>
          <ThemedText style={styles.subHeaderText}>
            Help us track your cash flow and plan your budget
          </ThemedText>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <ThemedText style={styles.progressText}>
            Step 2 of 2 (100%)
          </ThemedText>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={["#00FF7F", "#32CD32"]}
              style={[styles.progressFill, { width: "100%" }]}
            />
          </View>
        </View>

        {/* Form */}
        <ThemedView style={styles.formContainer}>
          {/* Salary Input */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>
              Salary/Income (optional) 💸
            </ThemedText>
            <TextInput
              style={styles.textInput}
              placeholder="$5,000"
              placeholderTextColor="#666"
              value={salary ? formatCurrency(salary) : salary}
              onChangeText={setSalary}
              keyboardType="numeric"
            />
          </View>

          {/* Frequency Picker */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>
              How often do you get paid?
            </ThemedText>
            <View style={styles.frequencyContainer}>
              {["weekly", "biweekly", "monthly"].map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.frequencyOption,
                    salaryFrequency === freq && styles.frequencyOptionSelected,
                  ]}
                  onPress={() => setSalaryFrequency(freq as any)}
                >
                  <ThemedText
                    style={[
                      styles.frequencyText,
                      salaryFrequency === freq && styles.frequencyTextSelected,
                    ]}
                  >
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Next Pay Date */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>
              Next payday (optional) 📅
            </ThemedText>
            <TextInput
              style={styles.textInput}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#666"
              value={nextPayDate}
              onChangeText={setNextPayDate}
            />
            <ThemedText style={styles.helperText}>
              Format: YYYY-MM-DD (e.g., 2024-01-15)
            </ThemedText>
          </View>

          {/* Income Breakdown */}
          {breakdown && (
            <View style={styles.breakdownContainer}>
              <ThemedText style={styles.breakdownTitle}>
                📊 Your Income Breakdown
              </ThemedText>
              <View style={styles.breakdownGrid}>
                <View style={styles.breakdownItem}>
                  <ThemedText style={styles.breakdownLabel}>Weekly</ThemedText>
                  <ThemedText style={styles.breakdownValue}>
                    {formatCurrency(breakdown.weekly.toString())}
                  </ThemedText>
                </View>
                <View style={styles.breakdownItem}>
                  <ThemedText style={styles.breakdownLabel}>
                    Biweekly
                  </ThemedText>
                  <ThemedText style={styles.breakdownValue}>
                    {formatCurrency(breakdown.biweekly.toString())}
                  </ThemedText>
                </View>
                <View style={styles.breakdownItem}>
                  <ThemedText style={styles.breakdownLabel}>Monthly</ThemedText>
                  <ThemedText style={styles.breakdownValue}>
                    {formatCurrency(breakdown.monthly.toString())}
                  </ThemedText>
                </View>
                <View style={styles.breakdownItem}>
                  <ThemedText style={styles.breakdownLabel}>Annual</ThemedText>
                  <ThemedText style={styles.breakdownValue}>
                    {formatCurrency(breakdown.annual.toString())}
                  </ThemedText>
                </View>
              </View>
            </View>
          )}

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
            💡 This helps us provide better financial insights and budgeting
            tips
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
  frequencyContainer: {
    flexDirection: "row",
    gap: 8,
  },
  frequencyOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
  },
  frequencyOptionSelected: {
    backgroundColor: "#00FF7F",
    borderColor: "#00FF7F",
  },
  frequencyText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  frequencyTextSelected: {
    color: "#000000",
  },
  breakdownContainer: {
    backgroundColor: "rgba(0, 255, 127, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 127, 0.3)",
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00FF7F",
    textAlign: "center",
    marginBottom: 12,
  },
  breakdownGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  breakdownItem: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
  },
  breakdownLabel: {
    fontSize: 12,
    color: "#CCCCCC",
    marginBottom: 4,
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
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
