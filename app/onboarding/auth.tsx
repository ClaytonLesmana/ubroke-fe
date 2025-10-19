import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import { Icon } from "@/components/Icon";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/hooks/useAuth";
import { AppColors } from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { scale } from "@/lib/scale";
import { spacing, radii } from "@/lib/theme";
import { cardShadow } from "@/lib/shadow";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    resetPassword,
    isAuthenticated,
    user,
    session,
  } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      const checkOnboardingStatus = async () => {
        try {
          const AsyncStorage = require("@react-native-async-storage/async-storage").default;
          const onboardingData = await AsyncStorage.getItem("onboardingData");
          const parsedData = onboardingData ? JSON.parse(onboardingData) : null;
          if (parsedData?.isCompleted) router.replace("/(tabs)");
          else router.replace("/onboarding/profile");
        } catch (error) {
          router.replace("/onboarding/profile");
        }
      };
      checkOnboardingStatus();
    }
  }, [isAuthenticated, user, session, isLoading]);

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert("Email Required", "Please enter your email address");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return false;
    }
    if (!showForgotPassword && !password.trim()) {
      Alert.alert("Password Required", "Please enter your password");
      return false;
    }
    if (!showForgotPassword && password.length < 6) {
      Alert.alert("Password Too Short", "Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Email Required", "Please enter your email address to reset your password");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }
    setIsLoading(true);
    try {
      const result = await resetPassword(email.trim());
      if (result.error) {
        Alert.alert("Password Reset Error", result.error.message);
        return;
      }
      Alert.alert("Password Reset Email Sent", "Check your email for password reset instructions. The link will be valid for 24 hours.", [{ text: "OK", onPress: () => setShowForgotPassword(false) }]);
    } catch (error: any) {
      Alert.alert("Password Reset Error", error.message || "Failed to send password reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async () => {
    if (!validateForm()) return;
    if (showForgotPassword) {
      await handleForgotPassword();
      return;
    }
    setIsLoading(true);
    try {
      let result;
      if (isLogin) result = await signInWithEmail(email.trim(), password);
      else result = await signUpWithEmail(email.trim(), password);
      if (result.error) {
        let errorMessage = result.error.message;
        if (result.error.message.includes("Invalid login credentials")) errorMessage = "Invalid email or password. Please check your credentials and try again.";
        else if (result.error.message.includes("User already registered")) errorMessage = "An account with this email already exists. Please sign in instead.";
        else if (result.error.message.includes("Signup requires a valid password")) errorMessage = "Please enter a valid password (minimum 6 characters).";
        Alert.alert("Authentication Error", errorMessage);
        return;
      }
      if (!isLogin && result.data?.user && !result.data.session) {
        Alert.alert("Verification Email Sent", "Please check your email and click the verification link to complete your account setup.", [{ text: "OK", onPress: () => { setIsLogin(true); setPassword(""); } }]);
        return;
      }
      if (isLogin && result.data?.session) return;
      setIsLoading(false);
    } catch (error: any) {
      Alert.alert("Authentication Error", error.message || "Something went wrong.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.error) {
        Alert.alert("Google Sign-In Error", result.error.message);
      }
    } catch (error: any) {
      Alert.alert("Google Sign-In Error", error.message || "Google sign-in failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: spacing.lg, paddingTop: scale(40), paddingBottom: scale(40) }}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={{ alignItems: 'flex-start', marginBottom: scale(60) }}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={{ width: scale(99), height: scale(18), resizeMode: 'contain' }}
            />
          </View>

          {/* Header */}
          <View style={{ marginBottom: spacing.md }}>
            <ThemedText style={{ fontSize: scale(28), fontWeight: '700', color: '#1B1B1B', lineHeight: scale(36), marginBottom: scale(6) }}>
              Join the Glow Up Gang
            </ThemedText>
            <ThemedText style={{ fontSize: scale(14), fontWeight: '400', color: '#848484', lineHeight: scale(20) }}>
              Sign up or log in to start your money journey.
            </ThemedText>
          </View>

          {/* Sign Up / Login Toggle */}
          <View style={{ flexDirection: 'row', backgroundColor: '#F8F9FA', borderRadius: radii.pill, padding: scale(4), marginBottom: spacing.md, ...cardShadow }}>
            <TouchableOpacity
              style={{ flex: 1, paddingVertical: scale(12), paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, marginRight: scale(2), backgroundColor: !isLogin ? AppColors.primary[300] : 'transparent', shadowColor: !isLogin ? '#936DFF' : 'transparent', shadowOffset: { width: 0, height: 2 }, shadowOpacity: !isLogin ? 0.3 : 0, shadowRadius: 4, elevation: !isLogin ? 4 : 0 }}
              onPress={() => setIsLogin(false)}
              activeOpacity={0.8}
            >
              <ThemedText style={{ fontSize: scale(16), fontWeight: '600', color: !isLogin ? '#FFFFFF' : '#848484' }}>
                Sign Up
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{ flex: 1, paddingVertical: scale(12), paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, marginLeft: scale(2), backgroundColor: isLogin ? AppColors.primary[300] : 'transparent', shadowColor: isLogin ? '#936DFF' : 'transparent', shadowOffset: { width: 0, height: 2 }, shadowOpacity: isLogin ? 0.3 : 0, shadowRadius: 4, elevation: isLogin ? 4 : 0 }}
              onPress={() => setIsLogin(true)}
              activeOpacity={0.8}
            >
              <ThemedText style={{ fontSize: scale(16), fontWeight: '600', color: isLogin ? '#FFFFFF' : '#848484' }}>
                Login
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={{ flex: 1 }}>
            {/* Email */}
            <View style={{ marginBottom: spacing.sm }}>
              <ThemedText style={{ fontSize: scale(14), fontWeight: '500', color: '#1B1B1B', marginBottom: scale(6) }}>Email</ThemedText>
              <TextInput
                style={{ backgroundColor: '#F8F9FA', borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: scale(14), fontSize: scale(16), color: '#1B1B1B', borderWidth: 1, borderColor: '#E8E9EA' }}
                placeholder="Loisbecket@gmail.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password */}
            {!showForgotPassword && (
              <View style={{ marginBottom: spacing.sm }}>
                <ThemedText style={{ fontSize: scale(14), fontWeight: '500', color: '#1B1B1B', marginBottom: scale(6) }}>Password</ThemedText>
                <View style={{ position: 'relative' }}>
                  <TextInput
                    style={{ backgroundColor: '#F8F9FA', borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: scale(14), paddingRight: scale(50), fontSize: scale(16), color: '#1B1B1B', borderWidth: 1, borderColor: '#E8E9EA' }}
                    placeholder="*******"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={{ position: 'absolute', right: spacing.md, top: scale(14), bottom: scale(14), justifyContent: 'center' }}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Icon
                      name={showPassword ? "passwordHiddenIcon" : "passwordIcon"}
                      size={scale(20)}
                      color={AppColors.gray[400]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Forgot Password Link */}
            <View style={{ marginBottom: spacing.sm, opacity: (isLogin && !showForgotPassword) ? 1 : 0 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => setShowForgotPassword(true)}>
                  <ThemedText style={{ fontSize: scale(14), color: '#936DFF', fontWeight: '500' }}>
                    Forgot Password ?
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Back to Login Link */}
            {showForgotPassword && (
              <TouchableOpacity onPress={() => setShowForgotPassword(false)} style={{ alignItems: 'flex-end', marginBottom: spacing.md }}>
                <ThemedText style={{ fontSize: scale(14), color: '#936DFF', fontWeight: '500' }}>
                  Back to Sign In
                </ThemedText>
              </TouchableOpacity>
            )}

            {/* Login/Signup Button */}
            <TouchableOpacity
              style={{ backgroundColor: AppColors.primary[300], borderRadius: radii.xl, paddingVertical: scale(14), alignItems: 'center', marginBottom: spacing.md, shadowColor: 'rgba(147, 109, 255, 0.3)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 8, elevation: 4, opacity: isLoading ? 0.6 : 1 }}
              onPress={handleAuth}
              disabled={isLoading}
            >
              <ThemedText style={{ fontSize: scale(16), fontWeight: '600', color: AppColors.gray[0] }}>
                {isLoading
                  ? "Loading..."
                  : showForgotPassword
                  ? "Send Reset Email"
                  : isLogin
                  ? "Login"
                  : "Sign Up"}
              </ThemedText>
            </TouchableOpacity>

            {!showForgotPassword && (
              <>
                {/* Divider */}
                <View style={{ alignItems: 'center', marginBottom: scale(20) }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: '#E8E9EA' }} />
                    <ThemedText style={{ fontSize: scale(14), color: '#848484', fontWeight: '400', marginHorizontal: spacing.md }}>
                      {isLogin ? 'Login with' : 'Sign up with'}
                    </ThemedText>
                    <View style={{ flex: 1, height: 1, backgroundColor: '#E8E9EA' }} />
                  </View>
                </View>

                {/* Google Button */}
                <TouchableOpacity
                  style={{ backgroundColor: '#FFFFFF', borderRadius: radii.xl, borderWidth: 1, borderColor: '#E8E9EA', paddingVertical: scale(14), alignItems: 'center', marginBottom: spacing.md, ...cardShadow, opacity: isLoading ? 0.6 : 1 }}
                  onPress={handleGoogleAuth}
                  disabled={isLoading}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ marginRight: scale(12) }}>
                      <Icon name="googleIcon" size={scale(20)} />
                    </View>
                    <ThemedText style={{ fontSize: scale(16), fontWeight: '500', color: '#1B1B1B' }}>Google</ThemedText>
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Development Navigation */}
      <View style={{ position: 'absolute', bottom: scale(20), left: scale(20), right: scale(20), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity style={{ backgroundColor: '#f0f0f0', paddingHorizontal: spacing.md, paddingVertical: scale(8), borderRadius: radii.md }} onPress={() => router.back()}>
          <ThemedText style={{ color: '#666', fontSize: scale(12) }}>← Back</ThemedText>
        </TouchableOpacity>
        
        <View style={{ backgroundColor: 'rgba(0,0,0,0.1)', paddingHorizontal: spacing.sm, paddingVertical: scale(4), borderRadius: radii.md }}>
          <ThemedText style={{ fontSize: scale(12), color: '#666' }}>2/5</ThemedText>
        </View>
        
        <TouchableOpacity style={{ backgroundColor: '#936DFF', paddingHorizontal: spacing.md, paddingVertical: scale(8), borderRadius: radii.md }} onPress={() => router.push('/onboarding/profile')}>
          <ThemedText style={{ color: 'white', fontSize: scale(12) }}>Next →</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
