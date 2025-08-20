import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';

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

  // Progress fun message and colors
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
      return { message: 'Almost there!', bg: AppColors.primary[200], text: AppColors.primary[300] };
    }
    return { message: 'Goal reached!', bg: AppColors.primary[300], text: AppColors.gray[0] };
  })();

  return (
    <View style={{
      backgroundColor: AppColors.gray[0],
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }}>
      <View style={{
        alignItems: 'flex-start',
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          marginBottom: 12,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            marginBottom: 4,
          }}>
            <ThemedText style={{
              fontSize: 24,
              fontWeight: '700',
              color: AppColors.gray[500],
            }}>{formattedCurrent}</ThemedText>
          </View>
          
          {/* Fun status card at top-right */}
          <View style={{
            backgroundColor: progressInfo.bg,
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 8,
          }}>
            <ThemedText style={{
              fontSize: 12,
              fontWeight: '600',
              color: progressInfo.text,
            }}>{progressInfo.message}</ThemedText>
          </View>
        </View>
        
        {/* Single continuous progress bar */}
        <View style={{
          width: '100%',
          height: 18,
          marginBottom: 6,
          borderRadius: 5,
          backgroundColor: AppColors.gray[200],
          overflow: 'hidden',
        }}>
          <View style={{ 
            width: `${Math.min(Math.max(progressPercentage, 0), 100)}%`, 
            height: '100%', 
            backgroundColor: AppColors.primary[300]
          }} />
        </View>
        
        {/* Min/Max labels */}
        <View style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          <ThemedText style={{ fontSize: 10, color: AppColors.gray[400] }}>0</ThemedText>
          <ThemedText style={{ fontSize: 10, color: AppColors.gray[400] }}>$1,000,000</ThemedText>
        </View>
      </View>
    </View>
  );
} 