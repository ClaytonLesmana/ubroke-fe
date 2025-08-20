import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAuth } from "@/hooks/useAuth";
import { AppColors } from "@/constants/Colors";
import { Image } from "expo-image";
export default function TutorialPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { completeOnboarding, onboardingData } = useOnboarding();
  const { isAuthenticated, user, updateOnboardingData } = useAuth();

  const handleUploadStatement = async () => {
    Alert.alert("Upload Statement", "Statement upload feature coming soon!");
    // TODO: Implement statement upload
  };

  const handleAddTransaction = async () => {
    Alert.alert("Add Transaction", "Transaction entry feature coming soon!");
    // TODO: Implement transaction entry
  };

  const handleNext = async () => {
    setIsLoading(true);
    try {
      await completeOnboarding(onboardingData || {});
      
              // Try to update database with user data
        try {
          await updateOnboardingData({
            firstName: onboardingData?.firstName || "",
            lastName: onboardingData?.lastName || "",
            age: onboardingData?.age || null,
            accountCount: onboardingData?.accountCount || null,
            assets: onboardingData?.assets || null,
            liabilities: onboardingData?.liabilities || null,
            salary: onboardingData?.salary || null,
            salaryFrequency: onboardingData?.salaryFrequency || null,
            nextPayDate: onboardingData?.nextPayDate || null,
          });
          console.log("Database updated successfully");
        } catch (dbError) {
          console.error("Database update failed:", dbError);
          Alert.alert(
            "Partial Success",
            "Your onboarding data was saved locally, but there was an issue syncing with the server. You can continue using the app and your data will sync later."
          );
        }
      
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      Alert.alert("Onboarding Error", "Failed to complete onboarding. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    setIsLoading(true);
    try {
      await completeOnboarding(onboardingData || {});
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      Alert.alert("Onboarding Error", "Failed to complete onboarding. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: AppColors.gray[0]
    }}>
      <SafeAreaView style={{
        flex: 1,
      }}>
        <ScrollView 
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: 40,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Indicator */}
          <View style={{
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: 20,
            marginBottom: 40,
          }}>
            <ThemedText style={{
              textAlign: 'center',
              justifyContent: 'center',
              color: AppColors.gray[500],
              fontSize: 12,
              fontWeight: '600',
              lineHeight: 18,
            }}>
              Step 3/3 complete
            </ThemedText>
            <View style={{
              alignSelf: 'stretch',
              height: 4,
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 12,
              flexDirection: 'row',
            }}>
              <View style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 4,
                flexDirection: 'row',
              }}>
                <View style={{
                  width: 107,
                  height: 6,
                  backgroundColor: AppColors.primary[300],
                  borderRadius: 55,
                }} />
                <View style={{
                  width: 107,
                  height: 6,
                  backgroundColor: AppColors.primary[300],
                  borderRadius: 55,
                }} />
                <View style={{
                  width: 107,
                  height: 6,
                  backgroundColor: AppColors.primary[300],
                  borderRadius: 55,
                }} />
              </View>
            </View>
          </View>

          {/* Header */}
          <View style={{
            marginBottom: 40,
          }}>
            <ThemedText style={{
              fontSize: 32,
              fontWeight: '700',
              color: AppColors.gray[500],
              lineHeight: 40,
              marginBottom: 12,
              textAlign: 'center',
            }}>
              Kick Off Your Money Game
            </ThemedText>
            <ThemedText style={{
              fontSize: 16,
              fontWeight: '400',
              color: AppColors.gray[400],
              lineHeight: 24,
              textAlign: 'center',
            }}>
              Drop a bank statement or add a purchase to start
            </ThemedText>
          </View>

          {/* Upload Bank Statement Area */}
          <View style={{
            marginBottom: 24,
          }}>
            <View style={{
              borderWidth: 2,
              borderColor: AppColors.gray[200],
              borderStyle: 'dashed',
              borderRadius: 16,
              padding: 32,
              alignItems: 'center',
              backgroundColor: AppColors.gray[0],
            }}>
              {/* Document Icon */}
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}>
                    <Image
                      source={require('@/assets/images/documentIcon.png')}
                      style={{ width: 42, height: 42 }}
                    />
              </View>
              
              {/* Upload Text */}
              <ThemedText style={{
                fontSize: 18,
                fontWeight: '600',
                color: AppColors.gray[500],
                marginBottom: 8,
                textAlign: 'center',
              }}>
                Upload Bank Statement
              </ThemedText>
              
              <ThemedText style={{
                fontSize: 14,
                color: AppColors.gray[400],
                marginBottom: 24,
                textAlign: 'center',
              }}>
                Supported format: PDF/CSV
              </ThemedText>
              
              {/* Upload Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: '#936DFF',
                  paddingLeft: 32,
                  paddingRight: 32,
                  paddingTop: 8,
                  paddingBottom: 8,
                  borderRadius: 99,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: 'rgba(13, 13, 18, 0.12)',
                  shadowOffset: { width: 1, height: 2 },
                  shadowOpacity: 1,
                  shadowRadius: 4,
                  elevation: 4,
                  borderWidth: 1,
                  borderColor: 'rgba(239.91, 234.60, 255, 0.12)',
                }}
                onPress={handleUploadStatement}
              >
                <ThemedText style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: AppColors.gray[0],
                  lineHeight: 18,
                  letterSpacing: 0.24,
                  textAlign: 'center',
                }}>
                  Upload File
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Add Manual Transaction Button */}
          <TouchableOpacity
            style={{
              backgroundColor: AppColors.gray[0],
              borderRadius: 32,
              borderWidth: 1,
              borderColor: AppColors.gray[200],
              paddingVertical: 16,
              paddingHorizontal: 20,
              alignItems: 'center',
              marginBottom: 40,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
            onPress={handleAddTransaction}
          >
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Image source={require('@/assets/images/addIcon.png')} style={{ width: 18, height: 18, marginRight: 8 }}></Image>
              <ThemedText style={{
                fontSize: 16,
                fontWeight: '500',
                color: AppColors.gray[500],
              }}>
                Add Manual Transaction
              </ThemedText>
            </View>
          </TouchableOpacity>

          {/* Action Buttons */}
          <View style={{
            gap: 16,
            marginBottom: 24,
          }}>
            <TouchableOpacity
              style={{
                backgroundColor: AppColors.primary[300],
                borderRadius: 32,
                paddingVertical: 16,
                alignItems: 'center',
                shadowColor: 'rgba(147, 109, 255, 0.3)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 8,
                elevation: 4,
                opacity: isLoading ? 0.6 : 1,
              }}
              onPress={handleNext}
              disabled={isLoading}
            >
              <ThemedText style={{
                fontSize: 16,
                fontWeight: '600',
                color: AppColors.gray[0],
              }}>
                {isLoading ? "Loading..." : "Finish"}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Footer Text */}
          <ThemedText style={{
            fontSize: 14,
            color: AppColors.gray[400],
            textAlign: 'center',
            fontStyle: 'italic',
          }}>
            Let's make your wallet pop!
          </ThemedText>
        </ScrollView>
      </SafeAreaView>

      {/* Development Navigation */}
      <View style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#f0f0f0',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 16,
          }}
          onPress={() => router.back()}
        >
          <ThemedText style={{ color: '#666', fontSize: 12 }}>← Back</ThemedText>
        </TouchableOpacity>
        
        <View style={{
          backgroundColor: 'rgba(0,0,0,0.1)',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
        }}>
          <ThemedText style={{ fontSize: 12, color: '#666' }}>5/5</ThemedText>
        </View>
        
        <TouchableOpacity
          style={{
            backgroundColor: AppColors.primary[300],
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 16,
          }}
          onPress={() => router.push('/(tabs)')}
        >
          <ThemedText style={{ color: 'white', fontSize: 12 }}>Finish →</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
