import { Tabs } from "expo-router";
import React from "react";
import { Platform, TouchableOpacity, Alert } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useOnboarding } from "@/hooks/useOnboarding";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { resetOnboarding } = useOnboarding();

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

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="message.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.3.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="invest"
        options={{
          title: "Invest",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="chart.line.uptrend.xyaxis"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: "Portfolio",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="briefcase.fill" color={color} />
          ),
        }}
      />
      {/* Debug option - remove in production */}
      <Tabs.Screen
        name="debug"
        options={{
          title: "🔧",
          tabBarIcon: ({ color }) => (
            <TouchableOpacity onPress={handleResetOnboarding}>
              <IconSymbol size={28} name="gear" color={color} />
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}
