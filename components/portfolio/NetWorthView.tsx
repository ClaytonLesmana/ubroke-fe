import React from "react";
import { ScrollView, TouchableOpacity, View, Text } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { scale } from "@/lib/scale";
import { spacing, radii, colors } from "@/lib/theme";
import { cardShadow } from "@/lib/shadow";

interface NetWorthData {
  netWorth: number;
  monthlyChange: number;
  monthlyChangePercent: number;
  totalAssets: number;
  totalLiabilities: number;
}

interface NetWorthViewProps {
  netWorth: NetWorthData;
}

export function NetWorthView({ netWorth }: NetWorthViewProps) {
  return (
    <ScrollView style={{ flex: 1 }}>
      {/* Account sections - hero is now in parent component */}
      <View style={{ paddingHorizontal: spacing.lg }}>
        {/* Bank section */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.lg,
        }}>
          <Text style={{
            fontSize: scale(20),
            fontWeight: 'bold',
            color: colors.text,
          }}>
            Bank
          </Text>
          <Text style={{
            fontSize: scale(18),
            fontWeight: 'bold',
            color: colors.text,
          }}>
            $55
          </Text>
        </View>

        {/* Outcome transaction */}
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          padding: spacing.lg,
          marginBottom: spacing.sm,
          flexDirection: 'row',
          alignItems: 'center',
          ...cardShadow,
        }}>
          <View style={{
            width: scale(40),
            height: scale(40),
            borderRadius: scale(20),
            backgroundColor: '#FFF3CD',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacing.md,
          }}>
            <Text style={{ fontSize: scale(20) }}>💎</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: scale(16),
              fontWeight: '600',
              color: colors.text,
              marginBottom: scale(2),
            }}>
              Outcome
            </Text>
            <Text style={{
              fontSize: scale(12),
              color: '#666',
            }}>
              Syncing....
            </Text>
            <Text style={{
              fontSize: scale(12),
              color: '#999',
              marginTop: scale(2),
            }}>
              Update 4 minutes ago
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{
              fontSize: scale(16),
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: scale(8),
            }}>
              $15
            </Text>
            <TouchableOpacity style={{
              backgroundColor: colors.primary,
              paddingHorizontal: spacing.md,
              paddingVertical: scale(6),
              borderRadius: radii.md,
            }}>
              <Text style={{
                color: '#FFFFFF',
                fontSize: scale(12),
                fontWeight: '600',
              }}>Detail</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Income transaction */}
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          padding: spacing.lg,
          marginBottom: spacing.lg,
          flexDirection: 'row',
          alignItems: 'center',
          ...cardShadow,
        }}>
          <View style={{
            width: scale(40),
            height: scale(40),
            borderRadius: scale(20),
            backgroundColor: '#FFF3CD',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacing.md,
          }}>
            <Text style={{ fontSize: scale(20) }}>💎</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: scale(16),
              fontWeight: '600',
              color: colors.text,
              marginBottom: scale(2),
            }}>
              Income
            </Text>
            <Text style={{
              fontSize: scale(12),
              color: '#666',
            }}>
              Syncing....
            </Text>
            <Text style={{
              fontSize: scale(12),
              color: '#999',
              marginTop: scale(2),
            }}>
              Update 4 minutes ago
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{
              fontSize: scale(16),
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: scale(8),
            }}>
              $35
            </Text>
            <TouchableOpacity style={{
              backgroundColor: colors.primary,
              paddingHorizontal: spacing.md,
              paddingVertical: scale(6),
              borderRadius: radii.md,
            }}>
              <Text style={{
                color: '#FFFFFF',
                fontSize: scale(12),
                fontWeight: '600',
              }}>Detail</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Saving section */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.lg,
        }}>
          <Text style={{
            fontSize: scale(20),
            fontWeight: 'bold',
            color: colors.text,
          }}>
            Saving
          </Text>
          <Text style={{
            fontSize: scale(18),
            fontWeight: 'bold',
            color: colors.text,
          }}>
            $75
          </Text>
        </View>

        {/* Saving Income transaction */}
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          padding: spacing.lg,
          marginBottom: spacing.lg,
          flexDirection: 'row',
          alignItems: 'center',
          ...cardShadow,
        }}>
          <View style={{
            width: scale(40),
            height: scale(40),
            borderRadius: scale(20),
            backgroundColor: '#FFF3CD',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacing.md,
          }}>
            <Text style={{ fontSize: scale(20) }}>💎</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: scale(16),
              fontWeight: '600',
              color: colors.text,
              marginBottom: scale(2),
            }}>
              Income
            </Text>
            <Text style={{
              fontSize: scale(12),
              color: '#666',
            }}>
              Syncing....
            </Text>
            <Text style={{
              fontSize: scale(12),
              color: '#999',
              marginTop: scale(2),
            }}>
              Update 4 minutes ago
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{
              fontSize: scale(16),
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: scale(8),
            }}>
              $35
            </Text>
            <TouchableOpacity style={{
              backgroundColor: colors.primary,
              paddingHorizontal: spacing.md,
              paddingVertical: scale(6),
              borderRadius: radii.md,
            }}>
              <Text style={{
                color: '#FFFFFF',
                fontSize: scale(12),
                fontWeight: '600',
              }}>Detail</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
} 