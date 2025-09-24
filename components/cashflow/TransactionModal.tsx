import React, { useRef, useEffect } from 'react';
import { View, Modal, TouchableOpacity, ScrollView, Animated, PanResponder, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';
import { Icon } from '@/components/Icon';
import { CategoryIcon, getCategoryFromTransaction } from '@/components/CategoryIcon';

interface Transaction {
  name: string;
  amount: number;
  date: string;
  time: string;
  category?: string;
}

interface TransactionModalProps {
  visible: boolean;
  onClose: () => void;
  transactions: Transaction[];
  title: string;
  date: string;
  type: 'income' | 'expense';
  formatCurrency: (amount: number) => string;
}

export function TransactionModal({ 
  visible, 
  onClose, 
  transactions, 
  title, 
  date,
  type, 
  formatCurrency 
}: TransactionModalProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get('window').height;

  // Reset animation when modal becomes visible
  React.useEffect(() => {
    if (visible) {
      translateY.setValue(0);
    }
  }, [visible, translateY]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // Only respond to vertical drags that are primarily downward
      return Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && gestureState.dy > 10;
    },
    onPanResponderGrant: () => {
      // Set initial value when gesture starts
      translateY.setOffset(0);
      translateY.setValue(0);
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      translateY.flattenOffset();
      
      if (gestureState.dy > 100 || gestureState.vy > 0.5) {
        // Close modal if dragged down more than 100px or fast velocity
        Animated.timing(translateY, {
          toValue: screenHeight * 0.8,
          duration: 200,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            translateY.setValue(0);
            onClose();
          }
        });
      } else {
        // Snap back to original position
        // Animated.spring(translateY, {
        //   toValue: 0,
        //   tension: 100,
        //   friction: 8,
        //   useNativeDriver: true,
        // }).start();
      }
    },
  });
  


  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        justifyContent: 'flex-end',
        height: '80%',
        
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}>
        <Animated.View 
          style={{
            backgroundColor: AppColors.gray[0],
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            height: '65%',
            paddingTop: 12,
            paddingHorizontal: 20,
            paddingBottom: 34,
            transform: [{ translateY }],
          }}
        >
          {/* Drag Handle & Header */}
          <View 
            style={{
              alignItems: 'center',
              paddingVertical: 8,
              marginBottom: 16,
            }}
            {...panResponder.panHandlers}
          >
            <View style={{
              width: 40,
              height: 4,
              backgroundColor: AppColors.gray[300],
              borderRadius: 2,
              marginBottom: 16,
            }} />
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: AppColors.gray[200],
            }}>
              <ThemedText style={{
                fontSize: 18,
                fontWeight: '500',
                color: AppColors.gray[500],
              }}>
                {title}
              </ThemedText>
              <ThemedText style={{
                fontSize: 14,
                fontWeight: '400',
                color: AppColors.gray[400],
              }}>
                {date}
              </ThemedText>
            </View>
          </View>

          {/* Transaction List */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {transactions.map((transaction, index) => (
              <View key={index} style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 16,
                borderBottomWidth: index < transactions.length - 1 ? 1 : 0,
                borderBottomColor: AppColors.gray[100],
              }}>
                {/* Category Icon (for expenses only) */}
                {type === 'expense' && (
                  <View style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: AppColors.gray[100],
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 16,
                  }}>
                    <CategoryIcon 
                      category={getCategoryFromTransaction(transaction.name)} 
                      size={24} 
                      color={AppColors.gray[400]} 
                    />
                  </View>
                )}

                {/* Income Icon (for income only) */}
                {/* {type === 'income' && (
                  <View style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: AppColors.green[100],
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 16,
                  }}>
                    <Icon 
                      name="upTrendIcon" 
                      size={24} 
                      color={AppColors.gray[0]} 
                    />
                  </View>
                )} */}

                {/* Transaction Details */}
                <View style={{ flex: 1 }}>
                  <ThemedText style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: AppColors.gray[500],
                    marginBottom: 4,
                  }}>
                    {transaction.name}
                  </ThemedText>
                  <ThemedText style={{
                    fontSize: 12,
                    color: AppColors.gray[400],
                  }}>
                    {transaction.date} • {transaction.time}
                  </ThemedText>
                </View>

                {/* Amount */}
                <ThemedText style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: type === 'income' ? AppColors.green[100] : '#EF4444',
                }}>
                  {type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </ThemedText>
              </View>
            ))}
          </ScrollView>

          {/* Summary */}
          <View style={{
            marginTop: 20,
            paddingTop: 20,
            backgroundColor: type === 'income' ? '#F0FDF4' : '#FEF2F2',
            borderRadius: 12,
            padding: 16,
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <ThemedText style={{
                fontSize: 16,
                fontWeight: '600',
                color: AppColors.gray[500],
              }}>
                Total {type === 'income' ? 'Income' : 'Expenses'}
              </ThemedText>
              <ThemedText style={{
                fontSize: 20,
                fontWeight: '700',
                color: type === 'income' ? AppColors.green[100] : '#EF4444',
              }}>
                {type === 'income' ? '+' : '-'}{formatCurrency(
                  transactions.reduce((sum, t) => sum + t.amount, 0)
                )}
              </ThemedText>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
} 