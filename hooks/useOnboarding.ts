import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OnboardingData } from "@/components/onboarding/OnboardingContainer";

const ONBOARDING_STORAGE_KEY = "@ubroke_onboarding_completed";
const ONBOARDING_DATA_KEY = "@ubroke_onboarding_data";

export function useOnboarding() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<
    boolean | null
  >(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const [completedStatus, savedData] = await Promise.all([
        AsyncStorage.getItem(ONBOARDING_STORAGE_KEY),
        AsyncStorage.getItem(ONBOARDING_DATA_KEY),
      ]);

      setIsOnboardingCompleted(completedStatus === "true");

      if (savedData) {
        try {
          setOnboardingData(JSON.parse(savedData));
        } catch (error) {
          console.error("Error parsing onboarding data:", error);
          setOnboardingData(null);
        }
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      setIsOnboardingCompleted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async (data: OnboardingData) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "true"),
        AsyncStorage.setItem(ONBOARDING_DATA_KEY, JSON.stringify(data)),
      ]);

      setIsOnboardingCompleted(true);
      setOnboardingData(data);
      console.log("onboarding data",data);
    } catch (error) {
      console.error("Error saving onboarding completion:", error);
      throw error;
    }
  };

  const resetOnboarding = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY),
        AsyncStorage.removeItem(ONBOARDING_DATA_KEY),
      ]);

      setIsOnboardingCompleted(false);
      setOnboardingData(null);
    } catch (error) {
      console.error("Error resetting onboarding:", error);
      throw error;
    }
  };

  const updateOnboardingData = async (newData: Partial<OnboardingData>) => {
    try {
      const updatedData = { ...onboardingData, ...newData };
      await AsyncStorage.setItem(
        ONBOARDING_DATA_KEY,
        JSON.stringify(updatedData)
      );
      setOnboardingData(updatedData);
    } catch (error) {
      console.error("Error updating onboarding data:", error);
      throw error;
    }
  };

  return {
    isOnboardingCompleted,
    onboardingData,
    isLoading,
    completeOnboarding,
    resetOnboarding,
    updateOnboardingData,
  };
}
