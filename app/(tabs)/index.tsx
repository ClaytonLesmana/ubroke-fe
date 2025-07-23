import React, { useState } from "react";
import { ScrollView, StyleSheet, Alert } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { NetWorthCard } from "@/components/home/NetWorthCard";
import { SpendingCategoryCard } from "@/components/home/SpendingCategoryCard";
import { QuickActionsBar } from "@/components/home/QuickActionsBar";
import { UpcomingBills } from "@/components/home/UpcomingBills";
import { GoalsProgress } from "@/components/home/GoalsProgress";
import { PaydaySection } from "@/components/home/PaydaySection";
import { CashFlowOverview } from "@/components/home/CashFlowOverview";
import { MoodBasedTips } from "@/components/home/MoodBasedTips";

// Mock data for demonstration
const mockNetWorthData = {
  currentNetWorth: 45000,
  monthlyChange: 2500,
  monthlyChangePercent: 5.8,
};

const mockSpendingCategories = [
  {
    id: "1",
    name: "Food & Dining",
    amount: 450,
    budget: 600,
    color: "#EF4444",
    icon: "🍕",
  },
  {
    id: "2",
    name: "Transportation",
    amount: 320,
    budget: 400,
    color: "#3B82F6",
    icon: "🚗",
  },
  {
    id: "3",
    name: "Entertainment",
    amount: 180,
    budget: 300,
    color: "#8B5CF6",
    icon: "🎬",
  },
  {
    id: "4",
    name: "Shopping",
    amount: 250,
    budget: 350,
    color: "#F59E0B",
    icon: "🛍️",
  },
  {
    id: "5",
    name: "Utilities",
    amount: 150,
    budget: 200,
    color: "#10B981",
    icon: "⚡",
  },
];

const mockBills = [
  {
    id: "1",
    name: "Rent",
    amount: 1200,
    dueDate: new Date(2024, 11, 1), // December 1, 2024
    category: "rent",
    isPaid: false,
    isOverdue: false,
  },
  {
    id: "2",
    name: "Electric Bill",
    amount: 85,
    dueDate: new Date(2024, 11, 5), // December 5, 2024
    category: "utilities",
    isPaid: false,
    isOverdue: false,
  },
  {
    id: "3",
    name: "Phone Bill",
    amount: 65,
    dueDate: new Date(2024, 10, 28), // November 28, 2024
    category: "subscription",
    isPaid: true,
    isOverdue: false,
  },
  {
    id: "4",
    name: "Car Insurance",
    amount: 120,
    dueDate: new Date(2024, 11, 15), // December 15, 2024
    category: "insurance",
    isPaid: false,
    isOverdue: false,
  },
];

const mockGoals = [
  {
    id: "1",
    title: "Emergency Fund",
    targetAmount: 10000,
    currentAmount: 7500,
    deadline: new Date(2025, 5, 1), // June 1, 2025
    category: "emergency" as const,
    icon: "🛡️",
    color: "#10B981",
  },
  {
    id: "2",
    title: "Vacation to Japan",
    targetAmount: 5000,
    currentAmount: 2200,
    deadline: new Date(2025, 7, 15), // August 15, 2025
    category: "vacation" as const,
    icon: "🗾",
    color: "#F59E0B",
  },
  {
    id: "3",
    title: "New Laptop",
    targetAmount: 2500,
    currentAmount: 1800,
    deadline: new Date(2024, 11, 31), // December 31, 2024
    category: "purchase" as const,
    icon: "💻",
    color: "#3B82F6",
  },
];

const mockCashFlowData = {
  income: 4500,
  expenses: 2800,
  previousMonthIncome: 4200,
  previousMonthExpenses: 3100,
};

const mockPaydayInfo = {
  nextPayDate: new Date(2024, 11, 15), // December 15, 2024
  expectedAmount: 2250,
  lastPayAmount: 2150,
  payFrequency: "biweekly" as const,
  incomeSource: "TechCorp Inc.",
};

