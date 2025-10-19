import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';
import { scale } from '@/lib/scale';
import { spacing, radii, colors } from '@/lib/theme';
import { cardShadow } from '@/lib/shadow';

interface Bill {
  name: string;
  dueDate: string;
  amount: number;
}

interface BillsCardProps {
  bills: Bill[];
  onAddBills?: () => void;
}

export function BillsCard({ bills, onAddBills }: BillsCardProps) {
  const totalBills = bills.reduce((sum, bill) => sum + bill.amount, 0);

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
        <ThemedText style={styles.cardTitle}>Upcoming Bills</ThemedText>
        <TouchableOpacity onPress={onAddBills}>
          <ThemedText style={styles.linkText}>+ Add Bills</ThemedText>
        </TouchableOpacity>
      </View>
      <View style={styles.billsList}>
        {bills.map((bill, index) => (
          <View key={index} style={styles.billItem}>
            <ThemedText style={styles.billName}>{bill.name}</ThemedText>
            <ThemedText style={styles.billDate}>due {bill.dueDate}</ThemedText>
            <ThemedText style={styles.billAmount}>{formatCurrency(bill.amount)}</ThemedText>
          </View>
        ))}
      </View>
      <View style={styles.billsTotal}>
        <ThemedText style={styles.billsTotalText}>
          Total Bills: {formatCurrency(totalBills)}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.gray[0],
    borderRadius: radii.md,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    ...cardShadow,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: scale(18),
    fontWeight: '600',
    color: AppColors.gray[500],
  },
  linkText: {
    fontSize: scale(14),
    color: AppColors.primary[300],
    fontWeight: '500',
  },
  billsList: {
    marginBottom: spacing.md,
  },
  billItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(8),
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
  },
  billName: {
    fontSize: scale(14),
    color: AppColors.gray[500],
    flex: 1,
  },
  billDate: {
    fontSize: scale(12),
    color: AppColors.gray[400],
    marginRight: scale(12),
  },
  billAmount: {
    fontSize: scale(14),
    fontWeight: '600',
    color: AppColors.gray[500],
  },
  billsTotal: {
    alignItems: 'flex-end',
    marginBottom: scale(8),
  },
  billsTotalText: {
    fontSize: scale(14),
    fontWeight: '600',
    color: AppColors.gray[500],
  },
  billsMessage: {
    fontSize: scale(14),
    color: AppColors.gray[400],
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 