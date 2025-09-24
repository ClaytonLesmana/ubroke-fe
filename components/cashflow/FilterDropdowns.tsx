import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Icon } from '@/components/Icon';
import { AppColors } from '@/constants/Colors';

interface FilterDropdownsProps {
  selectedTransaction: string;
  setSelectedTransaction: (value: string) => void;
  isTransactionDropdownVisible: boolean;
  setIsTransactionDropdownVisible: (value: boolean) => void;
  selectedMonth: string;
  isMonthDropdownVisible: boolean;
  setIsMonthDropdownVisible: (value: boolean) => void;
  transactionOptions: string[];
  months: string[];
  years: number[];
  selectedMonthName: string;
  setSelectedMonthName: (value: string) => void;
  selectedYear: number;
  setSelectedYear: (value: number) => void;
}

export function FilterDropdowns({
  selectedTransaction,
  setSelectedTransaction,
  isTransactionDropdownVisible,
  setIsTransactionDropdownVisible,
  selectedMonth,
  isMonthDropdownVisible,
  setIsMonthDropdownVisible,
  transactionOptions,
  months,
  years,
  selectedMonthName,
  setSelectedMonthName,
  selectedYear,
  setSelectedYear
}: FilterDropdownsProps) {
  return (
    <View style={{
      position: 'relative',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      gap: 12
    }}>
      <View style={{ flex: 1, position: 'relative' }}>
        <TouchableOpacity style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: AppColors.gray[0],
          borderWidth: 1,
          borderColor: AppColors.gray[200],
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 8
        }} onPress={() => setIsTransactionDropdownVisible(!isTransactionDropdownVisible)}>
          <ThemedText style={{
            fontSize: 14,
            color: AppColors.gray[500]
          }}>
            {selectedTransaction}
          </ThemedText>
          <Icon name={isTransactionDropdownVisible ? "upIcon" : "downIcon"} size={15} color={AppColors.gray[400]} />
        </TouchableOpacity>
        
        {/* Transaction Dropdown */}
        {isTransactionDropdownVisible && (
          <View style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: AppColors.gray[0],
            borderRadius: 8,
            marginTop: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            zIndex: 1000
          }}>
            {transactionOptions.map((option, index) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setSelectedTransaction(option);
                  setIsTransactionDropdownVisible(false);
                }}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderBottomWidth: index < transactionOptions.length - 1 ? 1 : 0,
                  borderBottomColor: AppColors.gray[100]
                }}
              >
                <ThemedText style={{
                  fontSize: 14,
                  color: selectedTransaction === option ? AppColors.primary[300] : AppColors.gray[500],
                  fontWeight: selectedTransaction === option ? '600' : '400'
                }}>
                  {option}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={{ flex: 1, position: 'relative' }}>
        <TouchableOpacity style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: AppColors.gray[0],
          borderWidth: 1,
          borderColor: AppColors.gray[200],
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 8
        }} onPress={() => setIsMonthDropdownVisible(!isMonthDropdownVisible)}>
          <ThemedText style={{
            fontSize: 14,
            color: AppColors.gray[500]
          }}>
            {selectedMonth}
          </ThemedText>
          <Icon name={isMonthDropdownVisible ? "upIcon" : "downIcon"} size={15} color={AppColors.gray[400]} />
        </TouchableOpacity>
        
        {/* Month Dropdown */}
        {isMonthDropdownVisible && (
          <View style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: AppColors.gray[0],
            borderRadius: 8,
            marginTop: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            zIndex: 999,
            maxHeight: 200,
            flexDirection: 'row'
          }}>
            {/* Months Column */}
            <View style={{ flex: 1.5, borderRightWidth: 1, borderRightColor: AppColors.gray[100] }}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {months.map((month, index) => (
                  <TouchableOpacity
                    key={month}
                    onPress={() => setSelectedMonthName(month)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderBottomWidth: index < months.length - 1 ? 1 : 0,
                      borderBottomColor: AppColors.gray[100]
                    }}
                  >
                    <ThemedText style={{
                      fontSize: 12,
                      color: selectedMonthName === month ? AppColors.primary[300] : AppColors.gray[500],
                      fontWeight: selectedMonthName === month ? '600' : '400'
                    }}>
                      {month}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            {/* Years Column */}
            <View style={{ flex: 1 }}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {years.map((year, index) => (
                  <TouchableOpacity
                    key={year}
                    onPress={() => setSelectedYear(year)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderBottomWidth: index < years.length - 1 ? 1 : 0,
                      borderBottomColor: AppColors.gray[100]
                    }}
                  >
                    <ThemedText style={{
                      fontSize: 14,
                      color: selectedYear === year ? AppColors.primary[300] : AppColors.gray[500],
                      fontWeight: selectedYear === year ? '600' : '400',
                      textAlign: 'center'
                    }}>
                      {year}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    </View>
  );
} 