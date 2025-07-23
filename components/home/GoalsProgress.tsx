import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category:
    | "savings"
    | "debt"
    | "investment"
    | "emergency"
    | "vacation"
    | "purchase";
  icon: string;
  color: string;
}

interface GoalsProgressProps {
  goals: Goal[];
  onGoalPress: (goal: Goal) => void;
  onViewAllGoals: () => void;
}

export function GoalsProgress({
  goals,
  onGoalPress,
  onViewAllGoals,
}: GoalsProgressProps) {
  const cardBackground = useThemeColor(
    { light: "#f8f9fa", dark: "#1a1a1a" },
    "background"
  );
  const borderColor = useThemeColor({ light: "#e1e5e9", dark: "#333" }, "text");

  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysRemaining = (deadline: Date) => {
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (progress: number, daysRemaining: number) => {
    if (progress >= 90) return "#10B981"; // Green - almost done
    if (progress >= 50 && daysRemaining > 30) return "#3B82F6"; // Blue - on track
    if (progress >= 25 && daysRemaining > 7) return "#F59E0B"; // Yellow - needs attention
    return "#EF4444"; // Red - behind schedule
  };

  const formatDeadline = (date: Date) => {
    const days = getDaysRemaining(date);
    if (days < 0) return "Overdue";
    if (days === 0) return "Today!";
    if (days === 1) return "Tomorrow";
    if (days <= 30) return `${days} days left`;

    const months = Math.ceil(days / 30);
    return `${months} ${months === 1 ? "month" : "months"} left`;
  };

  // Sort goals by progress and deadline
  const sortedGoals = goals.sort((a, b) => {
    const progressA = calculateProgress(a.currentAmount, a.targetAmount);
    const progressB = calculateProgress(b.currentAmount, b.targetAmount);
    const daysA = getDaysRemaining(a.deadline);
    const daysB = getDaysRemaining(b.deadline);

    // Prioritize goals that are close to deadline or nearly complete
    if (daysA <= 30 && daysB > 30) return -1;
    if (daysB <= 30 && daysA > 30) return 1;
    if (progressA >= 80 && progressB < 80) return -1;
    if (progressB >= 80 && progressA < 80) return 1;

    return daysA - daysB;
  });

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: cardBackground, borderColor },
      ]}
    >
      <View style={styles.header}>
        <ThemedText type="subtitle">Your Goals</ThemedText>
        <TouchableOpacity onPress={onViewAllGoals}>
          <ThemedText style={styles.viewAllText}>View All</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.goalsList} showsVerticalScrollIndicator={false}>
        {sortedGoals.slice(0, 3).map((goal) => {
          const progress = calculateProgress(
            goal.currentAmount,
            goal.targetAmount
          );
          const progressColor = getProgressColor(
            progress,
            getDaysRemaining(goal.deadline)
          );

          return (
            <TouchableOpacity
              key={goal.id}
              style={styles.goalItem}
              onPress={() => onGoalPress(goal)}
              activeOpacity={0.7}
            >
              <View style={styles.goalHeader}>
                <View style={styles.goalLeft}>
                  <View
                    style={[
                      styles.goalIcon,
                      { backgroundColor: goal.color + "20" },
                    ]}
                  >
                    <ThemedText style={styles.iconText}>{goal.icon}</ThemedText>
                  </View>
                  <View style={styles.goalInfo}>
                    <ThemedText style={styles.goalTitle}>
                      {goal.title}
                    </ThemedText>
                    <ThemedText style={styles.goalDeadline}>
                      {formatDeadline(goal.deadline)}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.goalRight}>
                  <ThemedText style={styles.goalProgress}>
                    {progress.toFixed(0)}%
                  </ThemedText>
                  <ThemedText style={styles.goalAmount}>
                    {formatCurrency(goal.currentAmount)} /{" "}
                    {formatCurrency(goal.targetAmount)}
                  </ThemedText>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressTrack,
                    { backgroundColor: progressColor + "20" },
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${progress}%`, backgroundColor: progressColor },
                    ]}
                  />
                </View>
              </View>

              {/* Quick Action based on progress */}
              {progress < 100 && (
                <View style={styles.goalAction}>
                  <ThemedText
                    style={[styles.actionText, { color: progressColor }]}
                  >
                    {progress < 25
                      ? "💪 Keep going! Every dollar counts"
                      : progress < 75
                      ? "🎯 You're making great progress!"
                      : "🚀 Almost there! Final push!"}
                  </ThemedText>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {goals.length === 0 && (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyIcon}>🎯</ThemedText>
          <ThemedText style={styles.emptyTitle}>No Goals Yet</ThemedText>
          <ThemedText style={styles.emptyDescription}>
            Set your first financial goal to start tracking progress!
          </ThemedText>
          <TouchableOpacity
            style={styles.createGoalButton}
            onPress={onViewAllGoals}
          >
            <ThemedText style={styles.createGoalText}>Create Goal</ThemedText>
          </TouchableOpacity>
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
  viewAllText: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "600",
  },
  goalsList: {
    maxHeight: 300,
  },
  goalItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  goalLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  goalIcon: {
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
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  goalDeadline: {
    fontSize: 14,
    opacity: 0.7,
  },
  goalRight: {
    alignItems: "flex-end",
  },
  goalProgress: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  goalAmount: {
    fontSize: 14,
    opacity: 0.7,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  goalAction: {
    marginTop: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "italic",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 20,
  },
  createGoalButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createGoalText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
