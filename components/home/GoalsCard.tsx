import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';

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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <ThemedText style={{
          fontSize: 18,
          fontWeight: '600',
          color: AppColors.gray[500],
        }}>Goals</ThemedText>
        <TouchableOpacity onPress={onAddGoals}>
          <ThemedText style={{
            fontSize: 14,
            color: AppColors.primary[300],
            fontWeight: '500',
          }}>+ Add Goals</ThemedText>
        </TouchableOpacity>
      </View>
      <View style={{
        marginBottom: 12,
      }}>
        {goals.map((goal, index) => {
          const progressPercentage = (goal.current / goal.target) * 100;
          return (
            <View key={index} style={{
              marginBottom: 12,
            }}>
              <ThemedText style={{
                fontSize: 14,
                color: AppColors.gray[500],
                marginBottom: 4,
              }}>{goal.name}</ThemedText>
              <ThemedText style={{
                fontSize: 12,
                color: AppColors.gray[400],
                marginBottom: 4,
              }}>
                {formatCurrency(goal.current)}/{formatCurrency(goal.target)}
              </ThemedText>
              <View style={{
                height: 10,
                backgroundColor: AppColors.gray[200],
                borderRadius: 3,
              }}>
                <View style={{
                  height: '100%',
                  backgroundColor: AppColors.primary[300],
                  borderRadius: 3,
                  width: `${progressPercentage}%`,
                }} />
              </View>
            </View>
          );
        })}
      </View>
      {/* <ThemedText style={{
        fontSize: 14,
        color: AppColors.gray[400],
        textAlign: 'center',
        fontStyle: 'italic',
      }}>Slay your savings goals! What's next?</ThemedText> */}
    </View>
  );
}

 