import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  category: string;
  isPaid: boolean;
  isOverdue: boolean;
}

interface UpcomingBillsProps {
  bills: Bill[];
  onBillPress: (bill: Bill) => void;
}

export function UpcomingBills({ bills, onBillPress }: UpcomingBillsProps) {
  const cardBackground = useThemeColor(
    { light: "#f8f9fa", dark: "#1a1a1a" },
    "background"
  );
  const borderColor = useThemeColor({ light: "#e1e5e9", dark: "#333" }, "text");

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getDaysUntilDue = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getBillStatusColor = (bill: Bill) => {
    if (bill.isPaid) return "#10B981"; // Green
    if (bill.isOverdue) return "#EF4444"; // Red

    const daysUntil = getDaysUntilDue(bill.dueDate);
    if (daysUntil <= 1) return "#F59E0B"; // Yellow
    return "#6B7280"; // Gray
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      utilities: "⚡",
      rent: "🏠",
      insurance: "🛡️",
      subscription: "📱",
      loan: "🏦",
      credit: "💳",
      other: "📝",
    };
    return icons[category.toLowerCase()] || "📝";
  };

  // Sort bills by due date
  const sortedBills = bills.sort(
    (a, b) => a.dueDate.getTime() - b.dueDate.getTime()
  );

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: cardBackground, borderColor },
      ]}
    >
      <View style={styles.header}>
        <ThemedText type="subtitle">Upcoming Bills</ThemedText>
        <ThemedText style={styles.totalText}>
          {bills.filter((b) => !b.isPaid).length} pending
        </ThemedText>
      </View>

      <ScrollView style={styles.billsList} showsVerticalScrollIndicator={false}>
        {sortedBills.slice(0, 4).map((bill) => (
          <View
            key={bill.id}
            style={styles.billItem}
            onTouchEnd={() => onBillPress(bill)}
          >
            <View style={styles.billLeft}>
              <View
                style={[
                  styles.billIcon,
                  { backgroundColor: getBillStatusColor(bill) + "20" },
                ]}
              >
                <ThemedText style={styles.iconText}>
                  {getCategoryIcon(bill.category)}
                </ThemedText>
              </View>
              <View style={styles.billInfo}>
                <ThemedText style={styles.billName}>{bill.name}</ThemedText>
                <ThemedText style={styles.billCategory}>
                  {bill.category}
                </ThemedText>
              </View>
            </View>

            <View style={styles.billRight}>
              <ThemedText style={styles.billAmount}>
                {formatCurrency(bill.amount)}
              </ThemedText>
              <View style={styles.dueDateContainer}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getBillStatusColor(bill) },
                  ]}
                />
                <ThemedText
                  style={[styles.dueDate, { color: getBillStatusColor(bill) }]}
                >
                  {bill.isPaid
                    ? "Paid"
                    : bill.isOverdue
                    ? "Overdue"
                    : formatDate(bill.dueDate)}
                </ThemedText>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {bills.length > 4 && (
        <View style={styles.footer}>
          <ThemedText style={styles.viewAllText}>
            View all {bills.length} bills
          </ThemedText>
        </View>
      )}
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
  totalText: {
    fontSize: 14,
    opacity: 0.7,
  },
  billsList: {
    maxHeight: 240,
  },
  billItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  billLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  billIcon: {
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
  billInfo: {
    flex: 1,
  },
  billName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  billCategory: {
    fontSize: 14,
    opacity: 0.7,
    textTransform: "capitalize",
  },
  billRight: {
    alignItems: "flex-end",
  },
  billAmount: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  dueDate: {
    fontSize: 14,
    fontWeight: "500",
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
