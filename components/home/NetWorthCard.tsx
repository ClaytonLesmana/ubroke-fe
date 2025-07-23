import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

interface NetWorthCardProps {
  currentNetWorth: number;
  monthlyChange: number;
  monthlyChangePercent: number;
  onPress: () => void;
}

const GOAL_AMOUNT = 1000000; // $1M goal
const { width } = Dimensions.get("window");

export function NetWorthCard({
  currentNetWorth,
  monthlyChange,
  monthlyChangePercent,
  onPress,
}: NetWorthCardProps) {
  const progressColor = useThemeColor({}, "tint");
  const cardBackground = useThemeColor(
    { light: "#f8f9fa", dark: "#1a1a1a" },
    "background"
  );
  const borderColor = useThemeColor({ light: "#e1e5e9", dark: "#333" }, "text");

  const progressPercentage = Math.min(
    (currentNetWorth / GOAL_AMOUNT) * 100,
    100
  );
  const isPositiveChange = monthlyChange >= 0;

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toLocaleString()}`;
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
        <ThemedText type="subtitle">Net Worth</ThemedText>
        <ThemedText style={styles.goalText}>Goal: $1M</ThemedText>
      </View>

      <ThemedText type="title" style={styles.amount}>
        {formatCurrency(currentNetWorth)}
      </ThemedText>

      <View style={styles.changeContainer}>
        <ThemedText
          style={[
            styles.changeText,
            { color: isPositiveChange ? "#10B981" : "#EF4444" },
          ]}
        >
          {isPositiveChange ? "+" : ""}
          {formatCurrency(monthlyChange)} ({monthlyChangePercent > 0 ? "+" : ""}
          {monthlyChangePercent.toFixed(1)}%)
        </ThemedText>
        <ThemedText style={styles.changeLabel}>This month</ThemedText>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPercentage}%`,
                backgroundColor: progressColor,
              },
            ]}
          />
        </View>
        <ThemedText style={styles.progressText}>
          {progressPercentage.toFixed(1)}% to goal
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
    marginBottom: 8,
  },
  goalText: {
    fontSize: 14,
    opacity: 0.7,
  },
  amount: {
    marginBottom: 12,
  },
  changeContainer: {
    marginBottom: 16,
  },
  changeText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  changeLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
  },
});
