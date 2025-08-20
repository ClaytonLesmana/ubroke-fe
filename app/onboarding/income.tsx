import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAuth } from "@/hooks/useAuth";
import { AppColors } from "@/constants/Colors";

export default function IncomePage() {
  const [salary, setSalary] = useState("");
  const [payFrequency, setPayFrequency] = useState("Weekly");
  const [nextPayDate, setNextPayDate] = useState("Oct 25, 2025");
  const [isLoading, setIsLoading] = useState(false);

  const { updateOnboardingData, onboardingData } = useOnboarding();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Pre-fill with existing data
    if (onboardingData) {
      setSalary(onboardingData.salary?.toString() || "");
      setPayFrequency(onboardingData.payFrequency || "Weekly");
      setNextPayDate(onboardingData.nextPayDate || "Oct 25, 2025");
    }
  }, [onboardingData]);

  const formatCurrency = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");
    const number = parseFloat(numericValue);

    if (isNaN(number)) return "";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const parseCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    return numericValue ? parseFloat(numericValue) : undefined;
  };

  const validateAndContinue = async () => {
    setIsLoading(true);

    try {
      const incomeData = {
        salary: parseCurrency(salary),
        payFrequency,
        nextPayDate: nextPayDate || undefined,
      };

      await updateOnboardingData(incomeData);
      router.push("/onboarding/tutorial");
    } catch (error) {
      Alert.alert("Error", "Failed to save income data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/onboarding/tutorial");
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: AppColors.gray[0],
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
              Step 2/3 complete
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
                  backgroundColor: AppColors.gray[100],
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
              Show Us the Money!
            </ThemedText>
            <ThemedText style={{
              fontSize: 16,
              fontWeight: '400',
              color: AppColors.gray[400],
              lineHeight: 24,
              textAlign: 'center',
            }}>
              Add your income deets to track your cashflow like a pro. Skip for now if you want!
            </ThemedText>
          </View>

          {/* Form */}
          <View style={{
            flex: 1,
          }}>
            {/* Salary Input */}
            <View style={{
              marginBottom: 20,
            }}>
              <ThemedText style={{
                fontSize: 14,
                fontWeight: '500',
                color: AppColors.gray[400],
                marginBottom: 8,
              }}>How much is your salary?</ThemedText>
              <TextInput
                style={{
                  backgroundColor: AppColors.gray[0],
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  fontSize: 16,
                  color: AppColors.gray[500],
                  borderWidth: 1,
                  borderColor: AppColors.gray[200],
                }}
                placeholder="Enter a number"
                placeholderTextColor={AppColors.gray[300]}
                value={salary ? formatCurrency(salary) : salary}
                onChangeText={setSalary}
                keyboardType="numeric"
              />
            </View>

            {/* Pay Frequency */}
            <View style={{
              marginBottom: 20,
            }}>
              <ThemedText style={{
                fontSize: 14,
                fontWeight: '500',
                color: AppColors.gray[400],
                marginBottom: 8,
              }}>Pay frequency</ThemedText>
              <View style={{
                backgroundColor: AppColors.gray[0],
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: AppColors.gray[200],
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <ThemedText style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: AppColors.gray[500],
                }}>
                  {payFrequency}
                </ThemedText>
                <View style={{
                  width: 0,
                  height: 0,
                  backgroundColor: 'transparent',
                  borderStyle: 'solid',
                  borderLeftWidth: 6,
                  borderRightWidth: 6,
                  borderTopWidth: 8,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderTopColor: AppColors.gray[300],
                }} />
              </View>
            </View>

            {/* Next Pay Date */}
            <View style={{
              marginBottom: 40,
            }}>
              <ThemedText style={{
                fontSize: 14,
                fontWeight: '500',
                color: AppColors.gray[400],
                marginBottom: 8,
              }}>Next paydate</ThemedText>
              <View style={{
                backgroundColor: AppColors.gray[0],
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: AppColors.gray[200],
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <ThemedText style={{
                  fontSize: 16,
                  color: AppColors.gray[500],
                }}>
                  {nextPayDate}
                </ThemedText>
                <View style={{
                  width: 20,
                  height: 20,
                  backgroundColor: AppColors.gray[300],
                  borderRadius: 4,
                }} />
              </View>
            </View>

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
                onPress={validateAndContinue}
                disabled={isLoading}
              >
                <ThemedText style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: AppColors.gray[0],
                }}>
                  {isLoading ? "Loading..." : "Next"}
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: AppColors.gray[0],
                  borderRadius: 32,
                  borderWidth: 2,
                  borderColor: AppColors.primary[300],
                  paddingVertical: 16,
                  alignItems: 'center',
                  shadowColor: 'rgba(147, 109, 255, 0.3)',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 1,
                  shadowRadius: 8,
                  elevation: 4,
                  opacity: isLoading ? 0.6 : 1,
                }}
                onPress={handleSkip}
                disabled={isLoading}
              >
                <ThemedText style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: AppColors.primary[300],
                }}>
                  Skip
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* Footer Text */}
            <ThemedText style={{
              fontSize: 14,
              color: AppColors.gray[500],
              textAlign: 'center',
              fontStyle: 'italic',
            }}>
              Let's get that payday vibe going!
            </ThemedText>
          </View>
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
            backgroundColor: 'rgba(255,255,255,0.2)',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 16,
          }}
          onPress={() => router.back()}
        >
          <ThemedText style={{ color: 'white', fontSize: 12 }}>← Back</ThemedText>
        </TouchableOpacity>
        
        <View style={{
          backgroundColor: 'rgba(255,255,255,0.2)',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
        }}>
          <ThemedText style={{ fontSize: 12, color: 'white' }}>4/5</ThemedText>
        </View>
        
        <TouchableOpacity
          style={{
            backgroundColor: AppColors.primary[300],
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 16,
          }}
          onPress={() => router.push('/onboarding/tutorial')}
        >
          <ThemedText style={{ color: 'white', fontSize: 12 }}>Next →</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
