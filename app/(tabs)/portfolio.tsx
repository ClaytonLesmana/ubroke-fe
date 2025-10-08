import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Icon } from "@/components/Icon";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors, AppColors } from "@/constants/Colors";
import { useExpenses } from "@/hooks/useExpenses";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { TransactionUploadModal } from "@/components/TransactionUploadModal";
import { TransactionView } from "@/components/portfolio/TransactionView";
import { NetWorthView } from "@/components/portfolio/NetWorthView";
import { Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';


type TransactionViewType = 'transaction' | 'networth';

export default function PortfolioScreen() {
  const colorScheme = useColorScheme();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [transactionView, setTransactionView] = useState<TransactionViewType>('networth');
  const { transactions, accounts, netWorth, addTransaction } = useExpenses();
  const router = useRouter();

  // Account dropdown dummy data/state
  const dummyAccounts = [
    { id: 'acc-1', name: 'Personal' },
    { id: 'acc-2', name: 'Savings' },
    { id: 'acc-3', name: 'Business' },
    { id: 'acc-4', name: 'Joint' },
  ];
  const [selectedAccount, setSelectedAccount] = useState(dummyAccounts[0]);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  // Month slider animation state (mirrors MonthSlider)
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const now = new Date();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const slide = React.useRef(new Animated.Value(0)).current; // -1, 0, 1

  const runMonthChangeAnimation = (direction: 'prev' | 'next', updateState: () => void) => {
    Animated.timing(slide, {
      toValue: direction === 'next' ? -1 : 1,
      duration: 140,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      updateState();
      slide.setValue(direction === 'next' ? 1 : -1);
      Animated.timing(slide, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    });
  };

  const handlePrev = () => {
    runMonthChangeAnimation('prev', () => {
      let newMonthIndex = currentMonthIndex - 1;
      let newYear = currentYear;
      if (newMonthIndex < 0) {
        newMonthIndex = 11;
        newYear = currentYear - 1;
      }
      setCurrentMonthIndex(newMonthIndex);
      setCurrentYear(newYear);
    });
  };

  const handleNext = () => {
    runMonthChangeAnimation('next', () => {
      let newMonthIndex = currentMonthIndex + 1;
      let newYear = currentYear;
      if (newMonthIndex > 11) {
        newMonthIndex = 0;
        newYear = currentYear + 1;
      }
      setCurrentMonthIndex(newMonthIndex);
      setCurrentYear(newYear);
    });
  };

  const translateX = slide.interpolate({ inputRange: [-1, 0, 1], outputRange: [-20, 0, 20] });
  const opacity = slide.interpolate({ inputRange: [-1, 0, 1], outputRange: [0, 1, 0] });

  return (
    <ThemedView style={{ flex: 1 }}>
      {/* Limited gradient background with rounded bottom corners */}
      <LinearGradient
        colors={['#D9CCFF', '#936DFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          paddingTop: 80,
          // paddingBottom: 40,
          borderBottomLeftRadius: 44,
          borderBottomRightRadius: 44,
          marginBottom: 20,
          minHeight: 380, // Fixed height to ensure consistency
        }}
      >
        {/* Transaction/Net Worth Toggle */}
        <View style={{
          flexDirection: 'row',
          alignSelf: 'center',
          backgroundColor: '#F8F9FA',
          borderRadius: 55,
          padding: 4,
          width: '90%',
          maxWidth: 400,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}>
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 20,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 55,
              marginRight: 2,
              backgroundColor: transactionView === 'transaction' ? AppColors.primary[300] : 'transparent',
              shadowColor: transactionView === 'transaction' ? '#936DFF' : 'transparent',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: transactionView === 'transaction' ? 0.3 : 0,
              shadowRadius: 4,
              elevation: transactionView === 'transaction' ? 4 : 0,
            }}
            onPress={() => setTransactionView('transaction')}
            activeOpacity={0.8}
          >
            <ThemedText style={{
              fontSize: 16,
              fontWeight: '600',
              color: transactionView === 'transaction' ? '#FFFFFF' : '#848484',
            }}>
              Transaction
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 20,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 55,
              marginLeft: 2,
              backgroundColor: transactionView === 'networth' ? AppColors.primary[300] : 'transparent',
              shadowColor: transactionView === 'networth' ? '#936DFF' : 'transparent',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: transactionView === 'networth' ? 0.3 : 0,
              shadowRadius: 4,
              elevation: transactionView === 'networth' ? 4 : 0,
            }}
            onPress={() => setTransactionView('networth')}
            activeOpacity={0.8}
          >
            <ThemedText style={{
              fontSize: 16,
              fontWeight: '600',
              color: transactionView === 'networth' ? '#FFFFFF' : '#848484',
            }}>
              Net Worth
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Hero Content within gradient - consistent height container */}
        <View style={{
          flex: 1,
          justifyContent: 'center',
        }}>
          {transactionView === 'networth' && (
            <View style={{
              padding: 40,
              top: 0,
              alignItems: 'center',
            }}>
              {/* Money bag icon */}
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#ffffff',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
              }}>
                <Icon name="moneyBagIcon" size={40} />
              </View>
              
              <ThemedText style={{
                fontSize: 18,
                color: 'rgba(255, 255, 255, 0.8)',
                // marginBottom: 8,
              }}>
                Your Net Worth
              </ThemedText>
              
              <ThemedText style={{
                fontSize: 48,
                paddingTop: 40,
                fontWeight: 'bold',
                color: '#FFFFFF',
              }}>
                $86,540.00
              </ThemedText>
            </View>
          )}

          {transactionView === 'transaction' && (
            <View style={{
              flex: 1,
              paddingHorizontal: 20,
            }}>
              {/* White container with summary cards */}
              <View style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 34,
                
                marginTop: 60,
                top: -50,
                paddingHorizontal: 16,
                paddingVertical: 12,
                flex: 1,
                justifyContent: 'center',
              }}>
                {/* Account Dropdown - positioned above white container */}
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}>
                  <View style={{ position: 'relative' }}>
                    <TouchableOpacity style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: 10,
                      minWidth: 120,
                    }} onPress={() => setShowAccountDropdown(v => !v)}>
                      <ThemedText style={{
                        fontSize: 15,
                        fontWeight: '500',
                        marginRight: 6,
                      }}>{selectedAccount.name}</ThemedText>
                      <Icon name="downIcon" size={14} color="#666" />
                    </TouchableOpacity>

                    {showAccountDropdown && (
                      <View style={{
                        position: 'absolute',
                        top: 44,
                        left: 0,
                        right: 0,
                        backgroundColor: '#FFFFFF',
                        borderRadius: 10,
                        paddingVertical: 6,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.15,
                        shadowRadius: 8,
                        elevation: 6,
                        zIndex: 20,
                      }}>
                        {dummyAccounts.map(acc => (
                          <TouchableOpacity key={acc.id} onPress={() => { setSelectedAccount(acc); setShowAccountDropdown(false); }}
                            style={{ paddingVertical: 10, paddingHorizontal: 12 }}>
                            <ThemedText style={{ fontSize: 15, color: '#111' }}>{acc.name}</ThemedText>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Month Navigation - positioned on the right */}
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                  }}>
                    <TouchableOpacity style={{ padding: 2 }} onPress={handlePrev}>
                      <Icon name="leftArrow" size={8} color="#666" />
                    </TouchableOpacity>
                    <View style={{ marginHorizontal: 10, overflow: 'hidden', minWidth: 110, alignItems: 'center' }}>
                      <Animated.View style={{ transform: [{ translateX }], opacity }}>
                        <ThemedText style={{
                          fontSize: 15,
                          fontWeight: '600',
                          color: '#000',
                        }}>{months[currentMonthIndex]} {currentYear}</ThemedText>
                      </Animated.View>
                    </View>
                    <TouchableOpacity style={{ padding: 2 }} onPress={handleNext}>
                      <Icon name="rightArrow" size={8} color="#666" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Summary Cards */}
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  paddingVertical: 8,
                }}>
                  <View style={{
                    alignItems: 'center',
                    flex: 1,
                  }}>
                    <ThemedText style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      marginBottom: 2,
                      color: '#000',
                    }}>$10000</ThemedText>
                    <ThemedText style={{
                      fontSize: 14,
                      color: '#666',
                    }}>Income</ThemedText>
                  </View>
                  <View style={{
                    alignItems: 'center',
                    flex: 1,
                  }}>
                    <ThemedText style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      marginBottom: 2,
                      color: '#000',
                    }}>$200</ThemedText>
                    <ThemedText style={{
                      fontSize: 14,
                      color: '#666',
                    }}>Expenses</ThemedText>
                  </View>
                  <View style={{
                    alignItems: 'center',
                    flex: 1,
                  }}>
                    <ThemedText style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      marginBottom: 2,
                      color: '#000',
                    }}>$800</ThemedText>
                    <ThemedText style={{
                      fontSize: 14,
                      color: '#666',
                    }}>Balance</ThemedText>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Content below gradient (normal background) */}
      {transactionView === 'transaction' && (
        <>
          <TransactionView 
            transactions={transactions} 
            addTransaction={addTransaction} 
          />
          {/* Floating action button */}
          <TouchableOpacity
            onPress={() => router.push('/transactions/new')}
            activeOpacity={0.9}
            style={{
              position: 'absolute',
              right: 20,
              bottom: 90,
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: AppColors.primary[300],
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Icon name="addIcon" size={22} color="#fff" />
          </TouchableOpacity>
        </>
      )}
      {transactionView === 'networth' && (
        <NetWorthView netWorth={netWorth} />
      )}

      <AddTransactionModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddTransaction={addTransaction}
        accounts={accounts.map(account => ({ id: account.id, name: account.name }))}
      />

      <TransactionUploadModal
        visible={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onAddTransaction={addTransaction}
        accounts={accounts.map(account => ({ id: account.id, name: account.name }))}
      />
    </ThemedView>
  );
}
