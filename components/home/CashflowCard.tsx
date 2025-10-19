import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Icon } from '@/components/Icon';
import Svg, { Line } from 'react-native-svg';
import { scale } from '@/lib/scale';
import { spacing, radii, colors } from '@/lib/theme';
import { cardShadow } from '@/lib/shadow';

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
  const maxValue = Math.max(data.income, data.expenses, data.left) || 1;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const chartHeight = scale(100);
  const gridY = [0, 20, 40, 60, 80];
  const getBarHeight = (value: number) => (value / maxValue) * scale(80);

  return (
    <View style={{
      backgroundColor: AppColors.gray[0],
      borderRadius: radii.lg,
      padding: spacing.lg,
      paddingTop: scale(105),
      marginHorizontal: -scale(8),
      marginBottom: spacing.md,
      ...cardShadow,
    }}>
      {/* Chart area with dashed grid lines */}
      <View style={{
        position: 'relative',
        height: chartHeight,
        marginBottom: spacing.sm,
      }}>
        {/* SVG Grid Lines */}
        <Svg 
          width="100%" 
          height={String(chartHeight)} 
          style={{ position: 'absolute', top: -scale(37), left: 0, right: 0 }}
        >
          {/* Equally spaced dashed grid lines */}
          {gridY.map((y, index) => (
            <Line
              key={index}
              x1="0"
              y1={scale(y)}
              x2="100%"
              y2={scale(y)}
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
          height: chartHeight,
        }}>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <View style={{
              width: scale(40),
              height: getBarHeight(data.income),
              borderRadius: scale(4),
              marginBottom: scale(4),
              backgroundColor: AppColors.primary[300],
            }} />
            <ThemedText style={{
              fontSize: scale(12),
              fontWeight: '600',
              color: AppColors.gray[500],
              marginBottom: scale(2),
            }}>
              {formatCurrency(data.income)}
            </ThemedText>
            <ThemedText style={{ fontSize: scale(10), color: AppColors.gray[400] }}>Income</ThemedText>
          </View>

          <View style={{ alignItems: 'center', flex: 1 }}>
            <View style={{
              width: scale(40),
              height: getBarHeight(data.expenses),
              borderRadius: scale(4),
              marginBottom: scale(4),
              backgroundColor: AppColors.primary[300],
            }} />
            <ThemedText style={{
              fontSize: scale(12),
              fontWeight: '600',
              color: AppColors.gray[500],
              marginBottom: scale(2),
            }}>
              {formatCurrency(data.expenses)}
            </ThemedText>
            <ThemedText style={{ fontSize: scale(10), color: AppColors.gray[400] }}>Expenses</ThemedText>
          </View>

          <View style={{ alignItems: 'center', flex: 1 }}>
            <View style={{
              width: scale(40),
              height: getBarHeight(data.left),
              borderRadius: scale(4),
              marginBottom: scale(4),
              backgroundColor: AppColors.primary[300],
            }} />
            <ThemedText style={{
              fontSize: scale(12),
              fontWeight: '600',
              color: AppColors.gray[500],
              marginBottom: scale(2),
            }}>
              {formatCurrency(data.left)}
            </ThemedText>
            <ThemedText style={{ fontSize: scale(10), color: AppColors.gray[400] }}>Left</ThemedText>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={{ flexDirection: 'row', alignItems: 'center', gap: scale(4) }} 
        onPress={onSeeDetails}
      >
        <ThemedText style={{ fontSize: scale(14), color: AppColors.primary[300],marginRight: scale(4), fontWeight: '500' }}>See details</ThemedText>
        <Icon name="rightArrow" size={scale(6)}  color={AppColors.primary[300]} />
      </TouchableOpacity>
    </View>
  );
} 