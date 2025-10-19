import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Animated, Easing, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';
import Svg, { Path, G, Defs, Filter, FeFlood, FeColorMatrix, FeOffset, FeGaussianBlur, FeComposite, FeBlend } from 'react-native-svg';
import { Icon } from '@/components/Icon';
import { useRouter } from 'expo-router';
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
  const sortedCategories = [...categories].sort((a, b) => b.amount - a.amount);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const popoutValuesRef = useRef<Animated.Value[]>([]);
  const [offsets, setOffsets] = useState<Array<{dx: number, dy: number}>>(() => 
    categories.map(() => ({ dx: 0, dy: 0 }))
  );
  const donutPathsRef = useRef<Array<{
    path: string;
    color: string;
    percentage: number;
    startAngle: number;
    endAngle: number;
    midAngle: number;
  }>>([]);

  const handleSegmentPress = (index: number) => {
    setSelectedIndex(prev => (prev === index ? null : index));
  };

  useEffect(() => {
    popoutValuesRef.current = sortedCategories.map(() => new Animated.Value(0));
    setOffsets(sortedCategories.map(() => ({ dx: 0, dy: 0 })));
  }, [sortedCategories.length]);

  useEffect(() => {
    const setupListeners = () => {
      const currentPopoutValues = popoutValuesRef.current;
      const subs = currentPopoutValues.map((val, i) =>
        val.addListener(({ value }) => {
          const pathData = donutPathsRef.current[i];
          if (pathData) {
            const angle = pathData.midAngle;
            const distance = scale(8) * value;
            const dx = distance * Math.cos(angle);
            const dy = distance * Math.sin(angle);
            setOffsets(prev => {
              const next = [...prev];
              next[i] = { dx, dy };
              return next;
            });
          }
        })
      );
      return () => {
        subs.forEach((sub, i) => {
          if (currentPopoutValues[i]) {
            currentPopoutValues[i].removeListener(sub);
          }
        });
      };
    };

    const cleanup = setupListeners();
    return cleanup;
  }, []);

  useEffect(() => {
    const currentPopoutValues = popoutValuesRef.current;
    currentPopoutValues.forEach((val, i) => {
      Animated.timing(val, {
        toValue: selectedIndex === i ? 1 : 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    });
  }, [selectedIndex]);

  const generateDonutPaths = () => {
    const centerX = scale(90);
    const centerY = scale(90);
    const outerRadius = scale(80);
    const innerRadius = scale(50);
    const gap = 0.08;
    
    let currentAngle = -Math.PI / 2;
    const paths: Array<{
      path: string;
      color: string;
      percentage: number;
      startAngle: number;
      endAngle: number;
      midAngle: number;
    }> = [];
    
    sortedCategories.forEach((category, index) => {
      const percentage = (category.amount / totalSpending);
      const segmentAngle = percentage * (2 * Math.PI - gap * sortedCategories.length);
      
      const startAngle = currentAngle;
      const endAngle = currentAngle + segmentAngle;
      const midAngle = (startAngle + endAngle) / 2;
      
      const path = createRoundedSegmentPath(
        centerX, 
        centerY, 
        outerRadius, 
        innerRadius, 
        startAngle, 
        endAngle
      );
      
      paths.push({ path, color: category.color, percentage: percentage * 100, startAngle, endAngle, midAngle });
      currentAngle = endAngle + gap;
    });
    
    donutPathsRef.current = paths;
    return paths;
  };

  const createRoundedSegmentPath = (
    centerX: number, 
    centerY: number, 
    outerRadius: number, 
    innerRadius: number, 
    startAngle: number, 
    endAngle: number
  ) => {
    const outerStartX = centerX + outerRadius * Math.cos(startAngle);
    const outerStartY = centerY + outerRadius * Math.sin(startAngle);
    const outerEndX = centerX + outerRadius * Math.cos(endAngle);
    const outerEndY = centerY + outerRadius * Math.sin(endAngle);
    
    const innerStartX = centerX + innerRadius * Math.cos(startAngle);
    const innerStartY = centerY + innerRadius * Math.sin(startAngle);
    const innerEndX = centerX + innerRadius * Math.cos(endAngle);
    const innerEndY = centerY + innerRadius * Math.sin(endAngle);
    
    const largeArcFlag = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
    const outerArc = `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}`;
    const innerArc = `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`;
    
    return `M ${outerStartX} ${outerStartY} ${outerArc} L ${innerEndX} ${innerEndY} ${innerArc} Z`;
  };

  const donutPaths = generateDonutPaths();

  return (
    <View style={{
      backgroundColor: AppColors.gray[0],
      borderRadius: radii.lg,
      padding: spacing.lg,
      paddingTop: scale(55),
      marginHorizontal: -scale(8),
      marginBottom: spacing.md,
      ...cardShadow,
    }}>
      <View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
        <View style={{ position: 'relative', marginBottom: spacing.lg }}>
          <Svg width={scale(180)} height={scale(180)} viewBox={`0 0 ${scale(180)} ${scale(180)}`}>
            <Defs>
              <Filter id="filter0_d_230_1307" x="0" y="0" width="180" height="180" filterUnits="userSpaceOnUse">
                <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
                <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <FeOffset dy="2"/>
                <FeGaussianBlur stdDeviation="6"/>
                <FeComposite in2="hardAlpha" operator="out"/>
                <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"/>
                <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_230_1307"/>
                <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_230_1307" result="shape"/>
              </Filter>
            </Defs>
            
            <G filter="url(#filter0_d_230_1307)">
              {donutPaths.map((segment, index) => {
                const opacity = selectedIndex === null ? 1 : (selectedIndex === index ? 1 : 0.35);
                return (
                  <Path
                    key={index}
                    d={segment.path}
                    fill={segment.color}
                    onPress={() => handleSegmentPress(index)}
                    transform={`translate(${offsets[index]?.dx || 0}, ${offsets[index]?.dy || 0})`}
                    opacity={opacity}
                  />
                );
              })}
            </G>
          </Svg>
        </View>
        
        <View style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: scale(16),
        }}>
          {sortedCategories.map((category, index) => {
            const percentage = (category.amount / totalSpending) * 100;
            const isSelected = selectedIndex === index;
            return (
              <TouchableOpacity key={index} activeOpacity={0.8} onPress={() => handleSegmentPress(index)}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: scale(8),
                  minWidth: scale(80),
                  ...(isSelected && {
                    backgroundColor: AppColors.gray[100],
                    borderRadius: radii.md,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: scale(6),
                  }),
                }}>
                  <View style={{ flex: 1 }}>
                    <ThemedText style={{
                      fontSize: scale(11),
                      fontWeight: isSelected ? '600' : '500',
                      color: AppColors.gray[500],
                    }}>
                      {category.name}
                    </ThemedText>
                    <ThemedText style={{
                      fontSize: scale(10),
                      color: AppColors.gray[400],
                      fontWeight: isSelected ? '600' : '400',
                    }}>
                      ${category.amount.toFixed(2)} {percentage.toFixed(1)}%
                    </ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity 
        style={{ flexDirection: 'row', alignItems: 'center', gap: scale(4) }} 
        onPress={onTapToDigDeeper}
      >
        <ThemedText style={{ fontSize: scale(14), color: AppColors.primary[300],marginRight: scale(4), fontWeight: '500' }}>See details</ThemedText>
        <Icon name="rightArrow" size={scale(6)}  color={AppColors.primary[300]} />
      </TouchableOpacity>
    </View>
  );
}

