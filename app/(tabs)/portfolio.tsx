import React, { useState } from "react";
import { StyleSheet, ScrollView, TouchableOpacity, View, Text, FlatList } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useExpenses } from "@/hooks/useExpenses";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { TransactionUploadModal } from "@/components/TransactionUploadModal";

type TabType = 'networth' | 'account' | 'transactions';

export default function PortfolioScreen() {
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState<TabType>('networth');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { transactions, accounts, netWorth, getSpendingByCategory, addTransaction } = useExpenses();

  const renderTabButton = (tab: TabType, title: string) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tab && styles.activeTabButton,
        { backgroundColor: activeTab === tab ? Colors[colorScheme ?? 'light'].tint : 'transparent' }
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <ThemedText
        style={[
          styles.tabButtonText,
          activeTab === tab && styles.activeTabButtonText
        ]}
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  );

  const renderNetWorth = () => (
    <ScrollView style={styles.content}>
      <View style={styles.netWorthCard}>
        <ThemedText type="title" style={styles.netWorthTitle}>
          Net Worth
        </ThemedText>
        <ThemedText type="title" style={styles.netWorthAmount}>
          ${netWorth.netWorth.toLocaleString()}
        </ThemedText>
        <View style={styles.netWorthChange}>
          <ThemedText style={[styles.changeText, { color: netWorth.monthlyChange >= 0 ? '#4CAF50' : '#F44336' }]}>
            {netWorth.monthlyChange >= 0 ? '+' : ''}${netWorth.monthlyChange.toLocaleString()} 
            ({netWorth.monthlyChangePercent >= 0 ? '+' : ''}{netWorth.monthlyChangePercent.toFixed(1)}%)
          </ThemedText>
          <ThemedText style={styles.changeLabel}>This month</ThemedText>
        </View>
      </View>

      <View style={styles.summaryCards}>
        <View style={[styles.summaryCard, { backgroundColor: '#E8F5E8' }]}>
          <ThemedText style={styles.summaryLabel}>Total Assets</ThemedText>
          <ThemedText type="title" style={styles.summaryAmount}>
            ${netWorth.totalAssets.toLocaleString()}
          </ThemedText>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#FFEBEE' }]}>
          <ThemedText style={styles.summaryLabel}>Total Liabilities</ThemedText>
          <ThemedText type="title" style={styles.summaryAmount}>
            ${Math.abs(netWorth.totalLiabilities).toLocaleString()}
          </ThemedText>
        </View>
      </View>

      {/* Spending by Category */}
      <View style={styles.spendingSection}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Spending by Category
        </ThemedText>
        {getSpendingByCategory().map((category) => (
          <View key={category.category} style={styles.categoryCard}>
            <View style={styles.categoryInfo}>
              <ThemedText type="title" style={styles.categoryName}>
                {category.category}
              </ThemedText>
              <ThemedText style={styles.categoryCount}>
                {category.count} transactions
              </ThemedText>
            </View>
            <ThemedText type="title" style={styles.categoryAmount}>
              ${category.total.toFixed(2)}
            </ThemedText>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderAccounts = () => (
    <ScrollView style={styles.content}>
      {accounts.map((account) => (
        <View key={account.id} style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <ThemedText type="title" style={styles.accountName}>
              {account.name}
            </ThemedText>
            <ThemedText style={styles.accountNumber}>
              {account.accountNumber}
            </ThemedText>
          </View>
          <ThemedText 
            type="title" 
            style={[
              styles.accountBalance,
              { color: account.balance >= 0 ? '#4CAF50' : '#F44336' }
            ]}
          >
            {account.balance >= 0 ? '+' : ''}${account.balance.toLocaleString()}
          </ThemedText>
        </View>
      ))}
    </ScrollView>
  );

  const renderTransactions = () => (
    <View style={styles.transactionsContainer}>
      <View style={styles.transactionsHeader}>
        <ThemedText type="title" style={styles.transactionsTitle}>
          Recent Transactions
        </ThemedText>
        <View style={styles.transactionButtons}>
          <TouchableOpacity
            style={[
              styles.uploadButton,
              { backgroundColor: Colors[colorScheme ?? 'light'].tint }
            ]}
            onPress={() => setShowUploadModal(true)}
          >
            <ThemedText style={styles.uploadButtonText}> Upload</ThemedText>
          </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: Colors[colorScheme ?? 'light'].tint }
          ]}
          onPress={() => setShowAddModal(true)}
        >
          <ThemedText style={styles.addButtonText}>+ Add</ThemedText>
        </TouchableOpacity>
        </View>
      </View>
      <FlatList
        style={styles.transactionsList}
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionCard}>
            <View style={styles.transactionLeft}>
              <Text style={styles.transactionIcon}>{item.icon}</Text>
              <View style={styles.transactionDetails}>
                <ThemedText type="title" style={styles.transactionMerchant}>
                  {item.merchant}
                </ThemedText>
                <ThemedText style={styles.transactionCategory}>
                  {item.category}
                </ThemedText>
                <ThemedText style={styles.transactionDate}>
                  {new Date(item.date).toLocaleDateString()}
                </ThemedText>
              </View>
            </View>
            <View style={styles.transactionRight}>
              <ThemedText type="title" style={styles.transactionAmount}>
                -${item.amount.toFixed(2)}
              </ThemedText>
              <ThemedText style={styles.transactionStatus}>
                {item.status}
              </ThemedText>
            </View>
          </View>
        )}
      />
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Portfolio
        </ThemedText>
      </View>

      <View style={styles.tabContainer}>
        {renderTabButton('networth', 'Net Worth')}
        {renderTabButton('account', 'Account')}
        {renderTabButton('transactions', 'Transactions')}
      </View>

      {activeTab === 'networth' && renderNetWorth()}
      {activeTab === 'account' && renderAccounts()}
      {activeTab === 'transactions' && renderTransactions()}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTabButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabButtonText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  netWorthCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  netWorthTitle: {
    fontSize: 18,
    marginBottom: 8,
    opacity: 0.7,
  },
  netWorthAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  netWorthChange: {
    alignItems: 'center',
  },
  changeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  changeLabel: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  accountCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  accountHeader: {
    marginBottom: 12,
  },
  accountName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    opacity: 0.6,
  },
  accountBalance: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  transactionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionMerchant: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    opacity: 0.5,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
    marginBottom: 2,
  },
  transactionStatus: {
    fontSize: 12,
    opacity: 0.6,
  },
  spendingSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
    opacity: 0.6,
  },
  categoryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
  },
  transactionsContainer: {
    flex: 1,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  transactionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  transactionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  uploadButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
