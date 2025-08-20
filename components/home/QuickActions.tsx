import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';

interface QuickAction {
  icon: string;
  title: string;
  onPress: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.quickActions}>
        {actions.map((action, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.quickActionButton} 
            onPress={action.onPress}
          >
            <ThemedText style={styles.quickActionIcon}>{action.icon}</ThemedText>
            <ThemedText style={styles.quickActionText}>{action.title}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      <ThemedText style={styles.nextDropQuestion}>When's your next drop?</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  quickActionButton: {
    backgroundColor: AppColors.primary[100],
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: AppColors.gray[500],
    textAlign: 'center',
  },
  nextDropQuestion: {
    fontSize: 14,
    color: AppColors.gray[400],
    textAlign: 'center',
    marginBottom: 16,
  },
}); 