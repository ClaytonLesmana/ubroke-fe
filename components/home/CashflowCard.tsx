import React from 'react';
import { View, TouchableOpacity } from 'react-native';
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
    <View style={{
      backgroundColor: AppColors.gray[0],
      borderRadius: 24,
      padding: 20,
      paddingTop: 105,
      marginHorizontal: -8,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 3,
    }}>
      {/* Header removed per previous change */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 100,
        marginBottom: 12,
      }}>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <View style={{
            width: 40,
            height: getBarHeight(data.income),
            borderRadius: 4,
            marginBottom: 4,
            backgroundColor: AppColors.primary[300],
          }} />
          <ThemedText style={{
            fontSize: 12,
            fontWeight: '600',
            color: AppColors.gray[500],
            marginBottom: 2,
          }}>
            {formatCurrency(data.income)}
          </ThemedText>
          <ThemedText style={{ fontSize: 10, color: AppColors.gray[400] }}>Income</ThemedText>
        </View>

        <View style={{ alignItems: 'center', flex: 1 }}>
          <View style={{
            width: 40,
            height: getBarHeight(data.expenses),
            borderRadius: 4,
            marginBottom: 4,
            backgroundColor: AppColors.primary[300],
          }} />
          <ThemedText style={{
            fontSize: 12,
            fontWeight: '600',
            color: AppColors.gray[500],
            marginBottom: 2,
          }}>
            {formatCurrency(data.expenses)}
          </ThemedText>
          <ThemedText style={{ fontSize: 10, color: AppColors.gray[400] }}>Expenses</ThemedText>
        </View>

        <View style={{ alignItems: 'center', flex: 1 }}>
          <View style={{
            width: 40,
            height: getBarHeight(data.left),
            borderRadius: 4,
            marginBottom: 4,
            backgroundColor: AppColors.primary[300],
          }} />
          <ThemedText style={{
            fontSize: 12,
            fontWeight: '600',
            color: AppColors.gray[500],
            marginBottom: 2,
          }}>
            {formatCurrency(data.left)}
          </ThemedText>
          <ThemedText style={{ fontSize: 10, color: AppColors.gray[400] }}>Left</ThemedText>
        </View>
      </View>

      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }} onPress={onSeeDetails}>
        <ThemedText style={{ fontSize: 14, color: AppColors.primary[300], fontWeight: '500' }}>See details {'>'}</ThemedText>
      </TouchableOpacity>
    </View>
  );
} 