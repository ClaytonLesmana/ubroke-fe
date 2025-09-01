import React from 'react';
import { View, TouchableOpacity, Alert, Text, Image, Dimensions } from 'react-native';
import { AppColors } from '@/constants/Colors';
import { useOnboarding } from '@/hooks/useOnboarding';
import Svg, { Rect, Path, Defs, Filter, FeFlood, FeColorMatrix, FeOffset, FeGaussianBlur, FeComposite, FeBlend, G } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

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

    // Chat button using exact Figma SVG
    if (routeName === 'chat') {
      return (
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: 65,
          height: 65,
          marginTop: -67, // Position it in the circular area (half of button height + some offset)
        }}>
          <Svg width="113" height="113" viewBox="0 0 113 113" fill="none">
            <Defs>
              <Filter id="filter1_d_380_1567" x="0" y="6" width="113" height="113" filterUnits="userSpaceOnUse">
                <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
                <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <FeOffset dy="2"/>
                <FeGaussianBlur stdDeviation="12"/>
                <FeComposite in2="hardAlpha" operator="out"/>
                <FeColorMatrix type="matrix" values="0 0 0 0 0.576471 0 0 0 0 0.427451 0 0 0 0 1 0 0 0 0.75 0"/>
                <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_380_1567"/>
                <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_380_1567" result="shape"/>
              </Filter>
            </Defs>
            <G filter="url(#filter1_d_380_1567)">
              <Rect x="24" y="28" width="65" height="65" rx="32.5" fill="#936DFF"/>
              <Path d="M65.3333 48C66.571 48 67.758 48.4834 68.6332 49.3439C69.5083 50.2043 70 51.3714 70 52.5882V64.8235C70 66.0404 69.5083 67.2074 68.6332 68.0679C67.758 68.9284 66.571 69.4118 65.3333 69.4118H57.5556L49.7778 74V69.4118H46.6667C45.429 69.4118 44.242 68.9284 43.3668 68.0679C42.4917 67.2074 42 66.0404 42 64.8235V52.5882C42 51.3714 42.4917 50.2043 43.3668 49.3439C44.242 48.4834 45.429 48 46.6667 48H65.3333Z" fill="white"/>
              <Path d="M52.1111 55.6471H52.1267H52.1111Z" fill="white"/>
              <Path d="M59.8889 55.6471H59.9044H59.8889Z" fill="white"/>
              <Path d="M52.1111 61.7647C52.618 62.2734 53.2231 62.6775 53.8909 62.9534C54.5586 63.2293 55.2757 63.3714 56 63.3714C56.7243 63.3714 57.4414 63.2293 58.1091 62.9534C58.7769 62.6775 59.382 62.2734 59.8889 61.7647" fill="white"/>
              <Path d="M52.1111 55.6471H52.1267M59.8889 55.6471H59.9044M52.1111 61.7647C52.618 62.2734 53.2231 62.6775 53.8909 62.9534C54.5586 63.2293 55.2757 63.3714 56 63.3714C56.7243 63.3714 57.4414 63.2293 58.1091 62.9534C58.7769 62.6775 59.382 62.2734 59.8889 61.7647M65.3333 48C66.571 48 67.758 48.4834 68.6332 49.3439C69.5083 50.2043 70 51.3714 70 52.5882V64.8235C70 66.0404 69.5083 67.2074 68.6332 68.0679C67.758 68.9284 66.571 69.4118 65.3333 69.4118H57.5556L49.7778 74V69.4118H46.6667C45.429 69.4118 44.242 68.9284 43.3668 68.0679C42.4917 67.2074 42 66.0404 42 64.8235V52.5882C42 51.3714 42.4917 50.2043 43.3668 49.3439C44.242 48.4834 45.429 48 46.6667 48H65.3333Z" stroke="#936DFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

  // Create tab bar background exactly matching the provided SVG
  const TabBarBackground = () => {
    const tabBarWidth = screenWidth;
    const tabBarHeight = 88;
    
    return (
      <Svg 
        width={tabBarWidth} 
        height={tabBarHeight} 
        viewBox={`0 0 ${tabBarWidth} ${tabBarHeight}`} 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 8,
        }}
      >
        <Defs>
          <Filter id="filter0_d_380_1567" x="-24" y="0" width={tabBarWidth + 48} height={tabBarHeight + 20} filterUnits="userSpaceOnUse">
            <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
            <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <FeOffset dy="-4"/>
            <FeGaussianBlur stdDeviation="12"/>
            <FeComposite in2="hardAlpha" operator="out"/>
            <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
            <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_380_1567"/>
            <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_380_1567" result="shape"/>
          </Filter>
        </Defs>
        
        <Path
          d={`M ${tabBarWidth - 32} 0 
             C ${tabBarWidth - 14.327} 0 ${tabBarWidth} 14.3269 ${tabBarWidth} 32
             V 76
             C ${tabBarWidth} 82.627 ${tabBarWidth - 5.373} 88 ${tabBarWidth - 12} 88
             H 12
             C 5.37259 88 0 82.627 0 76
             V 32
             C 0 14.3269 14.3269 0 32 0
             H ${tabBarWidth / 2 - 45.888}
             C ${tabBarWidth / 2 - 41.03} 0 ${tabBarWidth / 2 - 37.5} 4.64209 ${tabBarWidth / 2 - 37.5} 9.5
             C ${tabBarWidth / 2 - 37.5} 30.2107 ${tabBarWidth / 2 - 20.711} 47 ${tabBarWidth / 2} 47
             C ${tabBarWidth / 2 + 20.711} 47 ${tabBarWidth / 2 + 37.5} 30.2107 ${tabBarWidth / 2 + 37.5} 9.5
             C ${tabBarWidth / 2 + 37.5} 4.64209 ${tabBarWidth / 2 + 41.03} 0 ${tabBarWidth / 2 + 45.888} 0
             H ${tabBarWidth - 32}
             Z`}
          fill={AppColors.gray[0]}
          // filter="url(#filter0_d_380_1567)"
        />
      </Svg>
    );
  };

  return (
    <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 90,
      backgroundColor: 'transparent',
    }}>
      {/* Custom SVG background with hollow middle */}
              <TabBarBackground />
      
      {/* Tab buttons */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 20,
        paddingTop: 12,
        height: 90,
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
    </View>
  );
}