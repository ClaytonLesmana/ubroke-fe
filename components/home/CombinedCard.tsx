import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Image, Animated, Easing } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';
import { SpendingCategoryCard } from './SpendingCategoryCard';
import { CashflowCard } from './CashflowCard';
import { MonthSlider } from './MonthSlider';

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
  const [viewMode, setViewMode] = useState<'spending' | 'cashflow'>('spending');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownAnimation = useRef(new Animated.Value(0)).current;

  // Dropdown animation
  useEffect(() => {
    Animated.timing(dropdownAnimation, {
      toValue: isDropdownOpen ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [isDropdownOpen]);

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
      {/* Month Slider */}
      <MonthSlider 
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={onMonthChange}
      />

      {/* Content container with corner dropdown pinned inside inner card */}
      <View style={{ position: 'relative' }}>
        {/* Corner pill dropdown (inside child card padding area) */}
        <TouchableOpacity
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{
            position: 'absolute',
            top: 10,
            left: 4,
            zIndex: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 12,
            paddingVertical: 5,
            backgroundColor: AppColors.primary[100],
            borderRadius: 35,
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 2 },
            // shadowOpacity: 0.12,
            // shadowRadius: 6,
            // elevation: 3,
          }}
        >
          <ThemedText style={{
            fontSize: 12,
            color: AppColors.gray[500],
            letterSpacing: 0.5,
          }}>
            {viewMode === 'spending' ? 'EXPENSES' : 'CASHFLOW'}
          </ThemedText>
          <Image 
            source={require('@/assets/images/dropDown.png')} 
            style={{ width: 12, height: 12, tintColor: AppColors.gray[500], transform: [{ rotate: isDropdownOpen ? '180deg' : '0deg' }] }}
          />
        </TouchableOpacity>

        {/* Dropdown menu */}
        <Animated.View style={{
          position: 'absolute',
          top: 52,
          left: 4,
          zIndex: 9,
          width: 200,
          maxHeight: dropdownAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, 120] }),
          overflow: 'hidden',
          borderRadius: 12,
          backgroundColor: AppColors.gray[100],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 8,
          elevation: 4,
        }}>
          <TouchableOpacity
            onPress={() => { setViewMode('spending'); setIsDropdownOpen(false); }}
            style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: viewMode === 'spending' ? AppColors.primary[100] : 'transparent' }}
          >
            <ThemedText style={{ fontSize: 14, color: viewMode === 'spending' ? AppColors.primary[300] : AppColors.gray[500], fontWeight: viewMode === 'spending' ? '600' : '400' }}>
              Spending Categories
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { setViewMode('cashflow'); setIsDropdownOpen(false); }}
            style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: viewMode === 'cashflow' ? AppColors.primary[100] : 'transparent' }}
          >
            <ThemedText style={{ fontSize: 14, color: viewMode === 'cashflow' ? AppColors.primary[300] : AppColors.gray[500], fontWeight: viewMode === 'cashflow' ? '600' : '400' }}>
              Cashflow
            </ThemedText>
          </TouchableOpacity>
        </Animated.View>

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