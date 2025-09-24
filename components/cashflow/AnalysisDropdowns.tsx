import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Icon } from '@/components/Icon';
import { AppColors } from '@/constants/Colors';

interface AnalysisDropdownsProps {
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

export function AnalysisDropdowns({
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
}: AnalysisDropdownsProps) {
  return (
    <View style={{
      position: 'relative',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      gap: 12
    }}>
      {/* Analysis Type Dropdown */}
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
        }} onPress={() => setIsAnalysisDropdownVisible(!isAnalysisDropdownVisible)}>
          <ThemedText style={{
            fontSize: 12,
            color: AppColors.gray[500]
          }}>
            {selectedAnalysis}
          </ThemedText>
          <Icon name={isAnalysisDropdownVisible ? "upIcon" : "downIcon"} size={15} color={AppColors.gray[400]} />
        </TouchableOpacity>
        
        {/* Analysis Dropdown */}
        {isAnalysisDropdownVisible && (
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
            {analysisOptions.map((option, index) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setSelectedAnalysis(option);
                  setIsAnalysisDropdownVisible(false);
                }}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderBottomWidth: index < analysisOptions.length - 1 ? 1 : 0,
                  borderBottomColor: AppColors.gray[100]
                }}
              >
                <ThemedText style={{
                  fontSize: 14,
                  color: selectedAnalysis === option ? AppColors.primary[300] : AppColors.gray[500],
                  fontWeight: selectedAnalysis === option ? '600' : '400'
                }}>
                  {option}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Month Filter Dropdown */}
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
        }} onPress={() => setIsAnalysisMonthDropdownVisible(!isAnalysisMonthDropdownVisible)}>
          <ThemedText style={{
            fontSize: 14,
            color: AppColors.gray[500]
          }}>
            {selectedAnalysisMonth}
          </ThemedText>
          <Icon name={isAnalysisMonthDropdownVisible ? "upIcon" : "downIcon"} size={15} color={AppColors.gray[400]} />
        </TouchableOpacity>
        
        {/* Analysis Month Dropdown */}
        {isAnalysisMonthDropdownVisible && (
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
                    onPress={() => {
                      setSelectedAnalysisMonth(`${month} ${selectedYear}`);
                      setIsAnalysisMonthDropdownVisible(false);
                    }}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderBottomWidth: index < months.length - 1 ? 1 : 0,
                      borderBottomColor: AppColors.gray[100]
                    }}
                  >
                    <ThemedText style={{
                      fontSize: 12,
                      color: selectedAnalysisMonth.includes(month) ? AppColors.primary[300] : AppColors.gray[500],
                      fontWeight: selectedAnalysisMonth.includes(month) ? '600' : '400'
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
                    onPress={() => {
                      setSelectedAnalysisMonth(`${selectedAnalysisMonth.split(' ')[0]} ${year}`);
                      setIsAnalysisMonthDropdownVisible(false);
                    }}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderBottomWidth: index < years.length - 1 ? 1 : 0,
                      borderBottomColor: AppColors.gray[100]
                    }}
                  >
                    <ThemedText style={{
                      fontSize: 14,
                      color: selectedAnalysisMonth.includes(year.toString()) ? AppColors.primary[300] : AppColors.gray[500],
                      fontWeight: selectedAnalysisMonth.includes(year.toString()) ? '600' : '400',
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