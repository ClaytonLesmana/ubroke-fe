import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated, Easing } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AppColors } from '@/constants/Colors';
import Svg, { Circle, Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';

export default function LearnScreen() {
  // Animation values
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(50)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in and slide up animation
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Continuous rotation animation
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleNotifyMe = () => {
    // Placeholder action - could open email signup or notification preferences
    console.log('Notify Me pressed');
  };

  return (
    <ThemedView style={{
      flex: 1,
      backgroundColor: AppColors.primary[100],
    }}>
      {/* Header Section - matching homepage style */}
      <View style={{
        backgroundColor: AppColors.gray[0],
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        paddingHorizontal: 20,
        paddingTop: 65,
        paddingBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
        marginBottom: 24,
      }}>
        <View style={{
          alignItems: 'center',
        }}>
          <ThemedText style={{
            fontSize: 24,
            fontWeight: '700',
            color: AppColors.gray[500],
            marginBottom: 8,
          }}>
            Learn & Grow
          </ThemedText>
          <ThemedText style={{
            fontSize: 16,
            color: AppColors.gray[400],
            textAlign: 'center',
          }}>
            Master your money with smart insights
          </ThemedText>
        </View>
      </View>

      {/* Main Content */}
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
      }}>
        <Animated.View style={{
          opacity: fadeIn,
          transform: [{ translateY: slideUp }],
          alignItems: 'center',
        }}>
          {/* Animated Icon */}
          <Animated.View style={{
            transform: [
              { scale: pulse },
              { rotate: rotateInterpolate }
            ],
            marginBottom: 32,
          }}>
            <View style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: AppColors.primary[200],
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: AppColors.primary[300],
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 8,
            }}>
              <ThemedText style={{
                fontSize: 48,
              }}>
                📚
              </ThemedText>
            </View>
          </Animated.View>

          {/* Coming Soon Title */}
          <ThemedText style={{
            fontSize: 36,
            fontWeight: '700',
            color: AppColors.gray[500],
            marginBottom: 16,
            textAlign: 'center',
          }}>
            Coming Soon
          </ThemedText>

          {/* Subtitle */}
          <ThemedText style={{
            fontSize: 18,
            color: AppColors.gray[400],
            textAlign: 'center',
            lineHeight: 26,
            marginBottom: 32,
            paddingHorizontal: 16,
          }}>
            We're crafting amazing financial education content to help you build wealth, manage debt, and achieve your money goals.
          </ThemedText>

          {/* Feature Preview */}
          <View style={{
            backgroundColor: AppColors.gray[0],
            borderRadius: 20,
            padding: 24,
            marginBottom: 32,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 4,
            width: '100%',
          }}>
            <ThemedText style={{
              fontSize: 16,
              fontWeight: '600',
              color: AppColors.gray[500],
              marginBottom: 16,
              textAlign: 'center',
            }}>
              What's Coming
            </ThemedText>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginBottom: 16,
            }}>
              <View style={{ alignItems: 'center' }}>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: AppColors.green[100],
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <ThemedText style={{ fontSize: 20 }}>💡</ThemedText>
                </View>
                <ThemedText style={{
                  fontSize: 12,
                  color: AppColors.gray[400],
                  textAlign: 'center',
                }}>Smart Tips</ThemedText>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: AppColors.primary[200],
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <ThemedText style={{ fontSize: 20 }}>📊</ThemedText>
                </View>
                <ThemedText style={{
                  fontSize: 12,
                  color: AppColors.gray[400],
                  textAlign: 'center',
                }}>Guides</ThemedText>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: AppColors.yellow[100],
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <ThemedText style={{ fontSize: 20 }}>🎯</ThemedText>
                </View>
                <ThemedText style={{
                  fontSize: 12,
                  color: AppColors.gray[400],
                  textAlign: 'center',
                }}>Strategies</ThemedText>
              </View>
            </View>
          </View>

          {/* Call to Action Button */}
          <TouchableOpacity
            style={{
              backgroundColor: AppColors.primary[300],
              paddingVertical: 16,
              paddingHorizontal: 32,
              borderRadius: 16,
              shadowColor: AppColors.primary[300],
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 8,
            }}
            onPress={handleNotifyMe}
            activeOpacity={0.8}
          >
            <ThemedText style={{
              color: AppColors.gray[0],
              fontSize: 16,
              fontWeight: '600',
            }}>
              Notify Me
            </ThemedText>
          </TouchableOpacity>

          {/* Stay Tuned Text */}
          <ThemedText style={{
            fontSize: 14,
            color: AppColors.gray[300],
            textAlign: 'center',
            marginTop: 24,
            fontStyle: 'italic',
          }}>
            Stay tuned for updates!
          </ThemedText>
        </Animated.View>
      </View>
    </ThemedView>
  );
}
