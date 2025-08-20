import React from "react";
import { ScrollView, StyleSheet, Alert, View, TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { AppColors } from "@/constants/Colors";
import { Image } from "expo-image";

// Import all the new components
import { JourneyCard } from "@/components/home/JourneyCard";
import { SpendingCategoryCard } from "@/components/home/SpendingCategoryCard";
import { CashflowCard } from "@/components/home/CashflowCard";
import { BudgetCard } from "@/components/home/BudgetCard";
import { BillsCard } from "@/components/home/BillsCard";
import { GoalsCard } from "@/components/home/GoalsCard";
import { PaydayCard } from "@/components/home/PaydayCard";

export default function HomePage() {
  // Dummy data for all components
  const spendingCategories = [
    { name: "Food", amount: 213, color: "#EF4444" },
    { name: "Fun", amount: 160, color: "#10B981" },
    { name: "Rent", amount: 1200, color: AppColors.primary[300] },
  ];

  const cashflowData = {
    income: 1000,
    expenses: 200,
    left: 800,
  };

  const budgetItem = {
    name: "Groceries",
    spent: 66,
    budget: 150,
    icon: "🛒",
  };

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
  const handleAddIncome = () => Alert.alert("Add Income", "Open income form");
  const handleUpdateIncome = (index: number) => Alert.alert("Update Income", `Update income source ${index + 1}`);
  const handleTapToDigDeeper = () => Alert.alert("Dig Deeper", "Navigate to detailed spending analysis");

  return (
    <ThemedView style={styles.container}>
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
                <Image source={require('@/assets/images/notification.png')} style={{
                  width: 16,
                  height: 18,
                }} />
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
              <Image source={require('@/assets/images/settings.png')} style={{
                width: 18,
                height: 18,
              }} />
            </TouchableOpacity>
          </View>
        </View>

        <JourneyCard 
          currentAmount={66000}
          targetAmount={1000000}
          onViewAnalytics={handleViewAnalytics}
        />

        <SpendingCategoryCard 
          categories={spendingCategories}
          onTapToDigDeeper={handleTapToDigDeeper}
        />

        <CashflowCard 
          data={cashflowData}
          onSeeDetails={() => Alert.alert("Cashflow Details", "Navigate to cashflow details")}
        />

        <BudgetCard 
          daysLeft={4}
          title="Million fortnight's budgety!"
          budgetItem={budgetItem}
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primary[100],
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
