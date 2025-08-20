import React from 'react';
import { View, TouchableOpacity, Alert, Text, Image } from 'react-native';
import { AppColors } from '@/constants/Colors';
import { useOnboarding } from '@/hooks/useOnboarding';
import Svg, { Rect, Path, Defs, Filter, FeFlood, FeColorMatrix, FeOffset, FeGaussianBlur, FeComposite, FeBlend, G } from 'react-native-svg';

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const { resetOnboarding } = useOnboarding();

  const handleResetOnboarding = () => {
    Alert.alert(
      "Reset Onboarding",
      "This will reset the onboarding flow for testing. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetOnboarding()
              .then(() => {
                Alert.alert(
                  "Success",
                  "Onboarding has been reset. Please restart the app."
                );
              })
              .catch((error) => {
                Alert.alert("Error", "Failed to reset onboarding.");
              });
          },
        },
      ]
    );
  };

  const renderTabIcon = (routeName: string, isFocused: boolean, color: string) => {
    let activeImage: any = null;
    let inactiveImage: any = null;
    
    switch (routeName) {
      case 'index':
        activeImage = require('@/assets/images/homeActive.png');
        inactiveImage = require('@/assets/images/homeDeactivate.png');
        break;
      case 'chat':
        activeImage = require('@/assets/images/chat.png');
        inactiveImage = require('@/assets/images/chat.png');
        break;
      case 'community':
        activeImage = require('@/assets/images/communityActivate.png');
        inactiveImage = require('@/assets/images/communityDeactivate.png');
        break;
      case 'portfolio':
        activeImage = require('@/assets/images/portfolioActivate.png');
        inactiveImage = require('@/assets/images/portfolioDeactivate.png');
        break;
      case 'learn':
        activeImage = require('@/assets/images/learnActive.png');
        inactiveImage = require('@/assets/images/learnDeactivate.png');
        break;
    }

    // Special styling for chat tab (middle tab with SVG)
    if (routeName === 'chat') {
      return (
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: 65,
          height: 65,
          marginTop: -60, // Move up to create the elevated effect
        }}>
          <Svg width="125" height="125" viewBox="0 0 113 113" fill="none">
            <Defs>
              <Filter id="filter0_d_423_3400" x="0" y="0" width="113" height="113" filterUnits="userSpaceOnUse">
                <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
                <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <FeOffset dy="2"/>
                <FeGaussianBlur stdDeviation="12"/>
                <FeComposite in2="hardAlpha" operator="out"/>
                <FeColorMatrix type="matrix" values="0 0 0 0 0.576471 0 0 0 0 0.427451 0 0 0 0 1 0 0 0 0.75 0"/>
                <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_423_3400"/>
                <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_423_3400" result="shape"/>
              </Filter>
            </Defs>
            <G filter="url(#filter0_d_423_3400)">
              <Rect x="24" y="22" width="65" height="65" rx="32.5" fill="#936DFF"/>
              <Path d="M65.3333 42C66.571 42 67.758 42.4834 68.6332 43.3439C69.5083 44.2043 70 45.3714 70 46.5882V58.8235C70 60.0404 69.5083 61.2074 68.6332 62.0679C67.758 62.9284 66.571 63.4118 65.3333 63.4118H57.5556L49.7778 68V63.4118H46.6667C45.429 63.4118 44.242 62.9284 43.3668 62.0679C42.4917 61.2074 42 60.0404 42 58.8235V46.5882C42 45.3714 42.4917 44.2043 43.3668 43.3439C44.242 42.4834 45.429 42 46.6667 42H65.3333Z" fill="white"/>
              <Path d="M52.1111 49.6471H52.1267H52.1111Z" fill="white"/>
              <Path d="M59.8889 49.6471H59.9044H59.8889Z" fill="white"/>
              <Path d="M52.1111 55.7647C52.618 56.2734 53.2231 56.6775 53.8909 56.9534C54.5586 57.2293 55.2757 57.3714 56 57.3714C56.7243 57.3714 57.4414 57.2293 58.1091 56.9534C58.7769 56.6775 59.382 56.2734 59.8889 55.7647" fill="white"/>
              <Path d="M52.1111 49.6471H52.1267M59.8889 49.6471H59.9044M52.1111 55.7647C52.618 56.2734 53.2231 56.6775 53.8909 56.9534C54.5586 57.2293 55.2757 57.3714 56 57.3714C56.7243 57.3714 57.4414 57.2293 58.1091 56.9534C58.7769 56.6775 59.382 56.2734 59.8889 55.7647M65.3333 42C66.571 42 67.758 42.4834 68.6332 43.3439C69.5083 44.2043 70 45.3714 70 46.5882V58.8235C70 60.0404 69.5083 61.2074 68.6332 62.0679C67.758 62.9284 66.571 63.4118 65.3333 63.4118H57.5556L49.7778 68V63.4118H46.6667C45.429 63.4118 44.242 62.9284 43.3668 62.0679C42.4917 61.2074 42 60.0404 42 58.8235V46.5882C42 45.3714 42.4917 44.2043 43.3668 43.3439C44.242 42.4834 45.429 42 46.6667 42H65.3333Z" stroke="#936DFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </G>
          </Svg>
        </View>
      );
    }

    return (
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Image
          source={isFocused ? activeImage : inactiveImage}
          style={{
            width: 24,
            height: 24,
            resizeMode: 'contain',
          }}
        />
      </View>
    );
  };

  const getTabTitle = (routeName: string) => {
    switch (routeName) {
      case 'index':
        return 'Home';
      case 'chat':
        return 'Budget';
      case 'community':
        return 'Goals';
      case 'portfolio':
        return 'Insights';
      case 'learn':
        return 'Learn';
      default:
        return 'Home';
    }
  };

  return (
    <View style={{
      backgroundColor: AppColors.gray[0],
      borderTopWidth: 0,
      borderBottomRightRadius: 26,
      borderBottomLeftRadius: 26,
      borderTopLeftRadius: 26,
      borderTopRightRadius: 26,
      height: 90,
      paddingBottom: 20,
      paddingTop: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 8,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    }}>
      {state.routes
        .filter((route: any) => {
          const routeName = route.name;
          return ['index', 'chat', 'community', 'portfolio', 'learn'].includes(routeName);
        })
        .map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = getTabTitle(route.name);
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 8,
            }}
          >
            {renderTabIcon(route.name, isFocused, isFocused ? AppColors.gray[0] : AppColors.gray[400])}
          </TouchableOpacity>
        );
      })}
    </View>
  );
} 