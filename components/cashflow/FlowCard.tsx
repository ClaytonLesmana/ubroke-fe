import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';
import { AnalysisDropdowns } from './AnalysisDropdowns';
import { FinancialAnalysisContent } from './FinancialAnalysisContent';

interface IncomeSource {
  name: string;
  amount: number;
  date: string;
  time: string;
}

interface FlowCardProps {
  selectedTab: 'In' | 'Out' | 'Net';
  incomeSources: IncomeSource[];
  expenseSources: IncomeSource[];
  networthSources: IncomeSource[];
  formatCurrency: (amount: number) => string;
  selectedDate: string | null;
  // Analysis dropdown props for Net view
  selectedAnalysis: string;
  setSelectedAnalysis: (value: string) => void;
  isAnalysisDropdownVisible: boolean;
  setIsAnalysisDropdownVisible: (value: boolean) => void;
  selectedAnalysisMonth: string;
  setSelectedAnalysisMonth: (value: string) => void;
  isAnalysisMonthDropdownVisible: boolean;
  setIsAnalysisMonthDropdownVisible: (value: boolean) => void;
  analysisOptions: string[];
  months: string[];
  years: number[];
  selectedYear: number;
}

export function FlowCard({
  selectedTab,
  incomeSources,
  expenseSources,
  networthSources,
  formatCurrency,
  selectedDate,
  selectedAnalysis,
  setSelectedAnalysis,
  isAnalysisDropdownVisible,
  setIsAnalysisDropdownVisible,
  selectedAnalysisMonth,
  setSelectedAnalysisMonth,
  isAnalysisMonthDropdownVisible,
  setIsAnalysisMonthDropdownVisible,
  analysisOptions,
  months,
  years,
  selectedYear
}: FlowCardProps) {
  const allSources = selectedTab === 'In' ? incomeSources : selectedTab === 'Out' ? expenseSources : networthSources;
  
  // Helper function to check if transaction date matches selected date
  const isTransactionHighlighted = (transactionDate: string) => {
    if (!selectedDate || selectedTab === 'Net') return false;
    // Extract just the date part (e.g., "Sep 15" from "Sep 15 2025")
    const transactionDatePart = transactionDate.split(' ').slice(0, 2).join(' ');
    return transactionDatePart === selectedDate;
  };

  // Filter sources: if a date is selected, only show matching transactions
  const currentSources = selectedDate && selectedTab !== 'Net' 
    ? allSources.filter(source => isTransactionHighlighted(source.date))
    : allSources;

  return (
    <View style={{
      backgroundColor: AppColors.gray[0],
      marginHorizontal: 20,
      marginBottom: 20,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4
    }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: selectedTab === 'Net' ? 16 : 20
      }}>
        <ThemedText style={{
          fontSize: 18,
          fontWeight: '700',
          color: AppColors.gray[500]
        }}>
          {selectedTab === 'In' ? 'Income Flow' : selectedTab === 'Out' ? 'Outcome Flow' : 'Networth Flow'}
        </ThemedText>
      </View>

      {/* Analysis Filters - Only shown in Net view within the same card */}
      {selectedTab === 'Net' && (
        <AnalysisDropdowns
          selectedAnalysis={selectedAnalysis}
          setSelectedAnalysis={setSelectedAnalysis}
          isAnalysisDropdownVisible={isAnalysisDropdownVisible}
          setIsAnalysisDropdownVisible={setIsAnalysisDropdownVisible}
          selectedAnalysisMonth={selectedAnalysisMonth}
          setSelectedAnalysisMonth={setSelectedAnalysisMonth}
          isAnalysisMonthDropdownVisible={isAnalysisMonthDropdownVisible}
          setIsAnalysisMonthDropdownVisible={setIsAnalysisMonthDropdownVisible}
          analysisOptions={analysisOptions}
          months={months}
          years={years}
          selectedYear={selectedYear}
        />
      )}

      {/* Dynamic Sources based on selected tab */}
      {selectedTab === 'Net' ? (
        <FinancialAnalysisContent 
          selectedAnalysis={selectedAnalysis}
          formatCurrency={formatCurrency}
        />
      ) : (
        currentSources.map((source, index, array) => {
          return (
            <View key={index} style={{
              marginBottom: index < array.length - 1 ? 16 : 0,
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <View style={{ flex: 1 }}>
                  <ThemedText style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: AppColors.gray[500],
                    marginBottom: 4
                  }}>
                    {source.name}
                  </ThemedText>
                  <ThemedText style={{
                    fontSize: 12,
                    color: AppColors.gray[400]
                  }}>
                    {source.date} • {source.time}
                  </ThemedText>
                </View>
                
                <ThemedText style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: selectedTab === 'Out' ? '#EF4444' : AppColors.green[100]
                }}>
                  {selectedTab === 'Out' ? '- ' : '+ '}{formatCurrency(source.amount)}
                </ThemedText>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
} 