import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Transaction } from '@/hooks/useExpenses';
import { API_ENDPOINTS } from '@/lib/config';

interface DetectedTransaction {
  date: string;
  description: string;
  amount: number;
  category: string;
  accountId: string;
}

interface TransactionGroup {
  date: string;
  transactions: DetectedTransaction[];
}

interface TransactionUploadModalProps {
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

export const TransactionUploadModal: React.FC<TransactionUploadModalProps> = ({
  visible,
  onClose,
  onAddTransaction,
  accounts,
}) => {
  const colorScheme = useColorScheme();
  const [selectedFile, setSelectedFile] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [detectedTransactions, setDetectedTransactions] = useState<DetectedTransaction[]>([]);
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id || '');

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedFile({
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || 'application/pdf'
        });
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedFile({
        uri: result.assets[0].uri,
        name: 'image.jpg',
        type: 'image/jpeg'
      });
    }
  };

  const handleDeleteFile = () => {
    setSelectedFile(null);
    setDetectedTransactions([]);
    setShowReview(false);
    setSelectedAccount(accounts[0]?.id || '');
  };

  const handleUploadFile = async () => {
    if (!selectedFile) {
      Alert.alert('Error', 'No file selected');
      return;
    }
    await processDocument(selectedFile.uri, selectedFile.type);
  };

  const processDocument = async (fileUri: string, mimeType: string) => {
    setIsProcessing(true);
    
    try {
      // Convert file to base64
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      // Remove data URL prefix to get just the base64 content
      const base64Content = base64.split(',')[1];

      // Send to backend using the configured endpoint
      const backendResponse = await fetch(API_ENDPOINTS.DOCUMENT_AI.PROCESS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentContent: base64Content,
          mimeType: mimeType,
        }),
      });

      const result = await backendResponse.json();

      if (result.success && result.transactions && result.transactions.length > 0) {
        // Add default category and account to each transaction
        const transactionsWithDefaults = result.transactions.map((transaction: any) => ({
          ...transaction,
          category: categories[0].name,
          accountId: accounts[0]?.id || ''
        }));
        
        setDetectedTransactions(transactionsWithDefaults);
        setSelectedAccount(accounts[0]?.id || '');
        setShowReview(true);
      } else {
        Alert.alert('Error', 'No transaction data found in the document. Please try again.');
      }
    } catch (error) {
      console.error('Error processing document:', error);
      Alert.alert('Error', 'Failed to process document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmAllTransactions = () => {
    if (!selectedAccount) {
      Alert.alert('Error', 'Please select an account');
      return;
    }

    // Add all transactions
    detectedTransactions.forEach(transaction => {
      const category = categories.find(cat => cat.name === transaction.category);
      const newTransaction: Omit<Transaction, 'id'> = {
        merchant: transaction.description,
        amount: Math.abs(transaction.amount), // Use absolute value for storage
        date: transaction.date,
        category: transaction.category,
        status: 'Completed',
        icon: category?.icon || '📝',
        accountId: selectedAccount,
      };

      onAddTransaction(newTransaction);
    });
    
    // Reset and close
    setSelectedFile(null);
    setDetectedTransactions([]);
    setShowReview(false);
    setSelectedAccount(accounts[0]?.id || '');
    onClose();
  };

  const handleDeleteTransaction = (index: number) => {
    const updatedTransactions = detectedTransactions.filter((_, i) => i !== index);
    setDetectedTransactions(updatedTransactions);
    
    if (updatedTransactions.length === 0) {
      setShowReview(false);
    }
  };

  const handleUpdateTransaction = (index: number, field: keyof DetectedTransaction, value: string) => {
    const updatedTransactions = [...detectedTransactions];
    updatedTransactions[index] = {
      ...updatedTransactions[index],
      [field]: field === 'amount' ? parseFloat(value) || 0 : value
    };
    setDetectedTransactions(updatedTransactions);
  };

  const handleRetake = () => {
    setSelectedFile(null);
    setDetectedTransactions([]);
    setShowReview(false);
    setSelectedAccount(accounts[0]?.id || '');
  };

  // Group transactions by date
  const groupedTransactions = detectedTransactions.reduce((groups: TransactionGroup[], transaction) => {
    const existingGroup = groups.find(group => group.date === transaction.date);
    if (existingGroup) {
      existingGroup.transactions.push(transaction);
    } else {
      groups.push({
        date: transaction.date,
        transactions: [transaction]
      });
    }
    return groups;
  }, []);

  const renderTransactionItem = ({ item, index }: { item: DetectedTransaction; index: number }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionHeader}>
        <ThemedText style={styles.transactionDescription}>
          {item.description}
        </ThemedText>
        <TouchableOpacity
          onPress={() => handleDeleteTransaction(index)}
          style={styles.deleteButton}
        >
          <ThemedText style={styles.deleteButtonText}>🗑️</ThemedText>
        </TouchableOpacity>
      </View>
      
      <View style={styles.transactionDetails}>
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Category</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.name}
                style={[
                  styles.categoryButton,
                  item.category === category.name && styles.selectedCategoryButton,
                  { borderColor: Colors[colorScheme].border }
                ]}
                onPress={() => handleUpdateTransaction(index, 'category', category.name)}
              >
                <ThemedText style={styles.categoryIcon}>{category.icon}</ThemedText>
                <ThemedText style={styles.categoryText}>{category.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.amountContainer}>
          <ThemedText style={styles.label}>Amount</ThemedText>
          <ThemedText style={[
            styles.amountText,
            { color: item.amount < 0 ? '#F44336' : '#4CAF50' }
          ]}>
            {item.amount < 0 ? '-' : '+'}${Math.abs(item.amount).toFixed(2)}
          </ThemedText>
        </View>
      </View>
    </View>
  );

  const renderDateGroup = ({ item }: { item: TransactionGroup }) => (
    <View style={styles.dateGroup}>
      <ThemedText style={styles.dateHeader}>
        {new Date(item.date).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </ThemedText>
      {item.transactions.map((transaction, index) => {
        const globalIndex = detectedTransactions.findIndex(t => 
          t.date === transaction.date && 
          t.description === transaction.description && 
          t.amount === transaction.amount
        );
        return (
          <View key={`${transaction.date}-${index}`}>
            {renderTransactionItem({ item: transaction, index: globalIndex })}
          </View>
        );
      })}
    </View>
  );

  if (showReview) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Review Transactions ({detectedTransactions.length})
            </ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <ThemedText style={styles.closeButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {/* Account Selection */}
            <View style={styles.accountSelection}>
              <ThemedText style={styles.label}>Account</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountContainer}>
                {accounts.map((account) => (
                  <TouchableOpacity
                    key={account.id}
                    style={[
                      styles.accountButton,
                      selectedAccount === account.id && styles.selectedAccountButton,
                      { borderColor: Colors[colorScheme].border }
                    ]}
                    onPress={() => setSelectedAccount(account.id)}
                  >
                    <ThemedText style={styles.accountText}>{account.name}</ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Transactions List */}
            <FlatList
              data={groupedTransactions}
              renderItem={renderDateGroup}
              keyExtractor={(item) => item.date}
              style={styles.transactionsList}
              showsVerticalScrollIndicator={false}
            />

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleRetake} style={styles.secondaryButton}>
                <ThemedText style={styles.secondaryButtonText}>Retake</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirmAllTransactions} style={styles.primaryButton}>
                <ThemedText style={styles.primaryButtonText}>Add All Transactions</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ThemedView>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Upload Bank Statement
          </ThemedText>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <ThemedText style={styles.closeButtonText}>Cancel</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color={Colors[colorScheme].primary} />
              <ThemedText style={styles.processingText}>Processing statement...</ThemedText>
            </View>
          ) : selectedFile ? (
            <View style={styles.fileContainer}>
              <ThemedText style={styles.fileName}>{selectedFile.name}</ThemedText>
              {selectedFile.type.startsWith('image/') && (
                <Image source={{ uri: selectedFile.uri }} style={styles.filePreview} />
              )}
              
              {/* File Action Buttons */}
              <View style={styles.fileActionButtons}>
                <TouchableOpacity onPress={handleDeleteFile} style={styles.deleteButton}>
                  <ThemedText style={styles.deleteButtonText}>🗑️ Delete</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleUploadFile} style={styles.uploadActionButton}>
                  <ThemedText style={styles.uploadActionButtonText}> Upload & Process</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.uploadContainer}>
              <ThemedText style={styles.uploadTitle}>Upload Bank Statement</ThemedText>
              <ThemedText style={styles.uploadSubtitle}>
                Upload a PDF bank statement or image to automatically extract transactions
              </ThemedText>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={pickDocument} style={styles.primaryButton}>
                  <ThemedText style={styles.primaryButtonText}>Upload PDF/Image</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={pickImage} style={styles.secondaryButton}>
                  <ThemedText style={styles.secondaryButtonText}>Choose from Gallery</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
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
  uploadContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  uploadTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  uploadSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.7,
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    marginTop: 20,
    fontSize: 16,
  },
  fileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  fileName: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
  },
  filePreview: {
    width: 300,
    height: 400,
    borderRadius: 12,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  fileActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 16,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadActionButton: {
    backgroundColor: '#34C759',
    borderRadius: 8,
    padding: 16,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  uploadActionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  accountSelection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  accountContainer: {
    flexDirection: 'row',
  },
  accountButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    alignItems: 'center',
  },
  selectedAccountButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  accountText: {
    fontSize: 14,
  },
  transactionsList: {
    flex: 1,
    marginBottom: 20,
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#666',
  },
  transactionItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  inputGroup: {
    flex: 1,
    marginRight: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 60,
  },
  selectedCategoryButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 10,
    textAlign: 'center',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 