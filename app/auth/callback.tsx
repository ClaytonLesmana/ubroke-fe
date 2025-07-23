import { useEffect, useState } from "react";
import { router } from "expo-router";
import { View, Alert } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export default function AuthCallback() {
  const [message, setMessage] = useState("Completing sign in...");
  const { user, isEmailVerified } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current session to see if the user is authenticated
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          setMessage("Authentication failed");
          Alert.alert("Authentication Error", error.message, [
            { text: "OK", onPress: () => router.replace("/onboarding/auth") },
          ]);
          return;
        }

        if (session?.user) {
          // Check if this is from email verification
          if (session.user.email_confirmed_at) {
            setMessage("Email verified successfully!");

            // Check if user has completed onboarding
            const { data: profile } = await supabase
              .from("user_profiles")
              .select("onboarding_completed")
              .eq("id", session.user.id)
              .single();

            setTimeout(() => {
              if (profile?.onboarding_completed) {
                router.replace("/(tabs)");
              } else {
                router.replace("/onboarding/profile");
              }
            }, 1500);
          } else {
            // Regular sign in
            setMessage("Signing you in...");
            setTimeout(() => {
              router.replace("/onboarding/profile");
            }, 1000);
          }
        } else {
          // No session, redirect to auth
          setTimeout(() => {
            router.replace("/onboarding/auth");
          }, 1000);
        }
      } catch (error) {
        console.error("Unexpected error in auth callback:", error);
        setMessage("Something went wrong");
        setTimeout(() => {
          router.replace("/onboarding/auth");
        }, 2000);
      }
    };

    handleAuthCallback();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1a1a2e",
        padding: 20,
      }}
    >
      <ThemedText
        style={{
          color: "#FFFFFF",
          fontSize: 18,
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        {message}
      </ThemedText>

      {message.includes("verified") && (
        <ThemedText
          style={{
            color: "#00FF7F",
            fontSize: 16,
            textAlign: "center",
          }}
        >
          Welcome to UBroke! 🎉
        </ThemedText>
      )}
    </View>
  );
}