export default function HomeScreen() {
  const [userMood, setUserMood] = useState("motivated");

  const handleNetWorthPress = () => {
    Alert.alert("Net Worth", "Navigate to Account details page");
    // TODO: Navigate to Account subpage
  };

  const handleSpendingCategoriesPress = () => {
    Alert.alert(
      "Spending Categories",
      "Navigate to Individual Transaction page"
    );
    // TODO: Navigate to Individual Transaction subpage
  };

  const handleCashFlowPress = () => {
    Alert.alert("Cash Flow", "Navigate to Cashflow subpage");
    // TODO: Navigate to Cashflow subpage
  };

  const handleGoalPress = (goal: any) => {
    Alert.alert("Goal Details", `View details for: ${goal.title}`);
    // TODO: Navigate to goal details
  };

  const handleViewAllGoals = () => {
    Alert.alert("All Goals", "Navigate to Budget Planner subpage");
    // TODO: Navigate to Budget Planner subpage
  };

  const handleBillPress = (bill: any) => {
    Alert.alert("Bill Details", `View details for: ${bill.name}`);
    // TODO: Navigate to bill details
  };

  const handlePaydayPress = () => {
    Alert.alert("Payday Details", "View income details and payday information");
    // TODO: Navigate to income details page
  };

  // Quick Actions
  const handleAddExpense = () => {
    Alert.alert("Add Expense", "Open expense tracking form");
    // TODO: Open add expense modal
  };

  const handleQuickScan = () => {
    Alert.alert("Quick Scan", "Open camera for receipt scanning");
    // TODO: Open camera for receipt scanning
  };

  const handleUploadStatement = () => {
    Alert.alert("Upload Statement", "Open file picker for bank statement");
    // TODO: Open file picker
  };

  const handleSetGoal = () => {
    Alert.alert("Set Goal", "Open goal creation form");
    // TODO: Open goal creation modal
  };

  // Mood-based tips
  const handleTipAction = (tipId: string) => {
    Alert.alert("Tip Action", `Execute action for tip: ${tipId}`);
    // TODO: Handle specific tip actions
  };

  const handleMoodChange = (mood: string) => {
    setUserMood(mood);
    // TODO: Save mood to user preferences/state
  };

  const totalSpent = mockSpendingCategories.reduce(
    (sum, category) => sum + category.amount,
    0
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Header */}
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.welcomeText}>
            Welcome back! 👋
          </ThemedText>
          <ThemedText style={styles.subtitleText}>
            Here's your financial overview
          </ThemedText>
        </ThemedView>

        {/* Net Worth Progress toward $1M Goal */}
        <NetWorthCard
          currentNetWorth={mockNetWorthData.currentNetWorth}
          monthlyChange={mockNetWorthData.monthlyChange}
          monthlyChangePercent={mockNetWorthData.monthlyChangePercent}
          onPress={handleNetWorthPress}
        />

        {/* Quick Actions Bar */}
        <QuickActionsBar
          onAddExpense={handleAddExpense}
          onQuickScan={handleQuickScan}
          onUploadStatement={handleUploadStatement}
          onSetGoal={handleSetGoal}
        />

        {/* Spending Categories Breakdown */}
        <SpendingCategoryCard
          categories={mockSpendingCategories}
          totalSpent={totalSpent}
          onPress={handleSpendingCategoriesPress}
        />

        {/* Cash Flow Overview */}
        <CashFlowOverview
          data={mockCashFlowData}
          onPress={handleCashFlowPress}
        />

        {/* Goals Progress */}
        <GoalsProgress
          goals={mockGoals}
          onGoalPress={handleGoalPress}
          onViewAllGoals={handleViewAllGoals}
        />

        {/* Upcoming Bills */}
        <UpcomingBills bills={mockBills} onBillPress={handleBillPress} />

        {/* Payday Section */}
        <PaydaySection
          paydayInfo={mockPaydayInfo}
          onPress={handlePaydayPress}
        />

        {/* Mood-Based Budget Tips */}
        <MoodBasedTips
          currentMood={userMood}
          onTipAction={handleTipAction}
          onMoodChange={handleMoodChange}
        />

        {/* Bottom Padding */}
        <ThemedView style={styles.bottomPadding} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  welcomeText: {
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    opacity: 0.7,
  },
  bottomPadding: {
    height: 80, // Extra space at bottom for tab bar
  },
});
