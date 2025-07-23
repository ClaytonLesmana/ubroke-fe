import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

interface MoodBasedTip {
  id: string;
  mood: string;
  moodIcon: string;
  title: string;
  description: string;
  actionText: string;
  color: string;
}

interface MoodBasedTipsProps {
  currentMood?: string;
  onTipAction: (tipId: string) => void;
  onMoodChange: (mood: string) => void;
}

const MOOD_TIPS: MoodBasedTip[] = [
  {
    id: "stressed",
    mood: "stressed",
    moodIcon: "😰",
    title: "Feeling Overwhelmed?",
    description:
      "Let's simplify your budget. Focus on your top 3 spending categories this week.",
    actionText: "Show Priority Categories",
    color: "#EF4444",
  },
  {
    id: "confident",
    mood: "confident",
    moodIcon: "😎",
    title: "You're Crushing It!",
    description:
      "Great job staying on track! Ready to tackle a new savings challenge?",
    actionText: "Set New Goal",
    color: "#10B981",
  },
  {
    id: "motivated",
    mood: "motivated",
    moodIcon: "🔥",
    title: "Feeling Motivated?",
    description:
      "Perfect time to review your goals and maybe increase that savings target!",
    actionText: "Review Goals",
    color: "#F59E0B",
  },
  {
    id: "worried",
    mood: "worried",
    moodIcon: "😟",
    title: "Financial Anxiety?",
    description:
      "Remember, small steps count. Let's start with tracking just today's expenses.",
    actionText: "Track Today",
    color: "#8B5CF6",
  },
  {
    id: "excited",
    mood: "excited",
    moodIcon: "🎉",
    title: "Ready for Action!",
    description:
      "Your energy is contagious! Time to automate some savings and make money moves.",
    actionText: "Automate Savings",
    color: "#3B82F6",
  },
];

const MOOD_OPTIONS = [
  { mood: "excited", icon: "🎉", label: "Excited" },
  { mood: "confident", icon: "😎", label: "Confident" },
  { mood: "motivated", icon: "🔥", label: "Motivated" },
  { mood: "worried", icon: "😟", label: "Worried" },
  { mood: "stressed", icon: "😰", label: "Stressed" },
];

export function MoodBasedTips({
  currentMood = "motivated",
  onTipAction,
  onMoodChange,
}: MoodBasedTipsProps) {
  const [selectedMood, setSelectedMood] = useState(currentMood);
  const cardBackground = useThemeColor(
    { light: "#f8f9fa", dark: "#1a1a1a" },
    "background"
  );
  const borderColor = useThemeColor({ light: "#e1e5e9", dark: "#333" }, "text");

  const currentTip =
    MOOD_TIPS.find((tip) => tip.mood === selectedMood) || MOOD_TIPS[1];

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    onMoodChange(mood);
  };

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: cardBackground, borderColor },
      ]}
    >
      <ThemedText type="subtitle" style={styles.title}>
        How are you feeling about money today?
      </ThemedText>

      {/* Mood Selector */}
      <View style={styles.moodSelector}>
        {MOOD_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.mood}
            style={[
              styles.moodOption,
              selectedMood === option.mood && {
                backgroundColor: currentTip.color + "20",
                borderColor: currentTip.color,
              },
            ]}
            onPress={() => handleMoodSelect(option.mood)}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.moodIcon}>{option.icon}</ThemedText>
            <ThemedText
              style={[
                styles.moodLabel,
                selectedMood === option.mood && { color: currentTip.color },
              ]}
            >
              {option.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Personalized Tip */}
      <View
        style={[
          styles.tipContainer,
          { backgroundColor: currentTip.color + "10" },
        ]}
      >
        <View style={styles.tipHeader}>
          <ThemedText style={styles.tipMoodIcon}>
            {currentTip.moodIcon}
          </ThemedText>
          <ThemedText style={[styles.tipTitle, { color: currentTip.color }]}>
            {currentTip.title}
          </ThemedText>
        </View>

        <ThemedText style={styles.tipDescription}>
          {currentTip.description}
        </ThemedText>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: currentTip.color }]}
          onPress={() => onTipAction(currentTip.id)}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.actionButtonText}>
            {currentTip.actionText}
          </ThemedText>
        </TouchableOpacity>
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
    textAlign: "center",
  },
  moodSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  moodOption: {
    alignItems: "center",
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    flex: 1,
    marginHorizontal: 2,
  },
  moodIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  tipContainer: {
    borderRadius: 12,
    padding: 16,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tipMoodIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  tipDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.8,
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
