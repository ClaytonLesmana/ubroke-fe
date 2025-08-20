import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';

interface CashflowData {
  income: number;
  expenses: number;
  left: number;
}

interface CashflowCardProps {
  data: CashflowData;
  onSeeDetails?: () => void;
}

export function CashflowCard({ data, onSeeDetails }: CashflowCardProps) {
  const maxValue = Math.max(data.income, data.expenses, data.left);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getBarHeight = (value: number) => {
    return (value / maxValue) * 80; // Max height of 80
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <ThemedText style={styles.cardTitle}>This Month Cashflow</ThemedText>
        <ThemedText style={styles.trendIcon}>📈</ThemedText>
      </View>
      <View style={styles.cashflowChart}>
        <View style={styles.cashflowBar}>
          <View style={[styles.bar, { height: getBarHeight(data.income), backgroundColor: AppColors.primary[300] }]} />
          <ThemedText style={styles.barLabel}>{formatCurrency(data.income)}</ThemedText>
          <ThemedText style={styles.barTitle}>Income</ThemedText>
        </View>
        <View style={styles.cashflowBar}>
          <View style={[styles.bar, { height: getBarHeight(data.expenses), backgroundColor: AppColors.primary[300] }]} />
          <ThemedText style={styles.barLabel}>{formatCurrency(data.expenses)}</ThemedText>
          <ThemedText style={styles.barTitle}>Expenses</ThemedText>
        </View>
        <View style={styles.cashflowBar}>
          <View style={[styles.bar, { height: getBarHeight(data.left), backgroundColor: AppColors.primary[300] }]} />
          <ThemedText style={styles.barLabel}>{formatCurrency(data.left)}</ThemedText>
          <ThemedText style={styles.barTitle}>Left</ThemedText>
        </View>
      </View>
      <TouchableOpacity style={styles.linkButton} onPress={onSeeDetails}>
        <ThemedText style={styles.linkText}>See details {'>'}</ThemedText>
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
  trendIcon: {
    fontSize: 16,
  },
  cashflowChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 100,
    marginBottom: 12,
  },
  cashflowBar: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 40,
    borderRadius: 4,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.gray[500],
    marginBottom: 2,
  },
  barTitle: {
    fontSize: 10,
    color: AppColors.gray[400],
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkText: {
    fontSize: 14,
    color: AppColors.primary[300],
    fontWeight: '500',
  },
}); 