import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';

interface SpendingCategory {
  name: string;
  amount: number;
  color: string;
}

interface SpendingCategoryCardProps {
  categories: SpendingCategory[];
  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
  onTapToDigDeeper?: () => void;
}

export function SpendingCategoryCard({
  categories,
  selectedMonth = "This month",
  onMonthChange,
  onTapToDigDeeper 
}: SpendingCategoryCardProps) {
  const totalSpending = categories.reduce((sum, category) => sum + category.amount, 0);
  const largestCategory = categories.reduce((max, category) => 
    category.amount > max.amount ? category : max, categories[0]
  );
  const largestPercentage = (largestCategory.amount / totalSpending) * 100;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <ThemedText style={styles.cardTitle}>Spending Category</ThemedText>
        <TouchableOpacity style={styles.dropdown}>
          <ThemedText style={styles.dropdownText}>{selectedMonth}</ThemedText>
          <ThemedText style={styles.dropdownArrow}>▼</ThemedText>
        </TouchableOpacity>
      </View>
      <View style={styles.donutChart}>
        <View style={styles.donutChartContainer}>
          <View style={styles.donutChartInner}>
            <ThemedText style={styles.donutChartText}>{Math.round(largestPercentage)}%</ThemedText>
              </View>
            </View>
        <View style={styles.chartLegend}>
          {categories.map((category, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: category.color }]} />
              <ThemedText style={styles.legendText}>
                {category.name} {category.amount > 0 ? `$${category.amount}` : ''}
              </ThemedText>
            </View>
          ))}
            </View>
          </View>
      <TouchableOpacity onPress={onTapToDigDeeper}>
        <ThemedText style={styles.chartPrompt}>
          Where's your cash going? Slice it up! Tap to dig deeper
        </ThemedText>
      </TouchableOpacity>
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
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dropdownText: {
    fontSize: 14,
    color: AppColors.gray[400],
  },
  dropdownArrow: {
    fontSize: 12,
    color: AppColors.gray[400],
  },
  donutChart: {
    alignItems: 'center',
    marginBottom: 12,
  },
  donutChartContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: AppColors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  donutChartInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppColors.gray[0],
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutChartText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.gray[500],
  },
  chartLegend: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: AppColors.gray[400],
  },
  chartPrompt: {
    fontSize: 14,
    color: AppColors.gray[400],
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
