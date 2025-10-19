import React, { useEffect, useRef } from "react";
import {
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StatusBar,
  Image,
} from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/hooks/useAuth";
import { AppColors } from "@/constants/Colors";
import { scale } from "@/lib/scale";
import { spacing, radii } from "@/lib/theme";
import { cardShadow } from "@/lib/shadow";

const { width, height } = Dimensions.get("window");

export default function WelcomePage() {
  const { checkCurrentSession, user, isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    router.push("/onboarding/auth");
  };

  return (
    <ThemedView style={{
      flex: 1,
      backgroundColor: AppColors.gray[0],
    }}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.gray[0]} />
      
      <ScrollView 
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: scale(80),
          paddingBottom: scale(100),
          paddingHorizontal: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >

          {/* Logo Area */}
          <View style={{
            alignItems: 'center',
            marginTop: scale(20),
          }}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={{
                width: scale(99),
                height: scale(18),
                resizeMode: 'contain',
              }}
            />
          </View>

          {/* Illustration Area */}
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: scale(20),
          }}>
            <View style={{
              width: scale(250),
              height: scale(250),
              backgroundColor: '#F4F7FA',
              borderRadius: radii.md,
              ...cardShadow,
            }} />
          </View>

          {/* Text Content */}
          <View style={{
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            marginBottom: spacing.md,
          }}>
            <ThemedText style={{
              fontSize: scale(24),
              fontWeight: 'bold',
              color: AppColors.gray[500],
              textAlign: 'center',
              marginBottom: spacing.md,
            }}>
              Welcome to UBroke
            </ThemedText>

            <ThemedText style={{
              fontSize: scale(14),
              color: AppColors.gray[400],
              textAlign: 'center',
              fontFamily: 'Geist',
              fontStyle: 'normal',
              fontWeight: '400',
              lineHeight: scale(21),
              letterSpacing: -0.266,
              paddingHorizontal: spacing.md,
            }}>
              Broke but make it chic! Let's get your money glowing in just a few steps. Ready to slay your finances? 🚀
            </ThemedText>
          </View>

          {/* Get Started Button */}
          <TouchableOpacity
            style={{
              borderRadius: radii.xl,
              paddingVertical: scale(16),
              paddingHorizontal: scale(48),
              minWidth: width - scale(48),
              minHeight: scale(56),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: AppColors.primary[300],
              shadowColor: AppColors.primary[300],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <ThemedText style={{
              fontSize: scale(18),
              fontWeight: '600',
              color: AppColors.gray[0],
              textAlign: 'center',
            }}>Get Started</ThemedText>
          </TouchableOpacity>
  
      </ScrollView>

      {/* Development Navigation */}
      <View style={{
        position: 'absolute',
        bottom: scale(20),
        left: scale(20),
        right: scale(20),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <View style={{ width: scale(60) }} />
        
        <View style={{
          backgroundColor: 'rgba(0,0,0,0.1)',
          paddingHorizontal: spacing.sm,
          paddingVertical: scale(4),
          borderRadius: radii.md,
        }}>
          <ThemedText style={{ fontSize: scale(12), color: '#666' }}>1/5</ThemedText>
        </View>
        
        <TouchableOpacity
          style={{
            backgroundColor: AppColors.primary[300],
            paddingHorizontal: spacing.md,
            paddingVertical: scale(8),
            borderRadius: radii.md,
          }}
          onPress={() => router.push('/onboarding/auth')}
        >
          <ThemedText style={{ color: 'white', fontSize: scale(12) }}>Next →</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
