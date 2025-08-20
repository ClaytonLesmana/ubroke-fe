import { Tabs } from "expo-router";
import React from "react";
import { TouchableOpacity, Alert, View, StatusBar } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import CustomTabBar from "@/components/CustomTabBar";
import { useOnboarding } from "@/hooks/useOnboarding";
import { AppColors } from "@/constants/Colors";

export default function TabLayout() {
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
    <View style={{ flex: 1, backgroundColor: AppColors.gray[0] }}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={AppColors.gray[0]}
        translucent={false}
      />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          title: "Goals",
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Budget",
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: "Insights",
        }}
      />
      {/* <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
        }}
      /> */}
      </Tabs>
    </View>

  );
}
