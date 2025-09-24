import React from "react";
import { ScrollView, TouchableOpacity, View, Text } from "react-native";
import { ThemedText } from "@/components/ThemedText";

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
      <View style={{ paddingHorizontal: 20 }}>
        {/* Bank section */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#000',
          }}>
            Bank
          </Text>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#000',
          }}>
            $55
          </Text>
        </View>

        {/* Outcome transaction */}
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 16,
          marginBottom: 8,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#FFF3CD',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}>
            <Text style={{ fontSize: 20 }}>💎</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#000',
              marginBottom: 2,
            }}>
              Outcome
            </Text>
            <Text style={{
              fontSize: 12,
              color: '#666',
            }}>
              Syncing....
            </Text>
            <Text style={{
              fontSize: 12,
              color: '#999',
              marginTop: 2,
            }}>
              Update 4 minutes ago
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#000',
              marginBottom: 8,
            }}>
              $15
            </Text>
            <TouchableOpacity style={{
              backgroundColor: '#8B5CF6',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
            }}>
              <Text style={{
                color: '#FFFFFF',
                fontSize: 12,
                fontWeight: '600',
              }}>Detail</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Income transaction */}
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#FFF3CD',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}>
            <Text style={{ fontSize: 20 }}>💎</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#000',
              marginBottom: 2,
            }}>
              Income
            </Text>
            <Text style={{
              fontSize: 12,
              color: '#666',
            }}>
              Syncing....
            </Text>
            <Text style={{
              fontSize: 12,
              color: '#999',
              marginTop: 2,
            }}>
              Update 4 minutes ago
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#000',
              marginBottom: 8,
            }}>
              $35
            </Text>
            <TouchableOpacity style={{
              backgroundColor: '#8B5CF6',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
            }}>
              <Text style={{
                color: '#FFFFFF',
                fontSize: 12,
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
          marginBottom: 20,
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#000',
          }}>
            Saving
          </Text>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#000',
          }}>
            $75
          </Text>
        </View>

        {/* Saving Income transaction */}
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#FFF3CD',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}>
            <Text style={{ fontSize: 20 }}>💎</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#000',
              marginBottom: 2,
            }}>
              Income
            </Text>
            <Text style={{
              fontSize: 12,
              color: '#666',
            }}>
              Syncing....
            </Text>
            <Text style={{
              fontSize: 12,
              color: '#999',
              marginTop: 2,
            }}>
              Update 4 minutes ago
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#000',
              marginBottom: 8,
            }}>
              $35
            </Text>
            <TouchableOpacity style={{
              backgroundColor: '#8B5CF6',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
            }}>
              <Text style={{
                color: '#FFFFFF',
                fontSize: 12,
                fontWeight: '600',
              }}>Detail</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
} 