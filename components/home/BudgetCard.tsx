import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';
import { Animated } from 'react-native';
import Svg, { Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { CategoryIcon, type CategoryType, getCategoryFromTransaction } from '@/components/CategoryIcon';
import { scale } from '@/lib/scale';
import { spacing, radii, colors } from '@/lib/theme';
import { cardShadow } from '@/lib/shadow';

interface BudgetItem {
  name: string;
  spent: number;
  budget: number;
  icon: string;
  category: CategoryType;
  frequency: 'weekly' | 'fortnightly' | 'monthly';
}

interface BudgetGroup {
  frequency: 'weekly' | 'fortnightly' | 'monthly';
  daysLeft: number;
  budgets: BudgetItem[];
}

interface BudgetCardProps {
  budgetGroups: BudgetGroup[];
  onViewBudget: () => void;
}

export function BudgetCard({ budgetGroups, onViewBudget }: BudgetCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDaysLeft = (days: number) => {
    if (days === 1) return '1 day left';
    return `${days} days left`;
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'weekly':
        return AppColors.primary[300];
      case 'fortnightly':
        return AppColors.green[100];
      case 'monthly':
        return AppColors.info;
      default:
        return AppColors.gray[300];
    }
  };

  const getCategoryColor = (index: number) => {
    const colorsArr = [
      AppColors.primary[300],
      AppColors.green[100],
      AppColors.red[100],
      AppColors.yellow[100],
      AppColors.info,
      AppColors.warning,
    ];
    return colorsArr[index % colorsArr.length];
  };

  const renderCircularProgress = (budget: BudgetItem, index: number, size: number = scale(60)) => {
    const progress = Math.min(budget.spent / budget.budget, 1);
    const strokeWidth = scale(4);
    const radius = (size - strokeWidth) / 2;

    const arcAngle = 260;
    const startAngle = 140;
    const endAngle = startAngle + (arcAngle * progress);

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const largeArcFlag = Math.abs(endRad - startRad) > Math.PI ? 1 : 0;
    const x1 = size / 2 + radius * Math.cos(startRad);
    const y1 = size / 2 + radius * Math.sin(startRad);
    const x2 = size / 2 + radius * Math.cos(endRad);
    const y2 = size / 2 + radius * Math.sin(endRad);

    const arcPath = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;

    return (
      <View key={index} style={{
        alignItems: 'center',
        width: size + scale(20),
      }}>
        <View style={{ position: 'relative', width: size, height: size }}>
          <Svg width={size} height={size}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={AppColors.gray[200]}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${(2 * Math.PI * radius * arcAngle) / 360} ${2 * Math.PI * radius}`}
              strokeDashoffset={0}
              transform={`rotate(${startAngle} ${size / 2} ${size / 2})`}
            />
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={getCategoryColor(index)}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${(2 * Math.PI * radius * arcAngle * progress) / 360} ${2 * Math.PI * radius}`}
              strokeDashoffset={0}
              transform={`rotate(${startAngle} ${size / 2} ${size / 2})`}
              strokeLinecap="round"
            />
          </Svg>

          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <CategoryIcon 
              category={budget.category || getCategoryFromTransaction(budget.name)}
              size={scale(20)}
              color={getCategoryColor(index)}
            />
          </View>
        </View>

        <ThemedText style={{
          fontSize: scale(10),
          fontWeight: '600',
          color: AppColors.gray[500],
          textAlign: 'center',
          marginTop: scale(4),
          textTransform: 'uppercase',
        }}>
          {budget.name}
        </ThemedText>

        <ThemedText style={{
          fontSize: scale(12),
          fontWeight: '600',
          color: AppColors.gray[400],
          textAlign: 'center',
          marginTop: scale(2),
        }}>
          {formatCurrency(budget.spent)}/{formatCurrency(budget.budget)}
        </ThemedText>
      </View>
    );
  };

  const renderBudgetGroup = (group: BudgetGroup, groupIndex: number) => {
    const itemsPerRow = 3;
    const rows = [];

    for (let i = 0; i < group.budgets.length; i += itemsPerRow) {
      const rowItems = group.budgets.slice(i, i + itemsPerRow);
      rows.push(
        <View key={i} style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginBottom: scale(8),
        }}>
          {rowItems.map((budget, index) => 
            renderCircularProgress(budget, i + index)
          )}
          {Array.from({ length: itemsPerRow - rowItems.length }, (_, index) => (
            <View key={`empty-${index}`} style={{ width: scale(80), height: scale(60) }} />
          ))}
        </View>
      );
    }

    return (
      <View key={groupIndex} style={{ marginBottom: scale(24) }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: scale(16),
        }}>
          <ThemedText style={{
            fontSize: scale(16),
            fontWeight: '600',
            color: AppColors.gray[500],
            textTransform: 'capitalize',
          }}>
            {group.frequency}
          </ThemedText>
          <ThemedText style={{ fontSize: scale(12), color: AppColors.gray[400] }}>
            {formatDaysLeft(group.daysLeft)}
          </ThemedText>
        </View>

        {rows}
      </View>
    );
  };

  return (
    <View style={{
      backgroundColor: AppColors.gray[0],
      borderRadius: radii.lg,
      padding: spacing.lg,
      marginHorizontal: spacing.md,
      marginBottom: spacing.md,
      ...cardShadow,
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
      }}>
        <ThemedText style={{
          fontSize: scale(18),
          fontWeight: '600',
          color: AppColors.gray[500],
        }}>Budget</ThemedText>
        <TouchableOpacity onPress={onViewBudget}>
        </TouchableOpacity>
      </View>

      {budgetGroups.map((group, index) => renderBudgetGroup(group, index))}

      <TouchableOpacity 
        style={{
          backgroundColor: AppColors.primary[300],
          paddingVertical: scale(12),
          paddingHorizontal: scale(24),
          borderRadius: radii.md,
          alignItems: 'center',
          ...cardShadow,
        }} 
        onPress={onViewBudget}
      >
        <ThemedText style={{
          color: AppColors.gray[0],
          fontSize: scale(14),
          fontWeight: '600',
        }}>+ Add Budget</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

 