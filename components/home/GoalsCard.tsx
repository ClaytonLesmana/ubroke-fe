import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
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
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <ThemedText style={styles.cardTitle}>Goals</ThemedText>
        <TouchableOpacity onPress={onAddGoals}>
          <ThemedText style={styles.linkText}>+ Add Goals</ThemedText>
        </TouchableOpacity>
      </View>
      <View style={styles.goalsList}>
        {goals.map((goal, index) => {
          const progressPercentage = (goal.current / goal.target) * 100;
          return (
            <View key={index} style={styles.goalItem}>
              <ThemedText style={styles.goalName}>{goal.name}</ThemedText>
              <ThemedText style={styles.goalAmount}>
                {formatCurrency(goal.current)}/{formatCurrency(goal.target)}
              </ThemedText>
              <View style={styles.goalProgressBar}>
                <View style={[styles.goalProgressFill, { width: `${progressPercentage}%` }]} />
              </View>
            </View>
          );
        })}
      </View>
      <ThemedText style={styles.goalsMessage}>Slay your savings goals! What's next?</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.gray[500],
  },
  linkText: {
    fontSize: 14,
    color: AppColors.primary[300],
    fontWeight: '500',
  },
  goalsList: {
    marginBottom: 12,
  },
  goalItem: {
    marginBottom: 12,
  },
  goalName: {
    fontSize: 14,
    color: AppColors.gray[500],
    marginBottom: 4,
  },
  goalAmount: {
    fontSize: 12,
    color: AppColors.gray[400],
    marginBottom: 4,
  },
  goalProgressBar: {
    height: 6,
    backgroundColor: AppColors.gray[200],
    borderRadius: 3,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: AppColors.primary[300],
    borderRadius: 3,
  },
  goalsMessage: {
    fontSize: 14,
    color: AppColors.gray[400],
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 