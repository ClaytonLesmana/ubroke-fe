import React from "react";
import { View, TouchableOpacity, ScrollView, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Icon } from "@/components/Icon";
import { scale } from "@/lib/scale";
import { spacing, radii, colors } from "@/lib/theme";
import { cardShadow } from "@/lib/shadow";

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = React.useState<'Forum' | 'Leaderboard' | 'Group'>('Forum');

  const tabs: Array<'Forum' | 'Leaderboard' | 'Group'> = ['Forum', 'Leaderboard', 'Group'];

  const FeedCard = ({
    avatar,
    name,
    time,
    text,
    replies,
    shares,
    likes,
  }: { avatar: any; name: string; time: string; text: string; replies: number; shares: number; likes: number }) => (
    <View style={{ backgroundColor: '#FFFFFF', borderRadius: radii.xl, padding: spacing.lg, marginBottom: spacing.lg, ...cardShadow }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
        <Image source={avatar} style={{ width: scale(44), height: scale(44), borderRadius: scale(22), marginRight: spacing.md }} />
        <ThemedText style={{ fontSize: scale(18), fontWeight: '700', color: '#1B1B1B' }}>{name}</ThemedText>
        <ThemedText style={{ marginLeft: scale(8), fontSize: scale(12), color: '#9BA0A6' }}>• {time}</ThemedText>
      </View>
      <ThemedText style={{ fontSize: scale(16), lineHeight: scale(22), color: '#1B1B1B' }}>{text}</ThemedText>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(16), marginTop: spacing.md }}>
        <ThemedText style={{ fontSize: scale(12), color: '#6B7280' }}>💬 {replies}</ThemedText>
        <ThemedText style={{ fontSize: scale(12), color: '#6B7280' }}>🔁 {shares}</ThemedText>
        <ThemedText style={{ fontSize: scale(12), color: '#6B7280' }}>❤️ {likes}</ThemedText>
      </View>
      <TouchableOpacity style={{ marginTop: spacing.md }}>
        <ThemedText style={{ fontSize: scale(14), color: colors.primary, fontWeight: '600' }}>Show this thread</ThemedText>
      </TouchableOpacity>
    </View>
  );

  return (
    <ThemedView style={{ flex: 1, backgroundColor: '#F5F1FF' }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: scale(24), paddingBottom: scale(140) }}>
        {/* Segmented Tabs */}
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: radii.pill, marginTop: scale(60), padding: scale(6), flexDirection: 'row', ...cardShadow }}>
          {tabs.map(tab => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={{ flex: 1, paddingVertical: scale(12), alignItems: 'center', borderRadius: radii.pill, backgroundColor: activeTab === tab ? colors.primary : 'transparent' }}>
              <ThemedText style={{ fontSize: scale(14), fontWeight: '600', color: activeTab === tab ? '#fff' : '#848484' }}>{tab}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section Title */}
        <ThemedText style={{ fontSize: scale(22), fontWeight: '800', color: '#1B1B1B', marginTop: spacing.xl, marginBottom: spacing.md }}>Explore Community</ThemedText>

        {/* Feed Cards (mock) */}
        <FeedCard
          avatar={require('@/assets/images/react-logo.png')}
          name="Laura Niana"
          time="1h"
          text={`🔥 Omg same! I thought they were just shortcuts. Didn’t even realize you could earn a badge with them 😭`}
          replies={17}
          shares={12}
          likes={28}
        />
        <FeedCard
          avatar={require('@/assets/images/partial-react-logo.png')}
          name="Saleh Husein"
          time="4h"
          text={`hat’s cool there’s a “Explore Now” button for anyone not ready to upload anything yet.\nThough personally... I feel like a short visual tutorial after skipping would be super helpful.`}
          replies={25}
          shares={9}
          likes={17}
        />
        <FeedCard
          avatar={require('@/assets/images/partial-react-logo.png')}
          name="Adam Toro"
          time="7h"
          text={`idc if it’s $500 out of $1M, that little green progress bar got me feeling made it 💚`}
          replies={11}
          shares={6}
          likes={21}
        />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity activeOpacity={0.9} style={{ position: 'absolute', bottom: scale(28), alignSelf: 'center', width: scale(64), height: scale(64), borderRadius: scale(32), backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', ...cardShadow }}>
        <Icon name="chat" size={scale(26)} color={'#fff'} />
      </TouchableOpacity>
    </ThemedView>
  );
}
