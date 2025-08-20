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
          paddingTop: 80,
          paddingBottom: 100,
          paddingHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}
      >

          {/* Logo Area */}
          <View style={{
            alignItems: 'center',
            marginTop: 20,
          }}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={{
                width: 99,
                height: 18,
                resizeMode: 'contain',
              }}
            />
          </View>

          {/* Illustration Area */}
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 20,
          }}>
            {/* Simple Empty Square */}
            <View style={{
              width: 250,
              height: 250,
              backgroundColor: '#F4F7FA',
              borderRadius: 16,
            }} />
          </View>

          {/* Text Content */}
          <View style={{
            alignItems: 'center',
            paddingHorizontal: 24,
            marginBottom: 20,
          }}>
            <ThemedText style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: AppColors.gray[500],
              textAlign: 'center',
              marginBottom: 16,
            }}>
              Welcome to UBroke
            </ThemedText>

            <ThemedText style={{
              fontSize: 14,
              color: AppColors.gray[400],
              textAlign: 'center',
              fontFamily: 'Geist',
              fontStyle: 'normal',
              fontWeight: '400',
              lineHeight: 21,
              letterSpacing: -0.266,
              paddingHorizontal: 20,
            }}>
              Broke but make it chic! Let's get your money glowing in just a few steps. Ready to slay your finances? 🚀
            </ThemedText>
          </View>

          {/* Get Started Button */}
          <TouchableOpacity
            style={{
              borderRadius: 32,
              paddingVertical: 16,
              paddingHorizontal: 48,
              minWidth: width - 48,
              minHeight: 56,
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
              fontSize: 18,
              fontWeight: '600',
              color: AppColors.gray[0],
              textAlign: 'center',
            }}>Get Started</ThemedText>
          </TouchableOpacity>
  
      </ScrollView>

      {/* Development Navigation */}
      <View style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <View style={{ width: 60 }} />
        
        <View style={{
          backgroundColor: 'rgba(0,0,0,0.1)',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
        }}>
          <ThemedText style={{ fontSize: 12, color: '#666' }}>1/5</ThemedText>
        </View>
        
        <TouchableOpacity
          style={{
            backgroundColor: AppColors.primary[300],
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 16,
          }}
          onPress={() => router.push('/onboarding/auth')}
        >
          <ThemedText style={{ color: 'white', fontSize: 12 }}>Next →</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
