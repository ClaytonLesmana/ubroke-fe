import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function ChatScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        AI Money Coach 🐷
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Coming Soon! Your sassy AI piggy bank will be here to help with money
        tips.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    opacity: 0.7,
  },
});
