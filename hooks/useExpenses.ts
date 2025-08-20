import { useState, useCallback, useMemo } from 'react';

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category: string;
  status: 'Completed' | 'Pending' | 'Failed';
  icon: string;
  accountId?: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  accountNumber: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
}

export interface NetWorth {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  monthlyChange: number;
  monthlyChangePercent: number;
}

// Initial mock data
const initialTransactions: Transaction[] = [
  {
    id: '1',
    merchant: 'Netflix',
    amount: 15.99,
    date: '2024-01-15',
    category: 'Entertainment',
    status: 'Completed',
    icon: '🎬',
    accountId: '1'
  },
  {
    id: '2',
    merchant: 'Starbucks',
    amount: 4.50,
    date: '2024-01-15',
    category: 'Food & Drink',
    status: 'Completed',
    icon: '☕',
    accountId: '1'
  },
  {
    id: '3',
    merchant: 'Amazon',
    amount: 89.99,
    date: '2024-01-14',
    category: 'Shopping',
    status: 'Completed',
    icon: '📦',
    accountId: '3'
  },
  {
    id: '4',
    merchant: 'Uber',
    amount: 12.75,
    date: '2024-01-14',
    category: 'Transportation',
    status: 'Completed',
    icon: '🚗',
    accountId: '1'
  },
  {
    id: '5',
    merchant: 'Spotify',
    amount: 9.99,
    date: '2024-01-13',
    category: 'Entertainment',
    status: 'Completed',
    icon: '🎵',
    accountId: '3'
  }
];

const initialAccounts: Account[] = [
  {
    id: '1',
    name: 'Checking Account',
    balance: 2450.67,
    accountNumber: '****1234',
    type: 'checking'
  },
  {
    id: '2',
    name: 'Savings Account',
    balance: 12500.00,
    accountNumber: '****5678',
    type: 'savings'
  },
  {
    id: '3',
    name: 'Credit Card',
    balance: -1250.45,
    accountNumber: '****9012',
    type: 'credit'
  }
];

export const useExpenses = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);

  // Calculate net worth based on accounts
  const netWorth = useMemo((): NetWorth => {
    const totalAssets = accounts
      .filter(account => account.balance > 0)
      .reduce((sum, account) => sum + account.balance, 0);
    
    const totalLiabilities = accounts
      .filter(account => account.balance < 0)
      .reduce((sum, account) => sum + Math.abs(account.balance), 0);
    
    const netWorthValue = totalAssets - totalLiabilities;
    
    // Mock monthly change calculation
    const monthlyChange = 1250.45; // This would be calculated from historical data
    const monthlyChangePercent = totalAssets > 0 ? (monthlyChange / totalAssets) * 100 : 0;
    
    return {
      totalAssets,
      totalLiabilities,
      netWorth: netWorthValue,
      monthlyChange,
      monthlyChangePercent
    };
  }, [accounts]);

  // Add new transaction
  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update account balance if accountId is provided
    if (transaction.accountId) {
      setAccounts(prev => prev.map(account => 
        account.id === transaction.accountId 
          ? { ...account, balance: account.balance - transaction.amount }
          : account
      ));
    }
  }, []);

  // Add new account
  const addAccount = useCallback((account: Omit<Account, 'id'>) => {
    const newAccount: Account = {
      ...account,
      id: Date.now().toString(),
    };
    setAccounts(prev => [...prev, newAccount]);
  }, []);

  // Update account balance
  const updateAccountBalance = useCallback((accountId: string, newBalance: number) => {
    setAccounts(prev => prev.map(account => 
      account.id === accountId 
        ? { ...account, balance: newBalance }
        : account
    ));
  }, []);

  // Get transactions by date range
  const getTransactionsByDateRange = useCallback((startDate: string, endDate: string) => {
    return transactions.filter(transaction => 
      transaction.date >= startDate && transaction.date <= endDate
    );
  }, [transactions]);

  // Get transactions by category
  const getTransactionsByCategory = useCallback((category: string) => {
    return transactions.filter(transaction => transaction.category === category);
  }, [transactions]);

  // Get total spending by category
  const getSpendingByCategory = useCallback(() => {
    const categoryTotals: Record<string, number> = {};
    
    transactions.forEach(transaction => {
      if (categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] += transaction.amount;
      } else {
        categoryTotals[transaction.category] = transaction.amount;
      }
    });
    
    return Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      total,
      count: transactions.filter(t => t.category === category).length
    }));
  }, [transactions]);

  // Get recent transactions (last 7 days)
  const getRecentTransactions = useCallback(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoString = sevenDaysAgo.toISOString().split('T')[0];
    
    return transactions.filter(transaction => transaction.date >= sevenDaysAgoString);
  }, [transactions]);

  return {
    transactions,
    accounts,
    netWorth,
    addTransaction,
    addAccount,
    updateAccountBalance,
    getTransactionsByDateRange,
    getTransactionsByCategory,
    getSpendingByCategory,
    getRecentTransactions,
  };
}; 