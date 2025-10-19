import React from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { AppColors } from "@/constants/Colors";
import { Icon } from "@/components/Icon";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useExpenses } from "@/hooks/useExpenses";
import { CategoryIcon, CategoryType, getCategoryFromTransaction } from "@/components/CategoryIcon";
import { scale } from "@/lib/scale";
import { spacing, radii, colors } from "@/lib/theme";
import { cardShadow } from "@/lib/shadow";

export default function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { transactions } = useExpenses();

  const tx = transactions.find(t => String(t.id) === String(id));

  const merchant = tx?.merchant ?? 'Transaction';
  const amount = tx?.amount ?? 0;
  const date = tx?.date ?? new Date().toISOString().split('T')[0];
  const outcomeBsb = '0492819';
  const outcomeAcc = 'xxx-xxx xxxx2839';
  const institution = 'STACRBUCK';
  const address = 'PARRAMATTA, 0392';
  const category: CategoryType = (tx as any)?.category ?? getCategoryFromTransaction(merchant);

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: scale(40), backgroundColor: '#F6F3FF', flexGrow: 1 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: scale(24), top: scale(40) }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: scale(8), marginRight: scale(8) }}>
            <Icon name="leftArrow" size={scale(10)} color={'#111'} />
          </TouchableOpacity>
          <ThemedText style={{ fontSize: scale(20), fontWeight: '600' }}>Transaction detail</ThemedText>
        </View>

        {/* Card with floating icon */}
        <View style={{ alignItems: 'center', marginTop: scale(12) }}>
          <View style={{
            width: scale(84),
            height: scale(84),
            borderRadius: scale(42),
            backgroundColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            ...cardShadow,
          }}>
            <CategoryIcon category={category} size={scale(40)} color={AppColors.primary[300]} />
          </View>

          <View style={{
            backgroundColor: colors.surface,
            borderRadius: radii.xl,
            marginTop: -scale(42),
            paddingTop: scale(56),
            paddingBottom: scale(16),
            paddingHorizontal: spacing.lg,
            width: '100%',
            ...cardShadow,
          }}>
            <ThemedText style={{
              fontSize: scale(24),
              fontWeight: '800',
              textAlign: 'center',
              marginBottom: scale(6),
              color: colors.text,
            }}>{merchant}</ThemedText>
            <ThemedText style={{ textAlign: 'center', color: colors.muted, marginBottom: scale(10) }}>{formatHumanDate(date)}</ThemedText>
            <ThemedText style={{ textAlign: 'center', fontSize: scale(28), fontWeight: '900', marginBottom: scale(20) }}>${amount}</ThemedText>

            {/* Two-column details */}
            <RowSplit leftLabel="OUTCOME:" rightValue={`BSB: ${outcomeBsb}\nAcc: ${outcomeAcc}`} />
            <RowSplit leftLabel={""} rightValue={`${institution}\n${address}`} muted />
            <RowSplit leftLabel="NOTE:" rightValue="" />
          </View>
        </View>

        {/* Manage section */}
        <View style={{ marginTop: spacing.lg }}>
          <ThemedText style={{ fontSize: scale(22), fontWeight: '800', marginBottom: spacing.md }}>Manage</ThemedText>

          <ManageItem title="General Merchandise" left={<CategoryIcon category={category} size={scale(22)} color={AppColors.primary[300]} />} right={<Icon name="downIcon" size={scale(14)} color="#6F6F6F" />} />
          <ManageItem title="Tag Transaction" left={<CategoryIcon category={'miscellaneous'} size={scale(22)} color={AppColors.primary[300]} />} right={<Icon name="addIcon" size={scale(16)} color="#6F6F6F" />} />
          <ManageItem title="Split Bill" left={<CategoryIcon category={'drinks'} size={scale(22)} color={AppColors.primary[300]} />} right={<Icon name="rightArrow" size={scale(10)} color="#6F6F6F" />} />
          <ManageItem title="Exclude from tracking" left={<CategoryIcon category={'shopping'} size={scale(22)} color={AppColors.primary[300]} />} right={<Icon name="rightArrow" size={scale(10)} color="#6F6F6F" />} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function RowSplit({ leftLabel, rightValue, muted = false }: { leftLabel: string; rightValue: string; muted?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: scale(14) }}>
      <ThemedText style={{ color: '#8B8B8B', fontWeight: '600' }}>{leftLabel}</ThemedText>
      <View style={{ alignItems: 'flex-end' }}>
        {rightValue.split('\n').map((line, idx) => (
          <ThemedText key={idx} style={{ color: muted ? colors.muted : colors.text, fontWeight: muted ? '400' : '600' }}>{line}</ThemedText>
        ))}
      </View>
    </View>
  );
}

function ManageItem({ title, left, right }: { title: string; left: React.ReactNode; right: React.ReactNode }) {
  return (
    <View style={{
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      marginBottom: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      ...cardShadow,
    }}>
      <View style={{ width: scale(42), height: scale(42), borderRadius: scale(12), backgroundColor: '#F3ECFF', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md }}>
        {left}
      </View>
      <ThemedText style={{ fontSize: scale(16), fontWeight: '700', flex: 1 }}>{title}</ThemedText>
      {right}
    </View>
  );
}

function formatHumanDate(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  const formatter = new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  return formatter.format(d);
} 