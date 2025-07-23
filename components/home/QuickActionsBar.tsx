import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface QuickActionsBarProps {
  onAddExpense: () => void;
  onUploadStatement: () => void;
  onSetGoal: () => void;
  onQuickScan: () => void;
}

export function QuickActionsBar({
  onAddExpense,
  onUploadStatement,
  onSetGoal,
  onQuickScan,
}: QuickActionsBarProps) {
  const cardBackground = useThemeColor(
    { light: "#f8f9fa", dark: "#1a1a1a" },
    "background"
  );
  const borderColor = useThemeColor({ light: "#e1e5e9", dark: "#333" }, "text");

  const quickActions: QuickAction[] = [
    {
      id: "expense",
      title: "Add Expense",
      icon: "💸",
      color: "#EF4444",
      onPress: onAddExpense,
    },
    {
      id: "scan",
      title: "Quick Scan",
      icon: "📱",
      color: "#8B5CF6",
      onPress: onQuickScan,
    },
    {
      id: "upload",
      title: "Upload Statement",
      icon: "📄",
      color: "#3B82F6",
      onPress: onUploadStatement,
    },
    {
      id: "goal",
      title: "Set Goal",
      icon: "🎯",
      color: "#10B981",
      onPress: onSetGoal,
    },
  ];

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: cardBackground, borderColor },
      ]}
    >
      <ThemedText type="subtitle" style={styles.title}>
        Quick Actions
      </ThemedText>

      <View style={styles.actionsGrid}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[
              styles.actionButton,
              { backgroundColor: action.color + "15" },
            ]}
            onPress={action.onPress}
            activeOpacity={0.7}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: action.color }]}
            >
              <ThemedText style={styles.actionIcon}>{action.icon}</ThemedText>
            </View>
            <ThemedText style={[styles.actionTitle, { color: action.color }]}>
              {action.title}
            </ThemedText>
          </TouchableOpacity>
        ))}
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
  title: {
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
