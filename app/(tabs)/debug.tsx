import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";

export default function DebugScreen() {
  const { resetOnboarding, onboardingData } = useOnboarding();
  const { user, session, userProfile, isAuthenticated, isEmailVerified, signOut, refreshSession } =
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

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out? This will log you out of your account.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await signOut();
              if (error) {
                Alert.alert("Error", `Failed to sign out: ${error.message}`);
              } else {
                Alert.alert(
                  "Signed Out",
                  "You have been successfully signed out.",
                  [
                    {
                      text: "OK",
                      onPress: () => router.replace("/onboarding/auth"),
                    },
                  ]
                );
              }
            } catch (error: any) {
              Alert.alert("Error", `Failed to sign out: ${error.message}`);
            }
          },
        },
      ]
    );
  };

  const handleTestGoogleOAuth = async () => {
    try {
      console.log("Testing Google OAuth configuration...");
      
      // Test the OAuth URL generation
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: Platform.OS === "web" 
            ? window.location.origin 
            : "ubroke://auth/callback",
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        Alert.alert(
          "Google OAuth Configuration Error",
          `Error: ${error.message}\n\nThis usually means:\n1. Google OAuth is not configured in Supabase\n2. Redirect URLs are incorrect\n3. Google Cloud Console setup is incomplete`
        );
      } else {
        Alert.alert(
          "Google OAuth Configuration OK",
          "OAuth URL generated successfully. The issue might be with the redirect flow or browser handling."
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Google OAuth Test Failed",
        `Error: ${error.message}`
      );
    }
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

  const handleRefreshSession = async () => {
    try {
      console.log("Refreshing session...");
      const session = await refreshSession();
      if (session) {
        Alert.alert(
          "Session Refreshed",
          `Session found for user: ${session.user?.email}`
        );
      } else {
        Alert.alert(
          "Session Refresh",
          "No session found"
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Session Refresh Failed",
        `Error: ${error.message}`
      );
    }
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

          <TouchableOpacity
            style={[
              styles.testButton,
              { backgroundColor: "#DB4437", marginTop: 8 },
            ]}
            onPress={handleTestGoogleOAuth}
          >
            <ThemedText style={styles.testButtonText}>
              Test Google OAuth Config
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
        <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetOnboarding}
        >
          <ThemedText style={styles.resetButtonText}>
            Reset Onboarding Flow
          </ThemedText>
        </TouchableOpacity>

          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: "#3B82F6" }]}
            onPress={handleRefreshSession}
          >
            <ThemedText style={styles.resetButtonText}>
              Refresh Session
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: "#DC2626" }]}
            onPress={handleLogout}
          >
            <ThemedText style={styles.resetButtonText}>
              Sign Out
            </ThemedText>
          </TouchableOpacity>
        </View>

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
  actionButtonsContainer: {
    marginBottom: 20,
    marginTop: 10,
  },
  resetButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
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
