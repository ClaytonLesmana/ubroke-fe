import { useEffect, useState } from "react";
import { router } from "expo-router";
import { View, Alert } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export default function AuthCallback() {
  const [message, setMessage] = useState("Completing sign in...");
  const { session, user } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        if (!session?.user) {
          setMessage("Waiting for authentication...");
          return;
        }

        setMessage("Signing you in...");
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("onboarding_completed")
          .eq("id", session.user.id)
          .single();

        if (profile?.onboarding_completed) {
          router.replace("/(tabs)");
        } else {
          router.replace("/onboarding/profile");
        }
      } catch (error) {
        console.error("Unexpected error in auth callback:", error);
        setMessage("Something went wrong");
        setTimeout(() => router.replace("/onboarding/auth"), 2000);
      }
    };

    handleAuthCallback();
  }, [session]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1a1a2e", padding: 20 }}>
      <ThemedText style={{ color: "#FFFFFF", fontSize: 18, textAlign: "center", marginBottom: 20 }}>{message}</ThemedText>
    </View>
  );
}