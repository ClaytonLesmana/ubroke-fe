import React, { useRef } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';
import Svg, { Line } from 'react-native-svg';

interface ChartData {
  date: string;
  value: number;
}

interface CashflowChartProps {
  selectedTab: 'In' | 'Out' | 'Net';
  currentData: ChartData[];
  selectedBarIndex: number | null;
  setSelectedBarIndex: (index: number) => void;
  onScroll: (event: any) => void;
  onScrollbarPress: (event: any) => void;
  scrollOffset: number;
  formatCurrency: (amount: number) => string;
}

export function CashflowChart({
  selectedTab,
  currentData,
  selectedBarIndex,
  setSelectedBarIndex,
  onScroll,
  onScrollbarPress,
  scrollOffset,
  formatCurrency
}: CashflowChartProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  // Chart dimensions
  const chartInnerHeight = selectedTab === 'Net' ? 160 : 120;
  const chartTopInset = Math.max(2, Math.round(chartInnerHeight * 0.05));

  // Calculate bar dimensions
  const maxBarValue = Math.max(...currentData.map(d => Math.abs(d.value)));
  
  const getBarHeight = (value: number) => {
    const effectiveMax = Math.max(1, maxBarValue * 0.85);
    const ratio = Math.min(Math.abs(value) / effectiveMax, 1);
    const maxHeight = selectedTab === 'Net' ? 70 : 90;
    const calculatedHeight = ratio * maxHeight;
    return Math.max(calculatedHeight, 8);
  };

  const getBarY = (value: number) => {
    if (selectedTab === 'Net') {
      const centerLine = 80;
      const barHeight = getBarHeight(value);
      if (value >= 0) {
        return centerLine - barHeight;
      } else {
        return centerLine;
      }
    } else {
      return 100 - getBarHeight(value);
    }
  };

  return (
    <View style={{ height: selectedTab === 'Net' ? 180 : 140 }}>
      <ScrollView 
        ref={scrollViewRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={{ position: 'relative', height: selectedTab === 'Net' ? 160 : 120 }}>
          <Svg width={currentData.length * 80} height={chartInnerHeight.toString()} viewBox={`0 0 ${currentData.length * 80} ${chartInnerHeight}`}>
            {/* Grid lines - different for net view */}
            {selectedTab === 'Net' ? (
              // Center line for net view
              <Line
                x1="0"
                y1="80"
                x2={currentData.length * 80}
                y2="80"
                stroke={AppColors.gray[300]}
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            ) : (
              // Multiple dashed grid lines for income/out view - equally spaced
              [20, 40, 60, 80, 100].map((y, index) => (
                <Line
                  key={index}
                  x1="0"
                  y1={y}
                  x2={currentData.length * 80}
                  y2={y}
                  stroke={AppColors.gray[200]}
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
              ))
            )}
          </Svg>
          
          {/* Bars rendered outside SVG for better touch handling */}
          {currentData.map((data, index) => {
            const barHeight = getBarHeight(data.value);
            const barWidth = 50;
            const barX = index * 80 + 15;
            const barY = getBarY(data.value);
            
            const barColor = AppColors.primary[300];
            const barRadius = Math.min(4, barHeight / 2);
            
            return (
              <TouchableOpacity
                key={index}
                style={{ 
                  position: 'absolute', 
                  left: barX, 
                  top: barY, 
                  width: barWidth, 
                  height: barHeight,
                  backgroundColor: barColor,
                  borderRadius: barRadius
                }}
                onPress={() => setSelectedBarIndex(index)}
                activeOpacity={0.8}
              />
            );
          })}
          
          {/* Date labels */}
          {currentData.map((data, index) => (
            <View
              key={`label-${index}`}
              style={{
                position: 'absolute',
                left: index * 80 + 15,
                top: selectedTab === 'Net' ? 145 : 105,
                width: 50,
                alignItems: 'center'
              }}
            >
              <ThemedText style={{
                fontSize: 11,
                color: AppColors.gray[400],
                textAlign: 'center'
              }}>
                {data.date}
              </ThemedText>
            </View>
          ))}
          
          {/* Tooltip for selected bar */}
          {selectedBarIndex !== null && (
            <View style={{
              position: 'absolute',
              left: selectedBarIndex * 80 + 15,
              top: selectedTab === 'Net' 
                ? Math.max(chartTopInset, getBarY(currentData[selectedBarIndex].value) - 35)
                : Math.max(chartTopInset, 100 - getBarHeight(currentData[selectedBarIndex].value) - 40),
              backgroundColor: AppColors.gray[500],
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              alignItems: 'center',
              transform: [{ translateX: 17 }],
              zIndex: 2
            }}>
              <ThemedText style={{
                fontSize: 12,
                color: AppColors.gray[0],
                fontWeight: '600'
              }}>
                {selectedTab === 'Net' && currentData[selectedBarIndex].value >= 0 ? '+' : ''}
                {selectedTab === 'Net' && Math.abs(currentData[selectedBarIndex].value) >= 1000 
                  ? `${Math.abs(currentData[selectedBarIndex].value) / 1000}K`
                  : `$${Math.abs(currentData[selectedBarIndex].value)}`
                }
              </ThemedText>
              {/* Tooltip arrow */}
              <View style={{
                position: 'absolute',
                bottom: -4,
                left: '50%',
                marginLeft: -4,
                width: 0,
                height: 0,
                borderLeftWidth: 4,
                borderRightWidth: 4,
                borderTopWidth: 4,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderTopColor: AppColors.gray[500]
              }} />
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Functional Horizontal Scrollbar */}
      <TouchableOpacity
        style={{
          height: 4,
          backgroundColor: AppColors.gray[200],
          borderRadius: 2,
          marginTop: 8,
          marginRight: 20,
          overflow: 'hidden'
        }}
        onPress={onScrollbarPress}
        activeOpacity={0.8}
      >
        <View style={{
          width: `${Math.max(20, Math.min(80, 33 + scrollOffset * 30))}%`,
          height: '100%',
          backgroundColor: AppColors.gray[400],
          borderRadius: 2,
          transform: [{ translateX: scrollOffset * 200 }]
        }} />
      </TouchableOpacity>
    </View>
  );
} 