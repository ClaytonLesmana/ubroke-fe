import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';
import { Animated } from 'react-native';
import Svg, { Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { CategoryIcon, type CategoryType, getCategoryFromTransaction } from '@/components/CategoryIcon';

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
    const colors = [
      AppColors.primary[300],
      AppColors.green[100],
      AppColors.red[100],
      AppColors.yellow[100],
      AppColors.info,
      AppColors.warning,
    ];
    return colors[index % colors.length];
  };



    const renderCircularProgress = (budget: BudgetItem, index: number, size: number = 60) => {
    const progress = Math.min(budget.spent / budget.budget, 1);
    const strokeWidth = 4;
    const radius = (size - strokeWidth) / 2;
    
    // Create C-shaped arc (about 240 degrees instead of full 360)
    const arcAngle = 260; // degrees
    const startAngle = 140; // start at 4 o'clock position
    const endAngle = startAngle + (arcAngle * progress);
    
    // Convert angles to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    // Calculate arc path
    const largeArcFlag = Math.abs(endRad - startRad) > Math.PI ? 1 : 0;
    const x1 = size / 2 + radius * Math.cos(startRad);
    const y1 = size / 2 + radius * Math.sin(startRad);
    const x2 = size / 2 + radius * Math.cos(endRad);
    const y2 = size / 2 + radius * Math.sin(endRad);
    
    // Create arc path
    const arcPath = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;

    return (
      <View key={index} style={{
        alignItems: 'center',
        width: size + 20,
        // marginBottom: 16,
      }}>
        <View style={{
          position: 'relative',
          width: size,
          height: size,
        }}>
          <Svg width={size} height={size}>
            {/* Background arc */}
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
            {/* Progress arc */}
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
          
          {/* Center content */}
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
              size={20}
              color={getCategoryColor(index)}
            />
          </View>
        </View>
        
        {/* Category name */}
        <ThemedText style={{
          fontSize: 10,
          fontWeight: '600',
          color: AppColors.gray[500],
          textAlign: 'center',
          marginTop: 4,
          textTransform: 'uppercase',
        }}>
          {budget.name}
        </ThemedText>
        
        {/* Amount spent/budget */}
        <ThemedText style={{
          fontSize: 12,
          fontWeight: '600',
          color: AppColors.gray[400],
          textAlign: 'center',
          marginTop: 2,
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
          marginBottom: 8,
        }}>
          {rowItems.map((budget, index) => 
            renderCircularProgress(budget, i + index)
          )}
          {/* Fill empty spaces to maintain 3-column layout */}
          {Array.from({ length: itemsPerRow - rowItems.length }, (_, index) => (
            <View key={`empty-${index}`} style={{ width: 80, height: 60 }} />
          ))}
        </View>
      );
    }

    return (
      <View key={groupIndex} style={{
        marginBottom: 24,
      }}>
        {/* Frequency header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <ThemedText style={{
            fontSize: 16,
            fontWeight: '600',
            color: AppColors.gray[500],
            textTransform: 'capitalize',
          }}>
            {group.frequency}
          </ThemedText>
          <ThemedText style={{
            fontSize: 12,
            color: AppColors.gray[400],
          }}>
            {formatDaysLeft(group.daysLeft)}
          </ThemedText>
        </View>
        
        {/* Circular progress rows */}
        {rows}
      </View>
    );
  };

  return (
    <View style={{
      backgroundColor: AppColors.gray[0],
      borderRadius: 24,
      padding: 20,
      marginHorizontal: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 3,
    }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      }}>
        <ThemedText style={{
          fontSize: 18,
          fontWeight: '600',
          color: AppColors.gray[500],
        }}>Budget</ThemedText>
        <TouchableOpacity onPress={onViewBudget}>

        </TouchableOpacity>
      </View>
      
      {/* Budget Groups */}
      {budgetGroups.map((group, index) => renderBudgetGroup(group, index))}
      
      {/* Add Budget Button */}
      <TouchableOpacity 
        style={{
          backgroundColor: AppColors.primary[300],
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
          alignItems: 'center',
        }} 
        onPress={onViewBudget}
      >
        <ThemedText style={{
          color: AppColors.gray[0],
          fontSize: 14,
          fontWeight: '600',
        }}>+ Add Budget</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

 