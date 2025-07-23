import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

interface SpendingCategory {
  id: string;
  name: string;
  amount: number;
  budget: number;
  color: string;
  icon: string;
}

interface SpendingCategoryCardProps {
  categories: SpendingCategory[];
  totalSpent: number;
  onPress: () => void;
}

export function SpendingCategoryCard({
  categories,
  totalSpent,
  onPress,
}: SpendingCategoryCardProps) {
  const cardBackground = useThemeColor(
    { light: "#f8f9fa", dark: "#1a1a1a" },
    "background"
  );
  const borderColor = useThemeColor({ light: "#e1e5e9", dark: "#333" }, "text");

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  const calculatePercentage = (amount: number) => {
    return totalSpent > 0 ? ((amount / totalSpent) * 100).toFixed(0) : "0";
  };

  const getStatusColor = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 90) return "#EF4444"; // Red
    if (percentage >= 75) return "#F59E0B"; // Yellow
    return "#10B981"; // Green
  };

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: cardBackground, borderColor },
      ]}
      onTouchEnd={onPress}
    >
      <View style={styles.header}>
        <ThemedText type="subtitle">Spending This Month</ThemedText>
        <ThemedText style={styles.totalAmount}>
          {formatCurrency(totalSpent)}
        </ThemedText>
      </View>

      <ScrollView
        style={styles.categoriesContainer}
        showsVerticalScrollIndicator={false}
      >
        {categories.slice(0, 5).map((category) => (
          <View key={category.id} style={styles.categoryRow}>
            <View style={styles.categoryLeft}>
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: category.color },
                ]}
              >
                <ThemedText style={styles.iconText}>{category.icon}</ThemedText>
              </View>
              <View style={styles.categoryInfo}>
                <ThemedText style={styles.categoryName}>
                  {category.name}
                </ThemedText>
                <ThemedText style={styles.categoryBudget}>
                  of {formatCurrency(category.budget)} budget
                </ThemedText>
              </View>
            </View>

            <View style={styles.categoryRight}>
              <ThemedText style={styles.categoryAmount}>
                {formatCurrency(category.amount)}
              </ThemedText>
              <ThemedText style={styles.categoryPercentage}>
                {calculatePercentage(category.amount)}%
              </ThemedText>
            </View>

            {/* Progress bar */}
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      (category.amount / category.budget) * 100,
                      100
                    )}%`,
                    backgroundColor: getStatusColor(
                      category.amount,
                      category.budget
                    ),
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <ThemedText style={styles.viewAllText}>
          Tap to view all categories
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  categoriesContainer: {
    maxHeight: 200,
  },
  categoryRow: {
    marginBottom: 16,
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  categoryBudget: {
    fontSize: 14,
    opacity: 0.7,
  },
  categoryRight: {
    position: "absolute",
    right: 0,
    top: 0,
    alignItems: "flex-end",
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 14,
    opacity: 0.7,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    marginTop: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  footer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    opacity: 0.7,
  },
});
