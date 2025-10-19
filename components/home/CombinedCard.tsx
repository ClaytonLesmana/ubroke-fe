import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Icon } from '@/components/Icon';
import { AppColors } from '@/constants/Colors';
import { SpendingCategoryCard } from './SpendingCategoryCard';
import { CashflowCard } from './CashflowCard';
import { MonthSlider } from './MonthSlider';
import { useRouter } from 'expo-router';
import Svg, { Rect, Line } from 'react-native-svg';
import { scale } from '@/lib/scale';
import { spacing, radii, colors } from '@/lib/theme';
import { cardShadow } from '@/lib/shadow';

interface SpendingCategory {
  name: string;
  amount: number;
  color: string;
  categoryId?: string;
  percentage?: number;
  transactions?: number;
}

interface CashflowData {
  income: number;
  expenses: number;
  left: number;
}

interface CombinedCardProps {
  spendingCategories: SpendingCategory[];
  cashflowData: CashflowData;
  selectedMonth?: string;
  selectedYear?: string;
  transactionCount?: number;
  onMonthChange?: (month: string, year: string) => void;
  onTapToDigDeeper?: () => void;
  onSeeCashflowDetails?: () => void;
}

export function CombinedCard({
  spendingCategories,
  cashflowData,
  selectedMonth = "August",
  selectedYear = "2025",
  transactionCount = 5,
  onMonthChange,
  onTapToDigDeeper,
  onSeeCashflowDetails
}: CombinedCardProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'spending' | 'cashflow'>('spending');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <View style={{
      backgroundColor: AppColors.gray[0],
      borderRadius: radii.lg,
      padding: spacing.lg,
      marginHorizontal: spacing.md,
      marginBottom: spacing.md,
      ...cardShadow,
    }}>
      {/* Month Slider */}
      <MonthSlider 
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={onMonthChange}
      />

      {/* Content container with corner dropdown pinned inside inner card */}
      <View style={{ position: 'relative' }}>
        {/* Dropdown trigger button */}
        <TouchableOpacity
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{
            position: 'absolute',
            top: scale(10),
            left: scale(4),
            zIndex: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: AppColors.gray[0],
            borderWidth: 1,
            borderColor: AppColors.gray[200],
            paddingHorizontal: spacing.md,
            paddingVertical: scale(8),
            borderRadius: radii.md,
            minWidth: scale(140),
            ...cardShadow,
          }}
        >
          <ThemedText style={{
            fontSize: scale(14),
            color: AppColors.gray[500]
          }}>
            {viewMode === 'spending' ? 'Expenses' : viewMode === 'cashflow' ? 'Cashflow' : 'Net'}
          </ThemedText>
          <Icon name={isDropdownOpen ? "upIcon" : "downIcon"} size={scale(15)} color={AppColors.gray[400]} />
        </TouchableOpacity>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <View style={{
            position: 'absolute',
            top: scale(52),
            left: scale(4),
            right: 0,
            width: scale(138),
            backgroundColor: AppColors.gray[0],
            borderRadius: radii.md,
            marginTop: scale(4),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            zIndex: 1000
          }}>
            <TouchableOpacity
              onPress={() => { setViewMode('spending'); setIsDropdownOpen(false); }}
              style={{ 
                paddingHorizontal: spacing.md, 
                paddingVertical: scale(10), 
                borderBottomWidth: 1,
                borderBottomColor: AppColors.gray[100]
              }}
            >
              <ThemedText style={{ 
                fontSize: scale(14), 
                color: viewMode === 'spending' ? AppColors.primary[300] : AppColors.gray[500], 
                fontWeight: viewMode === 'spending' ? '600' : '400' 
              }}>
                Expenses
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setViewMode('cashflow'); setIsDropdownOpen(false); }}
              style={{ 
                paddingHorizontal: spacing.md, 
                paddingVertical: scale(10),
                borderBottomWidth: 1,
                borderBottomColor: AppColors.gray[100]
              }}
            >
              <ThemedText style={{ 
                fontSize: scale(14), 
                color: viewMode === 'cashflow' ? AppColors.primary[300] : AppColors.gray[500], 
                fontWeight: viewMode === 'cashflow' ? '600' : '400' 
              }}>
                Cashflow
              </ThemedText>
            </TouchableOpacity>

          </View>
        )}

        {/* Content (no extra padding; pill sits within inner card area) */}
        <View>
          {viewMode === 'spending' ? (
            <SpendingCategoryCard 
              categories={spendingCategories}
              onTapToDigDeeper={onTapToDigDeeper}
            />
          ) : (
            <CashflowCard 
              data={cashflowData}
              onSeeDetails={onSeeCashflowDetails}
            />
          )}
        </View>
      </View>
    </View>
  );
} 