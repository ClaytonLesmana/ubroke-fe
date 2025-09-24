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

type TransactionViewType = 'transaction' | 'networth';

export default function PortfolioScreen() {
  const colorScheme = useColorScheme();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [transactionView, setTransactionView] = useState<TransactionViewType>('networth');
  const { transactions, accounts, netWorth, addTransaction } = useExpenses();

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
          minHeight: 320, // Fixed height to ensure consistency
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
              top: -10,
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
                marginBottom: 20,
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
                borderRadius: 20,
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
                  <TouchableOpacity style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 10,
                    minWidth: 100,
                  }}>
                    <ThemedText style={{
                      fontSize: 15,
                      fontWeight: '500',
                      marginRight: 6,
                    }}>Personal</ThemedText>
                    <Icon name="downIcon" size={14} color="#666" />
                  </TouchableOpacity>

                  {/* Month Navigation - positi
                  oned on the right */}
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                  }}>
                    <TouchableOpacity style={{ padding: 2 }}>
                      <Icon name="leftArrow" size={8} color="#666" />
                    </TouchableOpacity>
                    <ThemedText style={{
                      fontSize: 15,
                      fontWeight: '600',
                      marginHorizontal: 10,
                      color: '#000',
                    }}>July 2025</ThemedText>
                    <TouchableOpacity style={{ padding: 2 }}>
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
        <TransactionView 
          transactions={transactions} 
          addTransaction={addTransaction} 
        />
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
