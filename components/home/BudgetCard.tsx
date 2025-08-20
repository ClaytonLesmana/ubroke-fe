import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';

interface BudgetItem {
  name: string;
  spent: number;
  budget: number;
  icon: string;
}

interface BudgetCardProps {
  daysLeft: number;
  title: string;
  budgetItem: BudgetItem;
  onViewBudget?: () => void;
}

export function BudgetCard({ 
  daysLeft, 
  title, 
  budgetItem, 
  onViewBudget 
}: BudgetCardProps) {
  const progressPercentage = (budgetItem.spent / budgetItem.budget) * 100;
  const remaining = budgetItem.budget - budgetItem.spent;

  const formatCurrency = (amount: number) => {
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
        <ThemedText style={styles.cardTitle}>Budget</ThemedText>
        <ThemedText style={styles.budgetCount}>1 active budget</ThemedText>
      </View>
      <View style={styles.budgetContent}>
        <ThemedText style={styles.budgetDays}>{daysLeft} Days</ThemedText>
        <ThemedText style={styles.budgetTitle}>{title}</ThemedText>
        <View style={styles.budgetItem}>
          <View style={styles.budgetItemHeader}>
            <ThemedText style={styles.budgetIcon}>{budgetItem.icon}</ThemedText>
            <ThemedText style={styles.budgetItemName}>{budgetItem.name}</ThemedText>
          </View>
          <View style={styles.budgetProgress}>
            <ThemedText style={styles.budgetSpent}>
              {formatCurrency(budgetItem.spent)} spent of {formatCurrency(budgetItem.budget)}
            </ThemedText>
            <View style={styles.budgetProgressBar}>
              <View style={[styles.budgetProgressFill, { width: `${progressPercentage}%` }]} />
            </View>
          </View>
          <ThemedText style={styles.budgetRemaining}>
            {formatCurrency(remaining)} Remaining
          </ThemedText>
        </View>
      </View>
      <TouchableOpacity style={styles.purpleButton} onPress={onViewBudget}>
        <ThemedText style={styles.purpleButtonText}>View Budget</ThemedText>
      </TouchableOpacity>
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
  budgetCount: {
    fontSize: 12,
    color: AppColors.gray[400],
  },
  budgetContent: {
    marginBottom: 16,
  },
  budgetDays: {
    fontSize: 14,
    color: AppColors.gray[400],
    marginBottom: 4,
  },
  budgetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.gray[500],
    marginBottom: 12,
  },
  budgetItem: {
    marginBottom: 12,
  },
  budgetItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  budgetItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.gray[500],
  },
  budgetProgress: {
    marginBottom: 8,
  },
  budgetSpent: {
    fontSize: 12,
    color: AppColors.gray[400],
    marginBottom: 4,
  },
  budgetProgressBar: {
    height: 6,
    backgroundColor: AppColors.gray[200],
    borderRadius: 3,
  },
  budgetProgressFill: {
    height: '100%',
    backgroundColor: AppColors.primary[300],
    borderRadius: 3,
  },
  budgetRemaining: {
    fontSize: 12,
    color: AppColors.gray[400],
  },
  purpleButton: {
    backgroundColor: AppColors.primary[300],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  purpleButtonText: {
    color: AppColors.gray[0],
    fontSize: 14,
    fontWeight: '600',
  },
}); 