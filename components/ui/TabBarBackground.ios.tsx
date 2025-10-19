import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { View, Platform } from 'react-native';
import { AppColors } from '@/constants/Colors';
import { scale } from '@/lib/scale';
import { radii } from '@/lib/theme';

export default function BlurTabBarBackground() {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderTopLeftRadius: radii.lg,
        borderTopRightRadius: radii.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -scale(2) },
        shadowOpacity: 0.1,
        shadowRadius: scale(4),
        elevation: Platform.select({ ios: 0, android: 8 }),
      }}
    />
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
