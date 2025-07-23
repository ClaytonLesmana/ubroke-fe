import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

interface PaydayInfo {
  nextPayDate: Date;
  expectedAmount: number;
  lastPayAmount: number;
  payFrequency: "weekly" | "biweekly" | "monthly" | "semimonthly";
  incomeSource: string;
}

interface PaydaySectionProps {
  paydayInfo: PaydayInfo;
  onPress: () => void;
}

export function PaydaySection({ paydayInfo, onPress }: PaydaySectionProps) {
  const cardBackground = useThemeColor(
    { light: "#f8f9fa", dark: "#1a1a1a" },
    "background"
  );
  const borderColor = useThemeColor({ light: "#e1e5e9", dark: "#333" }, "text");

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  const getDaysUntilPayday = () => {
    const today = new Date();
    const nextPay = new Date(paydayInfo.nextPayDate);
    const diffTime = nextPay.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatPaydayCountdown = () => {
    const days = getDaysUntilPayday();

    if (days < 0) return "Payday was overdue";
    if (days === 0) return "Payday is TODAY! 🎉";
    if (days === 1) return "Payday is tomorrow!";
    if (days <= 7) return `${days} days until payday`;

    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;

    if (weeks === 1 && remainingDays === 0) return "1 week until payday";
    if (weeks === 1)
      return `1 week and ${remainingDays} day${
        remainingDays > 1 ? "s" : ""
      } until payday`;
    if (remainingDays === 0) return `${weeks} weeks until payday`;

    return `${weeks} weeks and ${remainingDays} day${
      remainingDays > 1 ? "s" : ""
    } until payday`;
  };

  const getPayFrequencyText = () => {
    switch (paydayInfo.payFrequency) {
      case "weekly":
        return "Weekly";
      case "biweekly":
        return "Bi-weekly";
      case "monthly":
        return "Monthly";
      case "semimonthly":
        return "Semi-monthly";
      default:
        return "Regular";
    }
  };

  const getPaydayEmoji = () => {
    const days = getDaysUntilPayday();
    if (days === 0) return "🎉";
    if (days === 1) return "🗓️";
    if (days <= 3) return "⏰";
    return "💰";
  };

  const getProgressColor = () => {
    const days = getDaysUntilPayday();
    if (days === 0) return "#10B981"; // Green - payday!
    if (days === 1) return "#F59E0B"; // Yellow - tomorrow
    if (days <= 3) return "#3B82F6"; // Blue - soon
    return "#6B7280"; // Gray - later
  };

  const getPaydayProgress = () => {
    const days = getDaysUntilPayday();
    const totalDays = getPayFrequencyDays();
    const progress = Math.max(0, ((totalDays - days) / totalDays) * 100);
    return Math.min(progress, 100);
  };

  const getPayFrequencyDays = () => {
    switch (paydayInfo.payFrequency) {
      case "weekly":
        return 7;
      case "biweekly":
        return 14;
      case "monthly":
        return 30;
      case "semimonthly":
        return 15;
      default:
        return 30;
    }
  };

  const amountDifference = paydayInfo.expectedAmount - paydayInfo.lastPayAmount;
  const isIncrease = amountDifference > 0;

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: cardBackground, borderColor },
      ]}
      onTouchEnd={onPress}
    >
      <View style={styles.header}>
        <ThemedText type="subtitle">Next Payday</ThemedText>
        <ThemedText style={styles.headerEmoji}>{getPaydayEmoji()}</ThemedText>
      </View>

      {/* Countdown */}
      <View style={styles.countdownContainer}>
        <ThemedText
          style={[styles.countdownText, { color: getProgressColor() }]}
        >
          {formatPaydayCountdown()}
        </ThemedText>
        <ThemedText style={styles.dateText}>
          {paydayInfo.nextPayDate.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </ThemedText>
      </View>

      {/* Expected Amount */}
      <View style={styles.amountContainer}>
        <ThemedText style={styles.amountLabel}>Expected Amount</ThemedText>
        <ThemedText style={styles.expectedAmount}>
          {formatCurrency(paydayInfo.expectedAmount)}
        </ThemedText>

        {Math.abs(amountDifference) > 0 && (
          <ThemedText
            style={[
              styles.amountChange,
              { color: isIncrease ? "#10B981" : "#EF4444" },
            ]}
          >
            {isIncrease ? "+" : ""}
            {formatCurrency(amountDifference)} from last pay
          </ThemedText>
        )}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <ThemedText style={styles.progressLabel}>
          Pay period progress
        </ThemedText>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${getPaydayProgress()}%`,
                backgroundColor: getProgressColor(),
              },
            ]}
          />
        </View>
        <View style={styles.progressInfo}>
          <ThemedText style={styles.progressText}>
            {getPaydayProgress().toFixed(0)}% complete
          </ThemedText>
          <ThemedText style={styles.frequencyText}>
            {getPayFrequencyText()} • {paydayInfo.incomeSource}
          </ThemedText>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <ThemedText style={styles.statLabel}>Last Pay</ThemedText>
          <ThemedText style={styles.statValue}>
            {formatCurrency(paydayInfo.lastPayAmount)}
          </ThemedText>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <ThemedText style={styles.statLabel}>Frequency</ThemedText>
          <ThemedText style={styles.statValue}>
            {getPayFrequencyText()}
          </ThemedText>
        </View>
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
  headerEmoji: {
    fontSize: 24,
  },
  countdownContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  countdownText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    opacity: 0.7,
  },
  amountContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  expectedAmount: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  amountChange: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
  },
  frequencyText: {
    fontSize: 12,
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: "row",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 16,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
  },
});
