import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View, Text } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Icon } from "@/components/Icon";

interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  icon: string;
  category: string;
  status: string;
}

interface TransactionViewProps {
  transactions: Transaction[];
  addTransaction: (transaction: any) => void;
}

export function TransactionView({ transactions, addTransaction }: TransactionViewProps) {
  // Helper function to group transactions by date
  const groupTransactionsByDate = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const groups: { title: string; data: any[] }[] = [];
    
    // Filter transactions by today
    const todayTransactions = transactions.filter(t => t.date === todayStr);
    if (todayTransactions.length > 0) {
      groups.push({ title: 'Today', data: todayTransactions });
    }
    
    // Filter transactions by yesterday
    const yesterdayTransactions = transactions.filter(t => t.date === yesterdayStr);
    if (yesterdayTransactions.length > 0) {
      groups.push({ title: 'Yesterday', data: yesterdayTransactions });
    }
    
    return groups;
  };

  // Calculate summary data
  const getSummaryData = () => {
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const currentDate = new Date();
      return transactionDate.getMonth() === currentDate.getMonth() && 
             transactionDate.getFullYear() === currentDate.getFullYear();
    });
    
    const expenses = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
    const income = 1000; // This should come from income data
    const balance = income - expenses;
    
    return { income, expenses, balance };
  };

  const summaryData = getSummaryData();
  const groupedTransactions = groupTransactionsByDate();

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* Grouped Transactions - hero section now in parent */}
      {groupedTransactions.map((group) => (
        <View key={group.title} style={{
          paddingHorizontal: 20,
          marginBottom: 20,
        }}>
          <ThemedText style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 12,
          }}>{group.title}</ThemedText>
          {group.data.map((transaction) => (
            <View key={transaction.id} style={{
              backgroundColor: '#FFF',
              borderRadius: 12,
              padding: 16,
              marginBottom: 8,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#F5F5F5',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}>
                <Text style={{
                  fontSize: 24,
                  marginRight: 12,
                }}>{transaction.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={{
                  fontSize: 16,
                  fontWeight: '600',
                  marginBottom: 2,
                }}>
                  {transaction.merchant}
                </ThemedText>
                <ThemedText style={{
                  fontSize: 12,
                  opacity: 0.6,
                }}>
                  Syncing....
                </ThemedText>
                <ThemedText style={{
                  fontSize: 12,
                  color: '#999',
                  marginTop: 2,
                }}>
                  Update 4 minutes ago
                </ThemedText>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <ThemedText style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginBottom: 8,
                }}>
                  ${transaction.amount}
                </ThemedText>
                <TouchableOpacity style={{
                  backgroundColor: '#936DFF',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                }}>
                  <ThemedText style={{
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: '600',
                  }}>Detail</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
} 