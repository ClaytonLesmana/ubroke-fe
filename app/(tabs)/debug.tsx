import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

export default function DebugScreen() {
  const { resetOnboarding, onboardingData } = useOnboarding();
  const { user, session, userProfile, isAuthenticated, isEmailVerified } =
    useAuth();
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Testing...");
  const [envStatus, setEnvStatus] = useState<string>("Checking...");
  const [dbStatus, setDbStatus] = useState<string>("Testing...");

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const checkEnvironmentVariables = () => {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      setEnvStatus("❌ Missing environment variables");
      return false;
    }

    if (
      supabaseUrl.includes("your-project-ref") ||
      supabaseKey.includes("your-anon-key")
    ) {
      setEnvStatus("⚠️ Using placeholder values");
      return false;
    }

    setEnvStatus("✅ Environment variables set");
    return true;
  };

  const testDatabaseConnection = async () => {
    try {
      // Try to query the user_profiles table
      const { data, error } = await supabase
        .from("user_profiles")
        .select("count(*)")
        .limit(1);

      if (error) {
        setDbStatus(`❌ Database error: ${error.message}`);
        return false;
      }

      setDbStatus("✅ Database connection successful");
      return true;
    } catch (error: any) {
      setDbStatus(`❌ Database error: ${error.message}`);
      return false;
    }
  };

  const testSupabaseConnection = async () => {
    setConnectionStatus("Testing...");
    setEnvStatus("Checking...");
    setDbStatus("Testing...");

    // Check environment variables
    const envOk = checkEnvironmentVariables();

    if (!envOk) {
      setConnectionStatus("❌ Environment variables not configured");
      setDbStatus("⏭️ Skipped (env vars missing)");
      return;
    }

    try {
      // Test basic Supabase connection
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setConnectionStatus(`❌ Connection failed: ${error.message}`);
        setDbStatus("⏭️ Skipped (connection failed)");
        return;
      }

      setConnectionStatus("✅ Supabase connection successful");

      // Test database connection
      await testDatabaseConnection();
    } catch (error: any) {
      setConnectionStatus(`❌ Connection error: ${error.message}`);
      setDbStatus("⏭️ Skipped (connection failed)");
    }
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      "Reset Onboarding",
      "This will reset the onboarding flow for testing. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetOnboarding()
              .then(() => {
                Alert.alert(
                  "Success",
                  "Onboarding has been reset. Please restart the app."
                );
              })
              .catch((error) => {
                Alert.alert("Error", "Failed to reset onboarding.");
              });
          },
        },
      ]
    );
  };

  const handleTestConnection = () => {
    testSupabaseConnection();
  };

  const handleTestEmail = async () => {
    const testEmail = "test@example.com"; // Replace with your email

    Alert.prompt(
      "Test Email Verification",
      "Enter your email to test verification email sending:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Test",
          onPress: async (email) => {
            if (!email) return;

            try {
              const { data, error } = await supabase.auth.signUp({
                email: email,
                password: "test123456", // Dummy password for testing
                options: {
                  data: { first_name: "Test", last_name: "User" },
                },
              });

              if (error) {
                Alert.alert(
                  "Error",
                  `Failed to send test email: ${error.message}`
                );
              } else if (data.user && !data.session) {
                Alert.alert(
                  "Success!",
                  `Verification email sent to ${email}. Check your inbox and spam folder.`
                );
              } else {
                Alert.alert(
                  "Warning",
                  "Signup succeeded but no verification email was sent. Check your email settings in Supabase."
                );
              }
            } catch (error: any) {
              Alert.alert("Error", `Failed to test email: ${error.message}`);
            }
          },
        },
      ],
      "plain-text",
      testEmail
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.title}>
          Debug & Testing 🔧
        </ThemedText>

        {/* Supabase Connection Status */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            🔌 Supabase Connection
          </ThemedText>
          <View style={styles.statusContainer}>
            <ThemedText style={styles.statusText}>
              Environment: {envStatus}
            </ThemedText>
            <ThemedText style={styles.statusText}>
              Connection: {connectionStatus}
            </ThemedText>
            <ThemedText style={styles.statusText}>
              Database: {dbStatus}
            </ThemedText>
          </View>
          <TouchableOpacity
            style={styles.testButton}
            onPress={handleTestConnection}
          >
            <ThemedText style={styles.testButtonText}>
              Test Connection
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.testButton,
              { backgroundColor: "#10B981", marginTop: 8 },
            ]}
            onPress={handleTestEmail}
          >
            <ThemedText style={styles.testButtonText}>
              Test Email Verification
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Auth Status */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            🔐 Authentication Status
          </ThemedText>
          <View style={styles.statusContainer}>
            <ThemedText style={styles.statusText}>
              Authenticated: {isAuthenticated ? "✅ Yes" : "❌ No"}
            </ThemedText>
            <ThemedText style={styles.statusText}>
              Email Verified: {isEmailVerified ? "✅ Yes" : "❌ No"}
            </ThemedText>
            <ThemedText style={styles.statusText}>
              User ID:{" "}
              {user?.id ? `✅ ${user.id.substring(0, 8)}...` : "❌ None"}
            </ThemedText>
            <ThemedText style={styles.statusText}>
              Email: {user?.email || "❌ None"}
            </ThemedText>
            <ThemedText style={styles.statusText}>
              Profile: {userProfile ? "✅ Loaded" : "❌ None"}
            </ThemedText>
          </View>
        </View>

        {/* Environment Variables */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            🌍 Environment Variables
          </ThemedText>
          <ThemedText style={styles.dataText}>
            SUPABASE_URL:{" "}
            {process.env.EXPO_PUBLIC_SUPABASE_URL
              ? process.env.EXPO_PUBLIC_SUPABASE_URL.substring(0, 30) + "..."
              : "❌ Not set"}
          </ThemedText>
          <ThemedText style={styles.dataText}>
            SUPABASE_KEY:{" "}
            {process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
              ? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) +
                "..."
              : "❌ Not set"}
          </ThemedText>
        </View>

        {/* Onboarding Data */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            📋 Onboarding Data
          </ThemedText>
          <ThemedText style={styles.dataText}>
            {onboardingData
              ? JSON.stringify(onboardingData, null, 2)
              : "No onboarding data found"}
          </ThemedText>
        </View>

        {/* User Profile Data */}
        {userProfile && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              👤 User Profile
            </ThemedText>
            <ThemedText style={styles.dataText}>
              {JSON.stringify(userProfile, null, 2)}
            </ThemedText>
          </View>
        )}

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetOnboarding}
        >
          <ThemedText style={styles.resetButtonText}>
            Reset Onboarding Flow
          </ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.note}>
          Note: This tab is for testing purposes only and should be removed in
          production.
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "600",
  },
  statusContainer: {
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: "monospace",
  },
  dataText: {
    fontSize: 11,
    fontFamily: "monospace",
    opacity: 0.8,
    lineHeight: 16,
  },
  testButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  testButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  resetButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  note: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 10,
  },
});
