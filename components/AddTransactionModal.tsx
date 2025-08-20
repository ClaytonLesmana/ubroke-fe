import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Transaction } from '@/hooks/useExpenses';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  accounts: Array<{ id: string; name: string }>;
}

const categories = [
  { name: 'Food & Drink', icon: '🍽️' },
  { name: 'Transportation', icon: '🚗' },
  { name: 'Shopping', icon: '🛍️' },
  { name: 'Entertainment', icon: '🎬' },
  { name: 'Bills & Utilities', icon: '💡' },
  { name: 'Healthcare', icon: '🏥' },
  { name: 'Education', icon: '📚' },
  { name: 'Travel', icon: '✈️' },
  { name: 'Other', icon: '📝' },
];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  visible,
  onClose,
  onAddTransaction,
  accounts,
}) => {
  const colorScheme = useColorScheme();
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0].name);
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id || '');

  const handleAddTransaction = () => {
    if (!merchant.trim() || !amount.trim() || !selectedAccount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const category = categories.find(cat => cat.name === selectedCategory);
    const newTransaction: Omit<Transaction, 'id'> = {
      merchant: merchant.trim(),
      amount: amountValue,
      date: new Date().toISOString().split('T')[0],
      category: selectedCategory,
      status: 'Completed',
      icon: category?.icon || '📝',
      accountId: selectedAccount,
    };

    onAddTransaction(newTransaction);
    
    // Reset form
    setMerchant('');
    setAmount('');
    setSelectedCategory(categories[0].name);
    setSelectedAccount(accounts[0]?.id || '');
    
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Add Transaction
          </ThemedText>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <ThemedText style={styles.closeButtonText}>Cancel</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Merchant Input */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Merchant</ThemedText>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: Colors[colorScheme ?? 'light'].background,
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: Colors[colorScheme ?? 'light'].icon,
                }
              ]}
              value={merchant}
              onChangeText={setMerchant}
              placeholder="Enter merchant name"
              placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
            />
          </View>

          {/* Amount Input */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Amount</ThemedText>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: Colors[colorScheme ?? 'light'].background,
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: Colors[colorScheme ?? 'light'].icon,
                }
              ]}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Category Selection */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Category</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.name}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.name && styles.selectedCategoryButton,
                    { 
                      backgroundColor: selectedCategory === category.name 
                        ? Colors[colorScheme ?? 'light'].tint 
                        : Colors[colorScheme ?? 'light'].background,
                      borderColor: Colors[colorScheme ?? 'light'].icon,
                    }
                  ]}
                  onPress={() => setSelectedCategory(category.name)}
                >
                  <ThemedText style={styles.categoryIcon}>{category.icon}</ThemedText>
                  <ThemedText 
                    style={[
                      styles.categoryText,
                      { 
                        color: selectedCategory === category.name 
                          ? '#fff' 
                          : Colors[colorScheme ?? 'light'].text 
                      }
                    ]}
                  >
                    {category.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Account Selection */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Account</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountScroll}>
              {accounts.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={[
                    styles.accountButton,
                    selectedAccount === account.id && styles.selectedAccountButton,
                    { 
                      backgroundColor: selectedAccount === account.id 
                        ? Colors[colorScheme ?? 'light'].tint 
                        : Colors[colorScheme ?? 'light'].background,
                      borderColor: Colors[colorScheme ?? 'light'].icon,
                    }
                  ]}
                  onPress={() => setSelectedAccount(account.id)}
                >
                  <ThemedText 
                    style={[
                      styles.accountText,
                      { 
                        color: selectedAccount === account.id 
                          ? '#fff' 
                          : Colors[colorScheme ?? 'light'].text 
                      }
                    ]}
                  >
                    {account.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>

        {/* Add Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: Colors[colorScheme ?? 'light'].tint }
            ]}
            onPress={handleAddTransaction}
          >
            <ThemedText style={styles.addButtonText}>Add Transaction</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  categoryScroll: {
    marginTop: 8,
  },
  categoryButton: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  selectedCategoryButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    textAlign: 'center',
  },
  accountScroll: {
    marginTop: 8,
  },
  accountButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    minWidth: 120,
  },
  selectedAccountButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  accountText: {
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 