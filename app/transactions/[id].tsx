import React from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { AppColors } from "@/constants/Colors";
import { Icon } from "@/components/Icon";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useExpenses } from "@/hooks/useExpenses";
import { CategoryIcon, CategoryType, getCategoryFromTransaction } from "@/components/CategoryIcon";

export default function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { transactions } = useExpenses();

  const tx = transactions.find(t => String(t.id) === String(id));

  // Fallback shape if not found
  const merchant = tx?.merchant ?? 'Transaction';
  const amount = tx?.amount ?? 0;
  const date = tx?.date ?? new Date().toISOString().split('T')[0];
//   const status = (tx as any)?.status ?? 'Pending';
  const outcomeBsb = '0492819';
  const outcomeAcc = 'xxx-xxx xxxx2839';
  const institution = 'STACRBUCK';
  const address = 'PARRAMATTA, 0392';
  const category: CategoryType = (tx as any)?.category ?? getCategoryFromTransaction(merchant);

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40, backgroundColor: '#F6F3FF', flexGrow: 1 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 36, top:40 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
            <Icon name="leftArrow" size={10} color={'#111'} />
          </TouchableOpacity>
          <ThemedText style={{ fontSize: 20, fontWeight: '600' }}>Transaction detail</ThemedText>
        </View>

        {/* Card with floating icon */}
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <View style={{
            width: 75,
            height: 75,
            borderRadius: 58,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 6,
            zIndex: 2,
          }}>
            <CategoryIcon category={category} size={75} color={AppColors.primary[300]} />
          </View>

          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 28,
            marginTop: -58,
            paddingTop: 76,
            paddingBottom: 18,
            paddingHorizontal: 20,
            width: '100%',
          }}>
            <ThemedText style={{
              fontSize: 28,
              fontWeight: '800',
              textAlign: 'center',
              marginBottom: 6,
              color: '#111',
            }}>{merchant}</ThemedText>
            <ThemedText style={{ textAlign: 'center', color: '#9AA0A6', marginBottom: 12 }}>{formatHumanDate(date)}</ThemedText>
            <ThemedText style={{ textAlign: 'center', fontSize: 32, fontWeight: '900', marginBottom: 24 }}>${amount}</ThemedText>

            {/* Two-column details */}
            {/* <RowSplit leftLabel="PENDING:" rightValue={String(status).toUpperCase()} /> */}
            <RowSplit leftLabel="OUTCOME:" rightValue={`BSB: ${outcomeBsb}\nAcc: ${outcomeAcc}`} />
            <RowSplit leftLabel={""} rightValue={`${institution}\n${address}`} muted />
            <RowSplit leftLabel="NOTE:" rightValue="" />
          </View>
        </View>

        {/* Manage section */}
        <View style={{ marginTop: 24 }}>
          <ThemedText style={{ fontSize: 24, fontWeight: '800', marginBottom: 12 }}>Manage</ThemedText>

          <ManageItem title="General Merchandise" left={<CategoryIcon category={category} size={22} color={AppColors.primary[300]} />} right={<Icon name="downIcon" size={14} color="#6F6F6F" />} />
          <ManageItem title="Tag Transaction" left={<CategoryIcon category={'miscellaneous'} size={22} color={AppColors.primary[300]} />} right={<Icon name="addIcon" size={16} color="#6F6F6F" />} />
          <ManageItem title="Split Bill" left={<CategoryIcon category={'drinks'} size={22} color={AppColors.primary[300]} />} right={<Icon name="rightArrow" size={10} color="#6F6F6F" />} />
          <ManageItem title="Exclude from tracking" left={<CategoryIcon category={'shopping'} size={22} color={AppColors.primary[300]} />} right={<Icon name="rightArrow" size={10} color="#6F6F6F" />} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function RowSplit({ leftLabel, rightValue, muted = false }: { leftLabel: string; rightValue: string; muted?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
      <ThemedText style={{ color: '#8B8B8B', fontWeight: '600' }}>{leftLabel}</ThemedText>
      <View style={{ alignItems: 'flex-end' }}>
        {rightValue.split('\n').map((line, idx) => (
          <ThemedText key={idx} style={{ color: muted ? '#9AA0A6' : '#111', fontWeight: muted ? '400' : '600' }}>{line}</ThemedText>
        ))}
      </View>
    </View>
  );
}

function ManageItem({ title, left, right }: { title: string; left: React.ReactNode; right: React.ReactNode }) {
  return (
    <View style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 22,
      paddingHorizontal: 14,
      paddingVertical: 14,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
    }}>
      <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: '#F3ECFF', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
        {left}
      </View>
      <ThemedText style={{ fontSize: 16, fontWeight: '700', flex: 1 }}>{title}</ThemedText>
      {right}
    </View>
  );
}

function formatHumanDate(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  const formatter = new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  return formatter.format(d);
} 