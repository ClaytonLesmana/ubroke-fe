import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

interface BudgetItem {
  name: string;
  spent: number;
  budget: number;
  icon: string;
  frequency: 'weekly' | 'fortnightly' | 'monthly';
}

interface BudgetGroup {
  frequency: 'weekly' | 'fortnightly' | 'monthly';
  budgets: BudgetItem[];
  daysLeft: number;
}

interface BudgetCardProps {
  budgetGroups: BudgetGroup[];
  onViewBudget?: () => void;
}

export function BudgetCard({ 
  budgetGroups, 
  onViewBudget 
}: BudgetCardProps) {
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getFrequencyDisplayName = (frequency: string) => {
    switch (frequency) {
      case 'weekly': return 'Weekly';
      case 'fortnightly': return 'Fortnightly';
      case 'monthly': return 'Monthly';
      default: return frequency;
    }
  };

  const BudgetItemComponent = ({ budgetItem }: { budgetItem: BudgetItem }) => {
    const progressPercentage = (budgetItem.spent / budgetItem.budget) * 100;
    const remaining = budgetItem.budget - budgetItem.spent;
    
    // Animated progress bar
    const animatedWidth = useRef(new Animated.Value(0)).current;
    const gradientAnimation = useRef(new Animated.Value(0)).current;

    // Animate progress bar on mount and when progress changes
    useEffect(() => {
      Animated.timing(animatedWidth, {
        toValue: Math.min(Math.max(progressPercentage, 0), 100),
        duration: 1500,
        useNativeDriver: false,
      }).start();
    }, [progressPercentage, animatedWidth]);

    // Animate gradient background continuously
    useEffect(() => {
      const animateGradient = () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(gradientAnimation, {
              toValue: 1,
              duration: 3000,
              useNativeDriver: false,
            }),
            Animated.timing(gradientAnimation, {
              toValue: 0,
              duration: 3000,
              useNativeDriver: false,
            }),
          ])
        ).start();
      };
      
      animateGradient();
    }, [gradientAnimation]);

    return (
              <View style={{
          marginBottom: 16,
          padding: 12,
          // backgroundColor: AppColors.gray[100],
          borderRadius: 12,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}>
            <ThemedText style={{
              fontSize: 16,
            }}>{budgetItem.icon}</ThemedText>
            
            <View style={{
              flex: 1,
              height: 12,
              backgroundColor: AppColors.gray[200],
              borderRadius: 2,
              overflow: 'hidden',
            }}>
              <Animated.View style={{ 
                width: animatedWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
                height: '100%',
                overflow: 'hidden',
                borderRadius: 2,
              }}>
                <Animated.View style={{
                  width: '200%',
                  height: '100%',
                  transform: [{
                    translateX: gradientAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -100],
                    })
                  }]
                }}>
                  <LinearGradient
                    colors={['#D9CCFF', '#936DFF', '#D9CCFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </Animated.View>
              </Animated.View>
            </View>
            
            <View style={{
              alignItems: 'flex-end',
              minWidth: 80,
            }}>
              <ThemedText style={{
                fontSize: 12,
                color: AppColors.gray[400],
                fontWeight: '500',
              }}>
                {formatCurrency(budgetItem.spent)}/{formatCurrency(budgetItem.budget)}
              </ThemedText>
            </View>
          </View>
        </View>
    );
  };

  return (
    <View style={{
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
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <ThemedText style={{
          fontSize: 18,
          fontWeight: '600',
          color: AppColors.gray[500],
        }}>Budget</ThemedText>
        {/* <ThemedText style={{
          fontSize: 12,
          color: AppColors.gray[400],
        }}>{budgetGroups.reduce((total, group) => total + group.budgets.length, 0)} active budgets</ThemedText> */}
      </View>
      
      {budgetGroups.map((group, groupIndex) => (
        <View key={groupIndex} style={{
          marginBottom: groupIndex < budgetGroups.length - 1 ? 20 : 0,
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <ThemedText style={{
              fontSize: 16,
              fontWeight: '600',
              color: AppColors.gray[500],
            }}>
              {getFrequencyDisplayName(group.frequency)}
            </ThemedText>
            <ThemedText style={{
              fontSize: 12,
              color: AppColors.gray[400],
            }}>
              {group.daysLeft} days left
            </ThemedText>
          </View>
          
          {group.budgets.map((budgetItem, itemIndex) => (
            <BudgetItemComponent key={itemIndex} budgetItem={budgetItem} />
          ))}
        </View>
      ))}
      
      <TouchableOpacity style={{
        backgroundColor: AppColors.primary[300],
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
      }} onPress={onViewBudget}>
        <ThemedText style={{
          color: AppColors.gray[0],
          fontSize: 14,
          fontWeight: '600',
        }}>Add Budget</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

 