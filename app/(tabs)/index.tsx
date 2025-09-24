import React, { useState } from "react";
import { ScrollView, StyleSheet, Alert, View, TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { AppColors } from "@/constants/Colors";
import { Image } from "expo-image";
import { Icon } from "@/components/Icon";
import { useRouter } from "expo-router";

// Import all the new components
import { JourneyCard } from "@/components/home/JourneyCard";
import { CombinedCard } from "@/components/home/CombinedCard";
import { BudgetCard } from "@/components/home/BudgetCard";
import { BillsCard } from "@/components/home/BillsCard";
import { GoalsCard } from "@/components/home/GoalsCard";
import { PaydayCard } from "@/components/home/PaydayCard";
import { AddPaydayModal } from "@/components/AddPaydayModal";


export default function HomePage() {
  const router = useRouter();
  const [showAddPaydayModal, setShowAddPaydayModal] = useState(false);
  
  // Example of how backend data would look:
  // const backendSpendingData = [
  //   { categoryId: "food", name: "Food & Dining", amount: 423.50, color: "#EF4444", transactions: 15 },
  //   { categoryId: "transport", name: "Transportation", amount: 287.25, color: "#10B981", transactions: 8 },
  //   { categoryId: "housing", name: "Housing & Rent", amount: 1200.00, color: "#8B5CF6", transactions: 1 },
  //   { categoryId: "entertainment", name: "Entertainment", amount: 156.75, color: "#F59E0B", transactions: 12 },
  //   { categoryId: "shopping", name: "Shopping", amount: 89.30, color: "#EF4444", transactions: 6 },
  //   { categoryId: "healthcare", name: "Healthcare", amount: 45.20, color: "#06B6D4", transactions: 2 },
  //   { categoryId: "utilities", name: "Utilities", amount: 78.90, color: "#84CC16", transactions: 3 },
  // ];

  // Dummy data for all components (simulating backend response)
  const spendingCategories = [
    { name: "Food & Dining", amount: 423.50, color: "#EF4444" },
    { name: "Transportation", amount: 287.25, color: "#10B981" },
    { name: "Housing & Rent", amount: 1200.00, color: AppColors.primary[300] },
    { name: "Entertainment", amount: 156.75, color: "#F59E0B" },
    { name: "Shopping", amount: 89.30, color: "#8B5CF6" },
    { name: "Healthcare", amount: 45.20, color: "#06B6D4" },
  ];

  const cashflowData = {
    income: 1000,
    expenses: 200,
    left: 800,
  };

  const budgetGroups = [
    {
      frequency: 'weekly' as const,
      daysLeft: 3,
      budgets: [
        {
    name: "Groceries",
    spent: 66,
    budget: 150,
    icon: "🛒",
          frequency: 'weekly' as const,
          category: 'groceries' as const,
        },
        {
          name: "Transport",
          spent: 25,
          budget: 50,
          icon: "🚗",
          frequency: 'weekly' as const,
          category: 'carMaintenance' as const,
        },
      ],
    },
    {
      frequency: 'fortnightly' as const,
      daysLeft: 8,
      budgets: [
        {
          name: "Entertainment",
          spent: 120,
          budget: 200,
          icon: "🎬",
          frequency: 'fortnightly' as const,
          category: 'entertainment' as const,
        },
      ],
    },
    {
      frequency: 'monthly' as const,
      daysLeft: 15,
      budgets: [
        {
          name: "Shopping",
          spent: 300,
          budget: 500,
          icon: "🛍️",
          frequency: 'monthly' as const,
          category: 'shopping' as const,
        },
        {
          name: "Utilities",
          spent: 150,
          budget: 200,
          icon: "⚡",
          frequency: 'monthly' as const,
          category: 'electricity' as const,
        },
      ],
    },
  ];

  const bills = [
    { name: "Netflix", dueDate: "Oct 20", amount: 15 },
    { name: "Spotify Premium", dueDate: "Oct 20", amount: 15 },
    { name: "YT Premium", dueDate: "Oct 20", amount: 15 },
    { name: "Health Insurance", dueDate: "Oct 20", amount: 25 },
  ];

  const goals = [
    { name: "Coachella", current: 200, target: 500 },
    { name: "Buy a Car", current: 1000, target: 30000 },
    { name: "Married", current: 500, target: 3000 },
  ];

  const incomeSources = [
    { name: "Main Job", amount: 1200, payday: "Oct 16" },
    { name: "Second Job", amount: 800, payday: "Oct 16" },
  ];

  const quickActions = [
    { icon: "📄", title: "Add Expense", onPress: () => Alert.alert("Add Expense", "Open expense form") },
    { icon: "📁", title: "Upload Statement", onPress: () => Alert.alert("Upload Statement", "Open file picker") },
    { icon: "🎯", title: "Set Goal", onPress: () => Alert.alert("Set Goal", "Open goal creation form") },
  ];

  // Event handlers
  const handleViewAnalytics = () => Alert.alert("View Analytics", "Navigate to analytics page");
  const handleViewBudget = () => Alert.alert("View Budget", "Navigate to budget page");
  const handleAddBills = () => Alert.alert("Add Bills", "Open bill creation form");
  const handleAddGoals = () => Alert.alert("Add Goals", "Open goal creation form");
  const handleAddIncome = () => setShowAddPaydayModal(true);
  const handleUpdateIncome = (index: number) => Alert.alert("Update Income", `Update income source ${index + 1}`);
    const handleTapToDigDeeper = () => Alert.alert("Dig Deeper", "Navigate to detailed spending analysis");
  
  const handleSavePayday = (items: any[]) => {
    console.log("Saved payday items:", items);
    Alert.alert("Success", `Added ${items.length} payday item(s)`);
    setShowAddPaydayModal(false);
  };
  
  return (
    <ThemedView style={styles.container}>
      <Image 
        source={require('@/assets/images/chatBackground.png')} 
        style={styles.backgroundImage}
        contentFit="cover"
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between', // Changed from 'space-evenly'
          alignItems: 'center',
          position: 'relative',
          marginBottom: 16,
          minHeight: 150, // Changed to minHeight for flexibility
          borderBottomRightRadius: 32,
          borderBottomLeftRadius: 32,
          paddingHorizontal: 20,
          paddingTop: 65,
          paddingBottom: 20, // Increased padding bottom
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 8,
          backgroundColor: AppColors.gray[0],
        }}>
          {/* Left side - User info */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1, // Allow it to take available space
          }}>
            <View style={{
              marginRight: 12,
            }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: AppColors.primary[200],
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ThemedText style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: AppColors.gray[0],
                }}>L</ThemedText>
              </View>
            </View>
            <View style={{
              flex: 1,
            }}>
              <ThemedText style={{
                fontSize: 18,
                fontWeight: '700',
                color: AppColors.gray[500],
              }}>Hi, Laura 👋</ThemedText>
            </View>
          </View>
          
          {/* Right side - Action buttons */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center', // Ensure vertical centering
            gap: 12,
          }}>
            <TouchableOpacity 
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: AppColors.gray[100],
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => Alert.alert("Notifications", "Open notifications")}
            >
              <View style={{
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Icon
                  name="notificationIcon"
                  size={16}
                  color={AppColors.gray[500]}
                />
                <View style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#EF4444',
                }} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: AppColors.gray[100],
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => Alert.alert("Settings", "Open settings")}
            >
              <Icon
                name="settingsIcon"
                size={18}
                color={AppColors.gray[500]}
              />
            </TouchableOpacity>
          </View>
        </View>

        <JourneyCard 
          currentAmount={700000}
          targetAmount={1000000}
          onViewAnalytics={handleViewAnalytics}
        />

        <CombinedCard 
          spendingCategories={spendingCategories}
          cashflowData={cashflowData}
          selectedMonth="August"
          selectedYear="2025"
          transactionCount={5}
          onMonthChange={(month, year) => {
            console.log(`Month changed to ${month} ${year}`);
            // Here you would typically fetch new data for the selected month
          }}
          onTapToDigDeeper={() => router.push('/(tabs)/cashflow-details')}
          onSeeCashflowDetails={() => router.push('/(tabs)/cashflow-details')}
        />

        <BudgetCard 
          budgetGroups={budgetGroups}
          onViewBudget={handleViewBudget}
        />

        <BillsCard 
          bills={bills}
          onAddBills={handleAddBills}
        />

        <GoalsCard 
          goals={goals}
          onAddGoals={handleAddGoals}
        />

        <PaydayCard 
          totalAmount={22540}
          incomeSources={incomeSources}
          onAddIncome={handleAddIncome}
          onUpdateIncome={handleUpdateIncome}
        />
        <View style={styles.bottomPadding} />
      </ScrollView>

      <AddPaydayModal
        visible={showAddPaydayModal}
        onClose={() => setShowAddPaydayModal(false)}
        onSave={handleSavePayday}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primary[100],
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  customizeButton: {
    backgroundColor: AppColors.primary[300],
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  customizeButtonText: {
    color: AppColors.gray[0],
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 80,
  },
});
