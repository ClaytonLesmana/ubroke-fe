import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function PortfolioScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Portfolio 💼
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Coming Soon! Track your investments and financial portfolio in one
        place.
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
