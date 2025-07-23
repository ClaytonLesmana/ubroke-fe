import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

interface CashFlowData {
  income: number;
  expenses: number;
  previousMonthIncome: number;
  previousMonthExpenses: number;
}

interface CashFlowOverviewProps {
  data: CashFlowData;
  onPress: () => void;
}

export function CashFlowOverview({ data, onPress }: CashFlowOverviewProps) {
  const cardBackground = useThemeColor(
    { light: "#f8f9fa", dark: "#1a1a1a" },
    "background"
  );
  const borderColor = useThemeColor({ light: "#e1e5e9", dark: "#333" }, "text");

  const netCashFlow = data.income - data.expenses;
  const prevNetCashFlow = data.previousMonthIncome - data.previousMonthExpenses;
  const cashFlowChange = netCashFlow - prevNetCashFlow;
  const cashFlowChangePercent =
    prevNetCashFlow !== 0
      ? (cashFlowChange / Math.abs(prevNetCashFlow)) * 100
      : 0;

  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getCashFlowColor = (amount: number) => {
    if (amount > 0) return "#10B981"; // Green for positive
    if (amount < 0) return "#EF4444"; // Red for negative
    return "#6B7280"; // Gray for zero
  };

  const getCashFlowIcon = (amount: number) => {
    if (amount > 0) return "📈";
    if (amount < 0) return "📉";
    return "📊";
  };

  const getChangeText = (change: number, percent: number) => {
    if (change === 0) return "No change from last month";
    const direction = change > 0 ? "up" : "down";
    const prefix = change > 0 ? "+" : "";
    return `${prefix}${formatCurrency(Math.abs(change))} (${prefix}${Math.abs(
      percent
    ).toFixed(1)}%) ${direction} from last month`;
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
        <ThemedText type="subtitle">Cash Flow</ThemedText>
        <ThemedText style={styles.headerIcon}>
          {getCashFlowIcon(netCashFlow)}
        </ThemedText>
      </View>

      {/* Net Cash Flow */}
      <View style={styles.netFlowContainer}>
        <ThemedText style={styles.netFlowLabel}>Net Cash Flow</ThemedText>
        <ThemedText
          style={[
            styles.netFlowAmount,
            { color: getCashFlowColor(netCashFlow) },
          ]}
        >
          {netCashFlow >= 0 ? "+" : ""}
          {formatCurrency(netCashFlow)}
        </ThemedText>
        <ThemedText style={styles.changeText}>
          {getChangeText(cashFlowChange, cashFlowChangePercent)}
        </ThemedText>
      </View>

      {/* Income vs Expenses Breakdown */}
      <View style={styles.breakdown}>
        <View style={styles.breakdownItem}>
          <View style={styles.breakdownHeader}>
            <View style={[styles.indicator, { backgroundColor: "#10B981" }]} />
            <ThemedText style={styles.breakdownLabel}>Income</ThemedText>
          </View>
          <ThemedText style={styles.breakdownAmount}>
            {formatCurrency(data.income)}
          </ThemedText>
          <ThemedText style={styles.breakdownChange}>
            {data.income > data.previousMonthIncome ? "+" : ""}
            {formatCurrency(data.income - data.previousMonthIncome)}
          </ThemedText>
        </View>

        <View style={styles.breakdownItem}>
          <View style={styles.breakdownHeader}>
            <View style={[styles.indicator, { backgroundColor: "#EF4444" }]} />
            <ThemedText style={styles.breakdownLabel}>Expenses</ThemedText>
          </View>
          <ThemedText style={styles.breakdownAmount}>
            {formatCurrency(data.expenses)}
          </ThemedText>
          <ThemedText style={styles.breakdownChange}>
            {data.expenses > data.previousMonthExpenses ? "+" : ""}
            {formatCurrency(data.expenses - data.previousMonthExpenses)}
          </ThemedText>
        </View>
      </View>

      {/* Visual Progress Bar */}
      <View style={styles.visualContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.incomeBar,
              {
                width: `${Math.min(
                  (data.income / (data.income + data.expenses)) * 100,
                  100
                )}%`,
                backgroundColor: "#10B981",
              },
            ]}
          />
          <View
            style={[
              styles.expenseBar,
              {
                width: `${Math.min(
                  (data.expenses / (data.income + data.expenses)) * 100,
                  100
                )}%`,
                backgroundColor: "#EF4444",
              },
            ]}
          />
        </View>
        <View style={styles.ratio}>
          <ThemedText style={styles.ratioText}>
            Income to Expense Ratio:{" "}
            {data.expenses > 0 ? (data.income / data.expenses).toFixed(2) : "∞"}
            :1
          </ThemedText>
        </View>
      </View>

      <View style={styles.footer}>
        <ThemedText style={styles.viewDetailText}>
          Tap to view detailed cash flow
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
  headerIcon: {
    fontSize: 24,
  },
  netFlowContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  netFlowLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  netFlowAmount: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 6,
  },
  changeText: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: "center",
  },
  breakdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  breakdownItem: {
    flex: 1,
    alignItems: "center",
  },
  breakdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  breakdownLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  breakdownAmount: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  breakdownChange: {
    fontSize: 12,
    opacity: 0.6,
  },
  visualContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    flexDirection: "row",
    overflow: "hidden",
    marginBottom: 8,
  },
  incomeBar: {
    height: "100%",
  },
  expenseBar: {
    height: "100%",
  },
  ratio: {
    alignItems: "center",
  },
  ratioText: {
    fontSize: 12,
    opacity: 0.7,
  },
  footer: {
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  viewDetailText: {
    fontSize: 14,
    opacity: 0.7,
  },
});
