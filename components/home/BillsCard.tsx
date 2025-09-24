import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';

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
  billsList: {
    marginBottom: 12,
  },
  billItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
  },
  billName: {
    fontSize: 14,
    color: AppColors.gray[500],
    flex: 1,
  },
  billDate: {
    fontSize: 12,
    color: AppColors.gray[400],
    marginRight: 12,
  },
  billAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.gray[500],
  },
  billsTotal: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  billsTotalText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.gray[500],
  },
  billsMessage: {
    fontSize: 14,
    color: AppColors.gray[400],
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 