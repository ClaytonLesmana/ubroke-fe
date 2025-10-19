import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { scale } from '@/lib/scale';
import { spacing, radii, colors } from '@/lib/theme';
import { cardShadow } from '@/lib/shadow';

interface JourneyCardProps {
  currentAmount: number;
  targetAmount: number;
  onViewAnalytics?: () => void;
}

export function JourneyCard({ 
  currentAmount, 
  targetAmount, 
  onViewAnalytics 
}: JourneyCardProps) {
  const progressPercentage = (currentAmount / targetAmount) * 100;
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const gradientAnimation = useRef(new Animated.Value(0)).current;
  
  const formattedCurrent = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(currentAmount);
  
  const formattedTarget = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(targetAmount);

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: Math.min(Math.max(progressPercentage, 0), 100),
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [progressPercentage, animatedWidth]);

  useEffect(() => {
    const animateGradient = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(gradientAnimation, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false,
          }),
          Animated.timing(gradientAnimation, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };
    
    animateGradient();
  }, [gradientAnimation]);

  const progressInfo = (() => {
    if (currentAmount < 100000) {
      return { message: 'You are broke, work harder.', bg: AppColors.primary[100], text: AppColors.gray[500] };
    }
    if (currentAmount < 500000) {
      return { message: 'Not bad, keep going.', bg: AppColors.primary[100], text: AppColors.primary[300] };
    }
    if (currentAmount < 750000) {
      return { message: 'Great progress.', bg: AppColors.primary[100], text: AppColors.primary[300] };
    }
    if (currentAmount < 1000000) {
      return { message: 'Almost there!', bg:  AppColors.primary[100], text: AppColors.primary[300] };
    }
    return { message: 'Goal reached!', bg: AppColors.primary[300], text: AppColors.gray[0] };
  })();

  return (
    <View style={{
      backgroundColor: AppColors.gray[0],
      borderRadius: radii.md,
      padding: spacing.md,
      marginHorizontal: spacing.md,
      marginBottom: spacing.md,
      ...cardShadow,
    }}>
      <View style={{ alignItems: 'flex-start' }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          marginBottom: spacing.md,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: scale(4) }}>
            <ThemedText style={{ fontSize: scale(24), fontWeight: '700', color: AppColors.gray[500] }}>{formattedCurrent}</ThemedText>
          </View>
          
          <View style={{ backgroundColor: progressInfo.bg, paddingVertical: scale(6), paddingHorizontal: scale(10), borderRadius: radii.md }}>
            <ThemedText style={{ fontSize: scale(12), fontWeight: '600', color: progressInfo.text }}>{progressInfo.message}</ThemedText>
          </View>
        </View>
        
        <View style={{
          width: '100%',
          height: scale(18),
          marginBottom: scale(6),
          borderRadius: scale(5),
          backgroundColor: AppColors.gray[200],
          overflow: 'hidden',
        }}>
          <Animated.View style={{ 
            width: animatedWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
            height: '100%',
            overflow: 'hidden',
            borderRadius: scale(5),
          }}>
            <Animated.View style={{
              width: '200%',
              height: '100%',
              transform: [{ translateX: gradientAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, -100] }) }]
            }}>
              <LinearGradient
                colors={['#D9CCFF', '#936DFF', '#D9CCFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ width: '100%', height: '100%' }}
              />
            </Animated.View>
          </Animated.View>
        </View>
        
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
          <ThemedText style={{ fontSize: scale(10), color: AppColors.gray[400] }}>0</ThemedText>
          <ThemedText style={{ fontSize: scale(10), color: AppColors.gray[400] }}>$1,000,000</ThemedText>
        </View>
      </View>
    </View>
  );
} 