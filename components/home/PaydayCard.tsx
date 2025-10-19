import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';
import { scale } from '@/lib/scale';
import { spacing, radii, colors } from '@/lib/theme';
import { cardShadow } from '@/lib/shadow';

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
        }}>Total Next Payday</ThemedText>
        <TouchableOpacity onPress={onAddIncome}>
          <ThemedText style={{
            fontSize: scale(14),
            color: AppColors.primary[300],
            fontWeight: '500',
          }}>+ Add Income</ThemedText>
        </TouchableOpacity>
      </View>
      <ThemedText style={{
        fontSize: scale(32),
        fontWeight: '700',
        color: AppColors.gray[500],
        textAlign: 'left',
        marginBottom: spacing.md,
        lineHeight: scale(40),
      }}>{formatCurrency(totalAmount)}</ThemedText>
      <View style={{ gap: scale(12) }}>
        {incomeSources.map((source, index) => (
          <View key={index} style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <View style={{ flex: 1 }}>
              <ThemedText style={{
                fontSize: scale(14),
                color: AppColors.gray[500],
                marginBottom: scale(2),
              }}>{source.name}</ThemedText>
              <ThemedText style={{
                fontSize: scale(12),
                color: AppColors.gray[400],
              }}>Payday: {source.payday}</ThemedText>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <ThemedText style={{
                fontSize: scale(14),
                fontWeight: '600',
                color: AppColors.gray[500],
                marginBottom: scale(2),
              }}>{formatCurrency(source.amount)}</ThemedText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

 