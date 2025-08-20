import React from "react";
import { View, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { router } from "expo-router";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAuth } from "@/hooks/useAuth";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isOnboardingCompleted, isLoading: onboardingLoading } = useOnboarding();
  const { isAuthenticated, isOnboardingCompleted: dbOnboardingCompleted, loading: authLoading } = useAuth();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded && !onboardingLoading && !authLoading) {
      SplashScreen.hideAsync();

      // If user is authenticated, check database onboarding status
      if (isAuthenticated) {
        if (dbOnboardingCompleted) {
          // User has completed onboarding in database, go to main app
          router.replace("/(tabs)" as any);
        } else {
          // User is authenticated but hasn't completed onboarding
          router.replace("/onboarding/profile" as any);
        }
      } else {
        // User is not authenticated, check local onboarding status
      if (!isOnboardingCompleted) {
        router.replace("/onboarding/welcome" as any);
      }
    }
    }
  }, [loaded, onboardingLoading, authLoading, isAuthenticated, dbOnboardingCompleted, isOnboardingCompleted]);

  if (!loaded || onboardingLoading || authLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "500",
  },
});
