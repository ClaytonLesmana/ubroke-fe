import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View, Text } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Icon } from "@/components/Icon";
import { CategoryIcon, CategoryType, getCategoryFromTransaction } from "@/components/CategoryIcon";
import { useRouter } from 'expo-router';

interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string; // ISO yyyy-mm-dd
  icon: string;
  category?: CategoryType | string; // allow external data without strict typing
  status: string;
}

interface TransactionViewProps {
  transactions: Transaction[];
  addTransaction: (transaction: any) => void;
}

// Runtime whitelist of valid categories to validate incoming data
const VALID_CATEGORIES: readonly CategoryType[] = [
  'taxes','vacation','taxi','publicTransport','groceries','carMaintenance','donation','eatingOut','flights','miscellaneous','interest','date','maintenance','rent','drinks','telephone','gifts','shopping','internet','water','hobby','health','subscription','coffee','education','sports','entertainment','gym','income','electricity'
] as const;

function isValidCategory(value: unknown): value is CategoryType {
  if (typeof value !== 'string') return false;
  const normalized = value.toLowerCase() as string;
  // Map possible titlecase inputs to lowercase for comparison, then check exact match in VALID_CATEGORIES (which include lowercase keys except camelCase ones)
  // Normalize known camelCase by rebuilding from lowercase tokens where applicable
  const candidates: string[] = [normalized];
  // Allow common aliases
  const aliasMap: Record<string, CategoryType> = {
    uber: 'taxi',
    transit: 'publicTransport',
    transport: 'publicTransport',
    subscription: 'subscription',
  };
  if (aliasMap[normalized]) return true;
  return VALID_CATEGORIES.includes(value as CategoryType);
}

export function TransactionView({ transactions, addTransaction }: TransactionViewProps) {
  const router = useRouter();
  // Establish fallback dummy transactions when none are provided
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

  const dummyTransactions: Transaction[] = [
    { id: 't1', merchant: 'Grocery Mart', amount: 82.35, date: todayStr, icon: 'G', category: 'groceries', status: 'posted' },
    { id: 't2', merchant: 'City Transport', amount: 2.75, date: todayStr, icon: 'T', category: 'publicTransport', status: 'posted' },
    { id: 't3', merchant: 'Coffee Shop', amount: 4.50, date: yesterdayStr, icon: 'C', category: 'coffee', status: 'posted' },
    { id: 't4', merchant: 'Streaming Service', amount: 12.99, date: yesterdayStr, icon: 'S', category: 'subscription', status: 'pending' },
  ];

  const rawTransactions = transactions && transactions.length > 0 ? transactions : dummyTransactions;

  // Normalize categories: if provided but invalid, derive from merchant name
  const sourceTransactions: (Omit<Transaction, 'category'> & { category: CategoryType })[] = rawTransactions.map(t => {
    const provided = typeof t.category === 'string' ? t.category : '';
    const normalizedProvided = provided ? (provided as string).trim() : '';
    const finalCategory: CategoryType = isValidCategory(normalizedProvided) 
      ? (normalizedProvided as CategoryType)
      : getCategoryFromTransaction(t.merchant);
    return { ...(t as any), category: finalCategory };
  });

  const formatDateHeader = (dateStr: string) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = dateStr === today.toISOString().split('T')[0];
    const isYesterday = dateStr === yesterday.toISOString().split('T')[0];

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';

    const d = new Date(dateStr + 'T00:00:00');
    const formatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    return formatter.format(d);
  };

  // Helper function to group transactions by exact date (ISO yyyy-mm-dd)
  const groupTransactionsByDate = () => {
    const map: Record<string, typeof sourceTransactions> = {} as any;
    for (const t of sourceTransactions) {
      if (!map[t.date]) map[t.date] = [] as any;
      (map[t.date] as any).push(t);
    }
    const sortedDates = Object.keys(map).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    return sortedDates.map(dateKey => ({ title: formatDateHeader(dateKey), data: map[dateKey] }));
  };

  // Calculate summary data
  const getSummaryData = () => {
    const currentMonthTransactions = sourceTransactions.filter(t => {
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
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 140 }}>
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
            <TouchableOpacity key={transaction.id} activeOpacity={0.8} onPress={() => router.push({ pathname: '/transactions/[id]', params: { id: transaction.id } })}>
              <View style={{
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
                  <CategoryIcon category={transaction.category as CategoryType} size={22} color="#936DFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 2,
                  }}>
                    {transaction.merchant}
                  </ThemedText>
                  {/* <ThemedText style={{
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
                  </ThemedText> */}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <ThemedText style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginBottom: 8,
                  }}>
                    ${transaction.amount}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
} 