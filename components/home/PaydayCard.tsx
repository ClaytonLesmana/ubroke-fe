import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';

interface IncomeSource {
  name: string;
  amount: number;
  payday: string;
}

interface PaydayCardProps {
  totalAmount: number;
  incomeSources: IncomeSource[];
  onAddIncome?: () => void;
  onUpdateIncome?: (index: number) => void;
}

export function PaydayCard({ 
  totalAmount, 
  incomeSources, 
  onAddIncome, 
  onUpdateIncome 
}: PaydayCardProps) {
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
        <ThemedText style={styles.cardTitle}>Total Next Payday</ThemedText>
        <TouchableOpacity onPress={onAddIncome}>
          <ThemedText style={styles.linkText}>+ Add Income</ThemedText>
        </TouchableOpacity>
      </View>
      <ThemedText style={styles.paydayTotal}>{formatCurrency(totalAmount)}</ThemedText>
      <View style={styles.incomeList}>
        {incomeSources.map((source, index) => (
          <View key={index} style={styles.incomeItem}>
            <View style={styles.incomeInfo}>
              <ThemedText style={styles.incomeName}>{source.name}</ThemedText>
              <ThemedText style={styles.incomeDate}>Payday: {source.payday}</ThemedText>
            </View>
            <View style={styles.incomeAmount}>
              <ThemedText style={styles.incomeValue}>{formatCurrency(source.amount)}</ThemedText>
              <TouchableOpacity onPress={() => onUpdateIncome?.(index)}>
                <ThemedText style={styles.updateLink}>+ Update</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
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
  paydayTotal: {
    fontSize: 32,
    fontWeight: '700',
    color: AppColors.gray[500],
    textAlign: 'center',
    marginBottom: 16,
  },
  incomeList: {
    gap: 12,
  },
  incomeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  incomeInfo: {
    flex: 1,
  },
  incomeName: {
    fontSize: 14,
    color: AppColors.gray[500],
    marginBottom: 2,
  },
  incomeDate: {
    fontSize: 12,
    color: AppColors.gray[400],
  },
  incomeAmount: {
    alignItems: 'flex-end',
  },
  incomeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.gray[500],
    marginBottom: 2,
  },
  updateLink: {
    fontSize: 12,
    color: AppColors.primary[300],
  },
}); 