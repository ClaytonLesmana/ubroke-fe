import React from 'react';
import { View, TouchableOpacity } from 'react-native';
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
        }}>Total Next Payday</ThemedText>
        <TouchableOpacity onPress={onAddIncome}>
          <ThemedText style={{
            fontSize: 14,
            color: AppColors.primary[300],
            fontWeight: '500',
          }}>+ Add Income</ThemedText>
        </TouchableOpacity>
      </View>
      <ThemedText style={{
        fontSize: 32,
        fontWeight: '700',
        color: AppColors.gray[500],
        textAlign: 'left',
        marginBottom: 16,
        lineHeight: 40,
      }}>{formatCurrency(totalAmount)}</ThemedText>
      <View style={{
        gap: 12,
      }}>
        {incomeSources.map((source, index) => (
          <View key={index} style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <View style={{
              flex: 1,
            }}>
              <ThemedText style={{
                fontSize: 14,
                color: AppColors.gray[500],
                marginBottom: 2,
              }}>{source.name}</ThemedText>
              <ThemedText style={{
                fontSize: 12,
                color: AppColors.gray[400],
              }}>Payday: {source.payday}</ThemedText>
            </View>
            <View style={{
              alignItems: 'flex-end',
            }}>
              <ThemedText style={{
                fontSize: 14,
                fontWeight: '600',
                color: AppColors.gray[500],
                marginBottom: 2,
              }}>{formatCurrency(source.amount)}</ThemedText>
              {/* <TouchableOpacity onPress={() => onUpdateIncome?.(index)}>
                <ThemedText style={{
                  fontSize: 12,
                  color: AppColors.primary[300],
                }}>+ Update</ThemedText>
              </TouchableOpacity> */}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

 