import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Icon } from '@/components/Icon';
import Svg, { Line } from 'react-native-svg';

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
  const router = useRouter();
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
      {/* Chart area with dashed grid lines */}
      <View style={{
        position: 'relative',
        height: 100,
        marginBottom: 12,
      }}>
        {/* SVG Grid Lines */}
        <Svg 
          width="100%" 
          height="100" 
          style={{ position: 'absolute', top: -37, left: 0, right: 0 }}
        >
          {/* Equally spaced dashed grid lines */}
          {[0, 20, 40, 60, 80].map((y, index) => (
            <Line
              key={index}
              x1="0"
              y1={y}
              x2="100%"
              y2={y}
              stroke={AppColors.gray[200]}
              strokeWidth="1"
              strokeDasharray="3,3"
            />
          ))}
        </Svg>

        {/* Bars container */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
          height: 100,
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
      </View>

      <TouchableOpacity 
        style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }} 
        onPress={onSeeDetails}
      >
        <ThemedText style={{ fontSize: 14, color: AppColors.primary[300],marginRight: 4, fontWeight: '500' }}>See details</ThemedText>
        <Icon name="rightArrow" size={6}  color={AppColors.primary[300]} />
      </TouchableOpacity>
    </View>
  );
} 