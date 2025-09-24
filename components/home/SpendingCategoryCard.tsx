import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Animated, Easing, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';
import Svg, { Path, G, Defs, Filter, FeFlood, FeColorMatrix, FeOffset, FeGaussianBlur, FeComposite, FeBlend } from 'react-native-svg';
import { Icon } from '@/components/Icon';
import { useRouter } from 'expo-router';

interface SpendingCategory {
  name: string;
  amount: number;
  color: string;
  // Optional fields that might come from backend
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
  // Calculate totals and percentages dynamically
  const totalSpending = categories.reduce((sum, category) => sum + category.amount, 0);
  
  // Find the largest category for center display
  const largestCategory = categories.reduce((max, category) => 
    category.amount > max.amount ? category : max, categories[0]
  );
  const largestPercentage = (largestCategory.amount / totalSpending) * 100;

  // Sort categories by amount (largest first) for better visual hierarchy
  const sortedCategories = [...categories].sort((a, b) => b.amount - a.amount);

  // Interaction state: which segment is selected
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  // Store animated values and offsets
  const popoutValuesRef = useRef<Animated.Value[]>([]);
  const [offsets, setOffsets] = useState<Array<{dx: number, dy: number}>>(() => 
    categories.map(() => ({ dx: 0, dy: 0 }))
  );
  
  // Store donut paths data for listener access
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

  // Initialize popoutValues when categories change
  useEffect(() => {
    popoutValuesRef.current = sortedCategories.map(() => new Animated.Value(0));
    setOffsets(sortedCategories.map(() => ({ dx: 0, dy: 0 })));
  }, [sortedCategories.length]);

  // Set up animation listeners (only once, no dependencies)
  useEffect(() => {
    const setupListeners = () => {
      const currentPopoutValues = popoutValuesRef.current;
      const subs = currentPopoutValues.map((val, i) =>
        val.addListener(({ value }) => {
          const pathData = donutPathsRef.current[i];
          if (pathData) {
            const angle = pathData.midAngle;
            const distance = 8 * value;
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
  }, []); // Empty dependency array to prevent infinite loops

  // Handle selection animations
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

  // Generate dynamic donut chart paths based on categories
  const generateDonutPaths = () => {
    const centerX = 90;
    const centerY = 90;
    const outerRadius = 80;
    const innerRadius = 50;
    const gap = 0.08; // Small gap between segments
    
    let currentAngle = -Math.PI / 2; // Start from top
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
      
      // Calculate start and end angles
      const startAngle = currentAngle;
      const endAngle = currentAngle + segmentAngle;
      const midAngle = (startAngle + endAngle) / 2;
      
      // Create rounded segment path
      const path = createRoundedSegmentPath(
        centerX, 
        centerY, 
        outerRadius, 
        innerRadius, 
        startAngle, 
        endAngle
      );
      
      paths.push({
        path,
        color: category.color,
        percentage: percentage * 100,
        startAngle,
        endAngle,
        midAngle,
      });
      
      currentAngle = endAngle + gap;
    });
    
    // Update the ref for listener access
    donutPathsRef.current = paths;
    return paths;
  };

  // Create rounded segment path
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
    
    // Outer arc
    const largeArcFlag = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
    const outerArc = `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}`;
    
    // Inner arc (reverse direction)
    const innerArc = `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`;
    
    return `M ${outerStartX} ${outerStartY} ${outerArc} L ${innerEndX} ${innerEndY} ${innerArc} Z`;
  };

  const donutPaths = generateDonutPaths();

  return (
    <View style={{
      backgroundColor: AppColors.gray[0],
      borderRadius: 24,
      padding: 20,
      paddingTop: 55,
      marginHorizontal: -8,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 3,
    }}>


      <View style={{
        alignItems: 'center',
        marginBottom: 20,
      }}>
        <View style={{
          position: 'relative',
          marginBottom: 24,
        }}>
          <Svg width={180} height={180} viewBox="0 0 180 180">
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
                const opacity = selectedIndex === null
                  ? 1
                  : (selectedIndex === index ? 1 : 0.35);

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
          
          {/* Center text showing largest category */}
          {/* <View style={styles.centerText}>
            <ThemedText style={styles.percentageText}>
              {largestPercentage.toFixed(0)}%
            </ThemedText>
            <ThemedText style={styles.categoryText}>
              {largestCategory.name}
            </ThemedText>
          </View> */}
        </View>
        
        {/* Legend at the bottom */}
        <View style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          {sortedCategories.map((category, index) => {
            const percentage = (category.amount / totalSpending) * 100;
            const isSelected = selectedIndex === index;
            return (
              <TouchableOpacity key={index} activeOpacity={0.8} onPress={() => handleSegmentPress(index)}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  minWidth: 80,
                  ...(isSelected && {
                    backgroundColor: AppColors.gray[100],
                    borderRadius: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                  }),
                }}>
                  {/* <View style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: category.color,
                  }} /> */}
                  <View style={{
                    flex: 1,
                  }}>
                    <ThemedText style={{
                      fontSize: 11,
                      fontWeight: isSelected ? '600' : '500',
                      color: AppColors.gray[500],
                    }}>
                      {category.name}
                    </ThemedText>
                    <ThemedText style={{
                      fontSize: 10,
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
        style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }} 
        onPress={onTapToDigDeeper}
      >
        <ThemedText style={{ fontSize: 14, color: AppColors.primary[300],marginRight: 4, fontWeight: '500' }}>See details</ThemedText>
        <Icon name="rightArrow" size={6}  color={AppColors.primary[300]} />
      </TouchableOpacity>
    </View>
  );
}

