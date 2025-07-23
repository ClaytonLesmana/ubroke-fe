import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";

const { width, height } = Dimensions.get("window");

export default function WelcomePage() {
  const bounceAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.8)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimation, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Bouncing coin animation
    const createBounceAnimation = () => {
      return Animated.sequence([
        Animated.timing(bounceAnimation, {
          toValue: -20,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnimation, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]);
    };

    const loopBounce = () => {
      createBounceAnimation().start(() => {
        setTimeout(loopBounce, 1000); // Wait 1 second before next bounce
      });
    };

    // Start bounce animation after entrance
    setTimeout(loopBounce, 1000);
  }, []);

  const handleGetStarted = () => {
    router.push("/onboarding/auth");
  };

  return (
    <LinearGradient
      colors={["#00FF7F", "#32CD32", "#00FF7F"]} // Neon green gradient
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnimation,
              transform: [{ scale: scaleAnimation }],
            },
          ]}
        >
          {/* Logo Area */}
          <View style={styles.logoContainer}>
            <Animated.View
              style={[
                styles.coinContainer,
                {
                  transform: [{ translateY: bounceAnimation }],
                },
              ]}
            >
              <View style={styles.coin}>
                <ThemedText style={styles.coinText}>💰</ThemedText>
              </View>
            </Animated.View>

            <ThemedText style={styles.logoText}>YouBroke</ThemedText>
            <View style={styles.sparkles}>
              <ThemedText style={styles.sparkle}>✨</ThemedText>
              <ThemedText style={styles.sparkle}>💅</ThemedText>
              <ThemedText style={styles.sparkle}>✨</ThemedText>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.textContainer}>
            <ThemedText style={styles.header}>
              Welcome to YouBroke! 💅
            </ThemedText>

            <ThemedText style={styles.subtext}>
              Broke but make it chic! Let's get your money glowing in just a few
              steps. Ready to slay your finances? 🚀
            </ThemedText>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#FF69B4", "#FF1493", "#FF69B4"]} // Hot pink gradient
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <ThemedText style={styles.buttonText}>Get Started</ThemedText>
            </LinearGradient>
          </TouchableOpacity>

          {/* Decorative Elements */}
          <View style={styles.decorativeElements}>
            <ThemedText style={[styles.floatingEmoji, styles.emoji1]}>
              💸
            </ThemedText>
            <ThemedText style={[styles.floatingEmoji, styles.emoji2]}>
              🚀
            </ThemedText>
            <ThemedText style={[styles.floatingEmoji, styles.emoji3]}>
              ✨
            </ThemedText>
            <ThemedText style={[styles.floatingEmoji, styles.emoji4]}>
              💎
            </ThemedText>
          </View>
        </Animated.View>
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
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  coinContainer: {
    marginBottom: 20,
  },
  coin: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFFF00", // Yellow background
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  coinText: {
    fontSize: 40,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  sparkles: {
    flexDirection: "row",
    gap: 12,
  },
  sparkle: {
    fontSize: 24,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtext: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 26,
    fontWeight: "500",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  getStartedButton: {
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 24,
    minWidth: 200,
    minHeight: 48, // 48px tap area as requested
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  decorativeElements: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },
  floatingEmoji: {
    position: "absolute",
    fontSize: 24,
    opacity: 0.7,
  },
  emoji1: {
    top: "15%",
    left: "10%",
  },
  emoji2: {
    top: "25%",
    right: "15%",
  },
  emoji3: {
    bottom: "30%",
    left: "15%",
  },
  emoji4: {
    bottom: "20%",
    right: "20%",
  },
});
