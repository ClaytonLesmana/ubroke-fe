import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAuth } from "@/hooks/useAuth";
import { AppColors } from "@/constants/Colors";
import { scale } from "@/lib/scale";
import { spacing, radii } from "@/lib/theme";
import { cardShadow } from "@/lib/shadow";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [accountCount, setAccountCount] = useState("");
  const [assets, setAssets] = useState("");
  const [liabilities, setLiabilities] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { updateOnboardingData, onboardingData } = useOnboarding();
  const { user, userProfile, isEmailVerified, resendEmailVerification, isAuthenticated } =
    useAuth();

  useEffect(() => {
    if (onboardingData) {
      setName(onboardingData.name || "");
      setAge(onboardingData.age?.toString() || "");
      setAccountCount(onboardingData.accountCount?.toString() || "");
      setAssets(onboardingData.assets?.toString() || "");
      setLiabilities(onboardingData.liabilities?.toString() || "");
    }
    if (userProfile) {
      setName(userProfile.first_name && userProfile.last_name ? `${userProfile.first_name} ${userProfile.last_name}` : "");
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
    if (!name.trim()) {
      Alert.alert("Name Required", "Please enter your name");
      return;
    }
    if (age && (parseInt(age) < 13 || parseInt(age) > 120)) {
      Alert.alert("Invalid Age", "Please enter a valid age");
      return;
    }
    setIsLoading(true);
    try {
      const profileData = {
        name: name.trim(),
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
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: spacing.lg, paddingTop: scale(40), paddingBottom: scale(40) }}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Indicator */}
          <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: scale(20), marginBottom: scale(40) }}>
            <ThemedText style={{ textAlign: 'center', justifyContent: 'center', color: AppColors.gray[500], fontSize: scale(12), fontWeight: '600', lineHeight: scale(18) }}>
              Step 1/3 complete
            </ThemedText>
            <View style={{ alignSelf: 'stretch', height: scale(4), justifyContent: 'flex-start', alignItems: 'center', gap: scale(12), flexDirection: 'row' }}>
              <View style={{ justifyContent: 'flex-start', alignItems: 'center', gap: scale(4), flexDirection: 'row' }}>
                <View style={{ width: scale(107), height: scale(6), backgroundColor: AppColors.primary[300], borderRadius: radii.pill }} />
                <View style={{ width: scale(107), height: scale(6), backgroundColor:  AppColors.gray[100], borderRadius: radii.pill }} />
                <View style={{ width: scale(107), height: scale(6), backgroundColor: AppColors.gray[100], borderRadius: radii.pill }} />
              </View>
            </View>
          </View>

          {/* Header */}
          <View style={{ marginBottom: scale(40) }}>
            <ThemedText style={{ fontSize: scale(32), fontWeight: '700', color: '#1B1B1B', lineHeight: scale(40), marginBottom: scale(12), textAlign: 'center' }}>
              Spill Your Money Tea!
            </ThemedText>
            <ThemedText style={{ fontSize: scale(16), fontWeight: '400', color: '#848484', lineHeight: scale(24), textAlign: 'center' }}>
              Tell us a bit about you to kick things off. Skip if you're feeling shy.
            </ThemedText>
          </View>
          
          {/* Form */}
          <View style={{ flex: 1 }}>
            {/* Name */}
            <View style={{ marginBottom: scale(20) }}>
              <ThemedText style={{ fontSize: scale(14), fontWeight: '500', color: '#1B1B1B', marginBottom: scale(8) }}>Name</ThemedText>
              <TextInput
                style={{ backgroundColor: '#FFFFFF', borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: scale(16), fontSize: scale(16), color: '#1B1B1B', borderWidth: 1, borderColor: '#E8E9EA' }}
                placeholder="Alex Andrian"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            {/* Age */}
            <View style={{ marginBottom: scale(20) }}>
              <ThemedText style={{ fontSize: scale(14), fontWeight: '500', color: '#1B1B1B', marginBottom: scale(8) }}>Age</ThemedText>
              <TextInput
                style={{ backgroundColor: '#FFFFFF', borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: scale(16), fontSize: scale(16), color: '#1B1B1B', borderWidth: 1, borderColor: '#E8E9EA' }}
                placeholder="18"
                placeholderTextColor="#999"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>

            {/* Accounts Total */}
            <View style={{ marginBottom: scale(20) }}>
              <ThemedText style={{ fontSize: scale(14), fontWeight: '500', color: '#1B1B1B', marginBottom: scale(8) }}>Accounts total?</ThemedText>
              <TextInput
                style={{ backgroundColor: '#FFFFFF', borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: scale(16), fontSize: scale(16), color: '#1B1B1B', borderWidth: 1, borderColor: '#E8E9EA' }}
                placeholder="1"
                placeholderTextColor="#999"
                value={accountCount}
                onChangeText={setAccountCount}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>

            {/* Assets */}
            <View style={{ marginBottom: scale(20) }}>
              <ThemedText style={{ fontSize: scale(14), fontWeight: '500', color: '#1B1B1B', marginBottom: scale(8) }}>Assets</ThemedText>
              <TextInput
                style={{ backgroundColor: '#FFFFFF', borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: scale(16), fontSize: scale(16), color: '#1B1B1B', borderWidth: 1, borderColor: '#E8E9EA' }}
                placeholder="Enter a number"
                placeholderTextColor="#999"
                value={assets ? formatCurrency(assets) : assets}
                onChangeText={setAssets}
                keyboardType="numeric"
              />
            </View>

            {/* Liabilities */}
            <View style={{ marginBottom: scale(40) }}>
              <ThemedText style={{ fontSize: scale(14), fontWeight: '500', color: '#1B1B1B', marginBottom: scale(8) }}>Liabilities</ThemedText>
              <TextInput
                style={{ backgroundColor: '#FFFFFF', borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: scale(16), fontSize: scale(16), color: '#1B1B1B', borderWidth: 1, borderColor: '#E8E9EA' }}
                placeholder="Enter a number"
                placeholderTextColor="#999"
                value={liabilities ? formatCurrency(liabilities) : liabilities}
                onChangeText={setLiabilities}
                keyboardType="numeric"
              />
            </View>

            {/* Action Buttons */}
            <View style={{ gap: spacing.md, marginBottom: spacing.md }}>
              <TouchableOpacity
                style={{ backgroundColor: AppColors.primary[300], borderRadius: radii.xl, paddingVertical: scale(16), alignItems: 'center', shadowColor: 'rgba(147, 109, 255, 0.3)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 8, elevation: 4, opacity: isLoading ? 0.6 : 1 }}
                onPress={validateAndContinue}
                disabled={isLoading}
              >
                <ThemedText style={{ fontSize: scale(16), fontWeight: '600', color: '#FFFFFF' }}>
                  {isLoading ? "Loading..." : "Next"}
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ backgroundColor: '#FFFFFF', borderRadius: radii.xl, borderWidth: 2, borderColor: '#936DFF', paddingVertical: scale(16), alignItems: 'center', opacity: isLoading ? 0.6 : 1 }}
                onPress={handleSkip}
                disabled={isLoading}
              >
                <ThemedText style={{ fontSize: scale(16), fontWeight: '600', color: '#936DFF' }}>
                  Skip
                </ThemedText>
              </TouchableOpacity>
            </View>

            <ThemedText style={{ fontSize: scale(14), color: '#848484', textAlign: 'center', fontStyle: 'italic' }}>
              No pressure, you can add more later!
            </ThemedText>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Development Navigation */}
      <View style={{ position: 'absolute', bottom: scale(20), left: scale(20), right: scale(20), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity style={{ backgroundColor: '#f0f0f0', paddingHorizontal: spacing.md, paddingVertical: scale(8), borderRadius: radii.md }} onPress={() => router.back()}>
          <ThemedText style={{ color: '#666', fontSize: scale(12) }}>← Back</ThemedText>
        </TouchableOpacity>
        
        <View style={{ backgroundColor: 'rgba(0,0,0,0.1)', paddingHorizontal: spacing.sm, paddingVertical: scale(4), borderRadius: radii.md }}>
          <ThemedText style={{ fontSize: scale(12), color: '#666' }}>3/5</ThemedText>
        </View>
        
        <TouchableOpacity style={{ backgroundColor: '#936DFF', paddingHorizontal: spacing.md, paddingVertical: scale(8), borderRadius: radii.md }} onPress={() => router.push('/onboarding/income')}>
          <ThemedText style={{ color: 'white', fontSize: scale(12) }}>Next →</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
