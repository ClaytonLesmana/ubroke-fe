import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Animated, Easing } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';
import { Icon } from '@/components/Icon';

interface MonthSliderProps {
  selectedMonth?: string;
  selectedYear?: string;
//   transactionCount?: number;
  onMonthChange?: (month: string, year: string) => void;
}

export function MonthSlider({
  selectedMonth = "August",
  selectedYear = "2025",
//   transactionCount = 5,
  onMonthChange
}: MonthSliderProps) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [currentMonthIndex, setCurrentMonthIndex] = useState(
    months.findIndex(m => m === selectedMonth)
  );
  const [currentYear, setCurrentYear] = useState(parseInt(selectedYear));

  // Animation for month label (slide + fade)
  const slide = useRef(new Animated.Value(0)).current; // -1 (left/up), 0 (center), 1 (right/down)

  const runMonthChangeAnimation = (direction: 'prev' | 'next', updateState: () => void) => {
    // Slide out
    Animated.timing(slide, {
      toValue: direction === 'next' ? -1 : 1,
      duration: 140,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      // Update date state in between animations
      updateState();
      // Jump to opposite side and slide into place
      slide.setValue(direction === 'next' ? 1 : -1);
      Animated.timing(slide, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    });
  };

  const handlePreviousMonth = () => {
    runMonthChangeAnimation('prev', () => {
      let newMonthIndex = currentMonthIndex - 1;
      let newYear = currentYear;
      if (newMonthIndex < 0) {
        newMonthIndex = 11;
        newYear = currentYear - 1;
      }
      setCurrentMonthIndex(newMonthIndex);
      setCurrentYear(newYear);
      onMonthChange?.(months[newMonthIndex], newYear.toString());
    });
  };

  const handleNextMonth = () => {
    runMonthChangeAnimation('next', () => {
      let newMonthIndex = currentMonthIndex + 1;
      let newYear = currentYear;
      if (newMonthIndex > 11) {
        newMonthIndex = 0;
        newYear = currentYear + 1;
      }
      setCurrentMonthIndex(newMonthIndex);
      setCurrentYear(newYear);
      onMonthChange?.(months[newMonthIndex], newYear.toString());
    });
  };

  const translateX = slide.interpolate({ inputRange: [-1, 0, 1], outputRange: [-20, 0, 20] });
  const opacity = slide.interpolate({ inputRange: [-1, 0, 1], outputRange: [0, 1, 0] });

  return (
    <View style={{
      backgroundColor: AppColors.primary[300],
      borderRadius: 35,
      width: '100%',
      height: 60,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginHorizontal: 0,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Left Arrow */}
        <TouchableOpacity
          onPress={handlePreviousMonth}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon 
            name="leftArrow"
            size={13}
            color={AppColors.gray[0]}
          />
        </TouchableOpacity>

        {/* Center Content (animated) */}
        <View style={{ flex: 1, alignItems: 'center', marginHorizontal: 16, overflow: 'hidden' }}>
          <Animated.View style={{ transform: [{ translateX }], opacity }}>
            <ThemedText style={{
              fontSize: 18,
              fontWeight: '600',
              color: AppColors.gray[0],
            }}>
              {months[currentMonthIndex]} {currentYear}
            </ThemedText>
          </Animated.View>
        </View>

        {/* Right Arrow */}
        <TouchableOpacity
          onPress={handleNextMonth}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon 
            name="rightArrow"
            size={13}
            color={AppColors.gray[0]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
} 