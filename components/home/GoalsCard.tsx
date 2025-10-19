import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';
import { scale } from '@/lib/scale';
import { spacing, radii, colors } from '@/lib/theme';
import { cardShadow } from '@/lib/shadow';

interface Goal {
  name: string;
  current: number;
  target: number;
}

interface GoalsCardProps {
  goals: Goal[];
  onAddGoals?: () => void;
}

export function GoalsCard({ goals, onAddGoals }: GoalsCardProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <View style={{
      backgroundColor: AppColors.gray[0],
      borderRadius: radii.md,
      padding: spacing.md,
      marginHorizontal: spacing.md,
      marginBottom: spacing.md,
      ...cardShadow,
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
      }}>
        <ThemedText style={{
          fontSize: scale(18),
          fontWeight: '600',
          color: AppColors.gray[500],
        }}>Goals</ThemedText>
        <TouchableOpacity onPress={onAddGoals}>
          <ThemedText style={{
            fontSize: scale(14),
            color: AppColors.primary[300],
            fontWeight: '500',
          }}>+ Add Goals</ThemedText>
        </TouchableOpacity>
      </View>
      <View style={{ marginBottom: spacing.md }}>
        {goals.map((goal, index) => {
          const progressPercentage = (goal.current / goal.target) * 100;
          return (
            <View key={index} style={{ marginBottom: spacing.md }}>
              <ThemedText style={{
                fontSize: scale(14),
                color: AppColors.gray[500],
                marginBottom: scale(4),
              }}>{goal.name}</ThemedText>
              <ThemedText style={{
                fontSize: scale(12),
                color: AppColors.gray[400],
                marginBottom: scale(4),
              }}>
                {formatCurrency(goal.current)}/{formatCurrency(goal.target)}
              </ThemedText>
              <View style={{
                height: scale(10),
                backgroundColor: AppColors.gray[200],
                borderRadius: scale(3),
              }}>
                <View style={{
                  height: '100%',
                  backgroundColor: AppColors.primary[300],
                  borderRadius: scale(3),
                  width: `${progressPercentage}%`,
                }} />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

 