import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useOnboarding } from "@/hooks/useOnboarding";

const { width } = Dimensions.get("window");

const tutorialSlides = [
  {
    id: 1,
    title: "Home: Your Money Hub 📊",
    description:
      "Your money hub with net worth, budgets, and goals. Check your vibe!",
    icon: "🏠",
    color: "#00FF7F",
  },
  {
    id: 2,
    title: "Chat: AI Money Coach 🐷",
    description:
      "Ask our sassy AI piggy bank for money tips and financial advice!",
    icon: "💬",
    color: "#FF69B4",
  },
  {
    id: 3,
    title: "More Features Coming! 🚀",
    description:
      "Community, Learn, and Portfolio are dropping soon! Stay tuned!",
    icon: "✨",
    color: "#8B5CF6",
  },
];

export default function TutorialPage() {
  const [currentTutorialSlide, setCurrentTutorialSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { completeOnboarding, onboardingData } = useOnboarding();

  const handleUploadStatement = async () => {
    Alert.alert("Upload Statement", "Statement upload feature coming soon!");
    // TODO: Implement statement upload
    try {
      await completeOnboarding({
        ...onboardingData,
        hasUploadedStatement: true,
      });
      router.replace("/(tabs)" as any);
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  const handleAddTransaction = async () => {
    Alert.alert("Add Transaction", "Transaction entry feature coming soon!");
    // TODO: Implement transaction entry
    try {
      await completeOnboarding({
        ...onboardingData,
        hasAddedTransaction: true,
      });
      router.replace("/(tabs)" as any);
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  const handleFinish = async () => {
    try {
      await completeOnboarding(onboardingData || {});
      router.replace("/(tabs)" as any);
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  const handleTutorialNext = () => {
    if (currentTutorialSlide < tutorialSlides.length - 1) {
      const nextSlide = currentTutorialSlide + 1;
      setCurrentTutorialSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * (width - 48),
        animated: true,
      });
    }
  };

  const handleTutorialPrev = () => {
    if (currentTutorialSlide > 0) {
      const prevSlide = currentTutorialSlide - 1;
      setCurrentTutorialSlide(prevSlide);
      scrollViewRef.current?.scrollTo({
        x: prevSlide * (width - 48),
        animated: true,
      });
    }
  };

  const renderTutorialSlide = (
    slide: (typeof tutorialSlides)[0],
    index: number
  ) => (
    <View key={slide.id} style={styles.tutorialSlideContainer}>
      <LinearGradient
        colors={[slide.color + "20", slide.color + "10"]}
        style={styles.tutorialCard}
      >
        <View style={[styles.tutorialIcon, { backgroundColor: slide.color }]}>
          <ThemedText style={styles.tutorialIconText}>{slide.icon}</ThemedText>
        </View>
        <ThemedText style={styles.tutorialTitle}>{slide.title}</ThemedText>
        <ThemedText style={styles.tutorialDescription}>
          {slide.description}
        </ThemedText>
      </LinearGradient>
    </View>
  );

  return (
    <LinearGradient
      colors={["#1F2937", "#374151", "#4B5563"]} // Dark gray gradient
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.headerText}>
              Kick Off Your Money Game! 🎮
            </ThemedText>
            <ThemedText style={styles.subHeaderText}>
              Drop a bank statement or add a purchase to start tracking. Or skip
              and explore!
            </ThemedText>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleUploadStatement}
            >
              <LinearGradient
                colors={["#3B82F6", "#1D4ED8"]} // Blue gradient
                style={styles.actionButtonGradient}
              >
                <ThemedText style={styles.actionButtonIcon}>📄</ThemedText>
                <ThemedText style={styles.actionButtonText}>
                  Upload Bank Statement
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleAddTransaction}
            >
              <LinearGradient
                colors={["#10B981", "#059669"]} // Green gradient
                style={styles.actionButtonGradient}
              >
                <ThemedText style={styles.actionButtonIcon}>💸</ThemedText>
                <ThemedText style={styles.actionButtonText}>
                  Add Manual Transaction
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipActionButton}
              onPress={handleFinish}
            >
              <ThemedText style={styles.skipActionText}>
                Explore Now →
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Tutorial Carousel */}
          <View style={styles.tutorialContainer}>
            <ThemedText style={styles.tutorialHeaderText}>
              App Tour ✨
            </ThemedText>

            {/* Tutorial Slides */}
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.tutorialScrollView}
              contentContainerStyle={styles.tutorialScrollContent}
              onMomentumScrollEnd={(event) => {
                const slideIndex = Math.round(
                  event.nativeEvent.contentOffset.x / (width - 48)
                );
                setCurrentTutorialSlide(slideIndex);
              }}
            >
              {tutorialSlides.map((slide, index) =>
                renderTutorialSlide(slide, index)
              )}
            </ScrollView>

            {/* Tutorial Navigation */}
            <View style={styles.tutorialNavigation}>
              <TouchableOpacity
                style={[
                  styles.tutorialNavButton,
                  currentTutorialSlide === 0 &&
                    styles.tutorialNavButtonDisabled,
                ]}
                onPress={handleTutorialPrev}
                disabled={currentTutorialSlide === 0}
              >
                <ThemedText style={styles.tutorialNavButtonText}>
                  ← Prev
                </ThemedText>
              </TouchableOpacity>

              <View style={styles.tutorialDots}>
                {tutorialSlides.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.tutorialDot,
                      index === currentTutorialSlide &&
                        styles.tutorialDotActive,
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.tutorialNavButton,
                  currentTutorialSlide === tutorialSlides.length - 1 &&
                    styles.tutorialNavButtonDisabled,
                ]}
                onPress={handleTutorialNext}
                disabled={currentTutorialSlide === tutorialSlides.length - 1}
              >
                <ThemedText style={styles.tutorialNavButtonText}>
                  Next →
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Finish Button */}
          <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
            <LinearGradient
              colors={["#00FF7F", "#32CD32"]} // Neon green gradient
              style={styles.finishButtonGradient}
            >
              <ThemedText style={styles.finishButtonText}>
                Finish & Start Budgeting! 🎉
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>

          {/* Microcopy */}
          <ThemedText style={styles.microcopy}>
            Let's make your wallet pop! 💥
          </ThemedText>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
  },
  subHeaderText: {
    fontSize: 16,
    color: "#D1D5DB",
    textAlign: "center",
    lineHeight: 22,
  },
  quickActionsContainer: {
    gap: 16,
    marginBottom: 30,
  },
  actionButton: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
  },
  actionButtonIcon: {
    fontSize: 24,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  skipActionButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  skipActionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF69B4",
    textDecorationLine: "underline",
  },
  tutorialContainer: {
    flex: 1,
    marginVertical: 20,
  },
  tutorialHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
  },
  tutorialScrollView: {
    flex: 1,
  },
  tutorialScrollContent: {
    paddingHorizontal: 0,
  },
  tutorialSlideContainer: {
    width: width - 48,
    paddingHorizontal: 8,
  },
  tutorialCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    minHeight: 200,
    justifyContent: "center",
  },
  tutorialIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  tutorialIconText: {
    fontSize: 28,
  },
  tutorialTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
  },
  tutorialDescription: {
    fontSize: 14,
    color: "#D1D5DB",
    textAlign: "center",
    lineHeight: 20,
  },
  tutorialNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 16,
  },
  tutorialNavButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  tutorialNavButtonDisabled: {
    opacity: 0.3,
  },
  tutorialNavButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  tutorialDots: {
    flexDirection: "row",
    gap: 8,
  },
  tutorialDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  tutorialDotActive: {
    backgroundColor: "#00FF7F",
  },
  finishButton: {
    borderRadius: 16,
    shadowColor: "#00FF7F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginVertical: 20,
  },
  finishButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  finishButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  microcopy: {
    fontSize: 14,
    color: "#D1D5DB",
    textAlign: "center",
    fontWeight: "500",
  },
});
