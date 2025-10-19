import React, { useState } from "react";
import { View, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Icon } from "@/components/Icon";
import { AppColors } from "@/constants/Colors";
import { useExpenses } from "@/hooks/useExpenses";
import { scale } from "@/lib/scale";
import { spacing, radii, colors, typography } from "@/lib/theme";
import { cardShadow } from "@/lib/shadow";

export default function NewTransactionScreen() {
  const { addTransaction, accounts } = useExpenses();
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [accountId, setAccountId] = useState<string | null>(accounts[0]?.id ?? null);

  const handleSubmit = () => {
    const parsedAmount = parseFloat(amount || '0');
    if (!merchant || !parsedAmount) return;
    addTransaction({
      merchant,
      amount: parsedAmount,
      date,
      icon: 'T',
      category: 'miscellaneous',
      status: 'Completed',
      accountId: accountId ?? undefined,
    });
    try {
      // @ts-ignore
      const { useRouter } = require('expo-router');
      const router = useRouter();
      router.back();
    } catch {}
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl }}>
          <View style={{
            backgroundColor: AppColors.primary[300],
            borderRadius: radii.xl,
            padding: spacing.lg,
            marginBottom: spacing.lg,
            ...cardShadow,
          }}>
            <ThemedText style={{ fontSize: scale(20), fontWeight: '700', color: '#fff', marginBottom: scale(8) }}>New Transaction</ThemedText>
            <ThemedText style={{ color: 'rgba(255,255,255,0.85)' }}>Add a new record</ThemedText>
          </View>

          <View style={{ backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing.md, ...cardShadow }}>
            <ThemedText style={{ fontSize: scale(14), marginBottom: scale(8) }}>Merchant</ThemedText>
            <TextInput
              placeholder="e.g., Starbucks"
              value={merchant}
              onChangeText={setMerchant}
              style={{ backgroundColor: '#F5F6F8', borderRadius: radii.md, padding: spacing.md, marginBottom: spacing.md }}
              placeholderTextColor="#9AA0A6"
            />

            <ThemedText style={{ fontSize: scale(14), marginBottom: scale(8) }}>Amount</ThemedText>
            <TextInput
              placeholder="e.g., 12.50"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              style={{ backgroundColor: '#F5F6F8', borderRadius: radii.md, padding: spacing.md, marginBottom: spacing.md }}
              placeholderTextColor="#9AA0A6"
            />

            <ThemedText style={{ fontSize: scale(14), marginBottom: scale(8) }}>Date (YYYY-MM-DD)</ThemedText>
            <TextInput
              placeholder="YYYY-MM-DD"
              value={date}
              onChangeText={setDate}
              style={{ backgroundColor: '#F5F6F8', borderRadius: radii.md, padding: spacing.md, marginBottom: spacing.md }}
              placeholderTextColor="#9AA0A6"
            />

            <ThemedText style={{ fontSize: scale(14), marginBottom: scale(8) }}>Account</ThemedText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md }}>
              {accounts.map(acc => (
                <TouchableOpacity key={acc.id} onPress={() => setAccountId(acc.id)}
                  style={{
                    paddingVertical: scale(8),
                    paddingHorizontal: spacing.md,
                    borderRadius: radii.lg,
                    backgroundColor: accountId === acc.id ? AppColors.primary[300] : '#F0F1F3',
                    marginRight: spacing.sm,
                    marginBottom: spacing.sm,
                    ...cardShadow,
                  }}>
                  <ThemedText style={{ color: accountId === acc.id ? '#fff' : '#111' }}>{acc.name}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={handleSubmit} style={{
              backgroundColor: AppColors.primary[300],
              borderRadius: radii.md,
              paddingVertical: scale(14),
              alignItems: 'center',
              ...cardShadow,
            }}>
              <ThemedText style={{ color: '#fff', fontWeight: '700' }}>Create Transaction</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
} 