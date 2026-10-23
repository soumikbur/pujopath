import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  StyleProp,
  ViewStyle,
  BackHandler,
} from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useResponsive } from '@/hooks/useResponsive';
import { useNotifications } from '@/context/NotificationContext';
import { motion } from '@/theme/motion';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

import { HomeScreen } from '@/screens/HomeScreen';
import { ExploreScreen } from '@/screens/ExploreScreen';
import { MapScreen } from '@/screens/MapScreen';
import { PlannerScreen } from '@/screens/PlannerScreen';
import { SavedScreen } from '@/screens/SavedScreen';
import { PandalDetailScreen } from '@/screens/PandalDetailScreen';
import { MetroScreen } from '@/screens/MetroScreen';
import { CalendarScreen } from '@/screens/CalendarScreen';
import { MusicScreen } from '@/screens/MusicScreen';
import { MahalayaScreen } from '@/screens/MahalayaScreen';
import { HelplineScreen } from '@/screens/HelplineScreen';
import { DeveloperScreen } from '@/screens/DeveloperScreen';
import { FeedbackScreen } from '@/screens/FeedbackScreen';
import { AboutScreen } from '@/screens/AboutScreen';
import { NotificationsScreen } from '@/screens/NotificationsScreen';
import { KaliPujaScreen } from '@/screens/KaliPujaScreen';
import { FestivalSelectScreen } from '@/screens/FestivalSelectScreen';
import { KaliHomeScreen } from '@/screens/KaliHomeScreen';
import { KaliExploreScreen } from '@/screens/KaliExploreScreen';
import { KaliMusicScreen } from '@/screens/KaliMusicScreen';
import { useFestival } from '@/context/FestivalContext';
import { useMapFullscreen } from '@/context/MapFullscreenContext';

import { AppHeader } from '@/components/AppHeader';
import { MiniPlayer } from '@/components/MiniPlayer';

const Tab = createBottomTabNavigator();
const KaliTab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

interface MoreDrawerModalProps {
  visible: boolean;
  onClose: () => void;
  navigation: any;
  festival?: 'durga' | 'kali';
}

const MoreDrawerModal: React.FC<MoreDrawerModalProps> = ({ visible, onClose, navigation, festival = 'durga' }) => {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const { resetFestival } = useFestival();
  const isBn = language === 'bn';
  const reduceMotion = useReducedMotion();
  const { isLandscape, safeLeft, safeRight } = useResponsive();

  const [isRendered, setIsRendered] = useState(visible);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setIsRendered(true);
      if (reduceMotion) {
        anim.setValue(1);
      } else {
        Animated.timing(anim, {
          toValue: 1,
          duration: motion.duration.standard,
          easing: motion.easing.decelerate,
          useNativeDriver: true,
        }).start();
      }
    } else if (isRendered) {
      if (reduceMotion) {
        anim.setValue(0);
        setIsRendered(false);
      } else {
        Animated.timing(anim, {
          toValue: 0,
          duration: motion.duration.quick,
          easing: motion.easing.accelerate,
          useNativeDriver: true,
        }).start(() => {
          setIsRendered(false);
        });
      }
    }
  }, [visible, reduceMotion]);

  if (!isRendered && !visible) {
    return null;
  }

  const backdropOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const drawerTranslateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [360, 0],
  });

  const isKali = festival === 'kali';
  const iconColor = isKali
    ? isDark ? '#C084FC' : '#7E22CE'
    : isDark ? '#E05656' : '#B42323';

  const secondaryItems = isKali
    ? [
        {
          name: 'KaliExplore',
          label: isBn ? 'ঐতিহাসিক তীর্থ' : 'Sacred Temples',
          renderIcon: (color: string) => <Feather name="compass" size={16} color={color} />,
        },
        {
          name: 'KaliPuja',
          label: isBn ? '১৪ প্রদীপ ও নির্ঘণ্ট' : '14 Diyas & Almanac',
          renderIcon: (color: string) => <Ionicons name="flame-outline" size={16} color={color} />,
        },
        {
          name: 'KaliMusic',
          label: isBn ? 'শ্যামাসঙ্গীত' : 'Shyama Sangeet',
          renderIcon: (color: string) => <Feather name="music" size={16} color={color} />,
        },
        {
          name: 'Metro',
          label: isBn ? 'মেট্রো গাইড' : 'Metro Guide',
          renderIcon: (color: string) => <MaterialCommunityIcons name="subway-variant" size={16} color={color} />,
        },
        {
          name: 'Notifications',
          label: isBn ? 'বিজ্ঞপ্তি' : 'Notifications',
          renderIcon: (color: string) => <Feather name="bell" size={16} color={color} />,
        },
        {
          name: 'About',
          label: isBn ? 'সাহায্য ও তথ্য' : 'Help & About',
          renderIcon: (color: string) => <Feather name="info" size={16} color={color} />,
        },
        {
          name: 'Developer',
          label: isBn ? 'ডেভেলপার' : 'Developer',
          renderIcon: (color: string) => <Feather name="users" size={16} color={color} />,
        },
        {
          name: 'Feedback',
          label: isBn ? 'মতামত' : 'Feedback',
          renderIcon: (color: string) => <Feather name="message-square" size={16} color={color} />,
        },
        {
          name: 'SwitchFestival',
          label: isBn ? 'উৎসব পরিবর্তন' : 'Switch Festival',
          renderIcon: (color: string) => <Ionicons name="swap-horizontal" size={16} color={color} />,
          onAction: () => {
            onClose();
            resetFestival();
          },
        },
      ]
    : [
        {
          name: 'Calendar',
          label: isBn ? 'ক্যালেন্ডার' : 'Calendar',
          renderIcon: (color: string) => <Feather name="calendar" size={16} color={color} />,
        },
        {
          name: 'Metro',
          label: isBn ? 'মেট্রো গাইড' : 'Metro Guide',
          renderIcon: (color: string) => <MaterialCommunityIcons name="subway-variant" size={16} color={color} />,
        },
        {
          name: 'Music',
          label: isBn ? 'পুজোর সঙ্গীত' : 'Puja Music',
          renderIcon: (color: string) => <Feather name="music" size={16} color={color} />,
        },
        {
          name: 'Mahalaya',
          label: isBn ? 'মহালয়া বিশেষ' : 'Mahalaya Special',
          renderIcon: (color: string) => <Ionicons name="sparkles-outline" size={16} color={color} />,
        },
        {
          name: 'KaliPuja',
          label: isBn ? 'কালীপূজা বিশেষ' : 'Kali Puja Guide',
          renderIcon: (color: string) => <Ionicons name="flame-outline" size={16} color={color} />,
        },
        {
          name: 'About',
          label: isBn ? 'সাহায্য ও তথ্য' : 'Help',
          renderIcon: (color: string) => <Feather name="info" size={16} color={color} />,
        },
        {
          name: 'Notifications',
          label: isBn ? 'বিজ্ঞপ্তি ও অ্যালার্ট' : 'Notifications',
          renderIcon: (color: string) => <Feather name="bell" size={16} color={color} />,
        },
        {
          name: 'Developer',
          label: isBn ? 'ডেভেলপার' : 'Developer',
          renderIcon: (color: string) => <Feather name="users" size={16} color={color} />,
        },
        {
          name: 'Saved',
          label: isBn ? 'সংরক্ষিত প্যান্ডেল' : 'Saved Pandals',
          renderIcon: (color: string) => <Feather name="heart" size={16} color={color} />,
        },
        {
          name: 'SwitchFestival',
          label: isBn ? 'উৎসব পরিবর্তন' : 'Switch Festival',
          renderIcon: (color: string) => <Ionicons name="swap-horizontal" size={16} color={color} />,
          onAction: () => {
            onClose();
            resetFestival();
          },
        },
      ];

  return (
    <Modal
      visible={isRendered || visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlayContainer}>
        <Animated.View
          style={[
            styles.modalBackdrop,
            { opacity: backdropOpacity },
          ]}
        >
          <Pressable style={styles.backdropPressable} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.drawerContent,
            {
              backgroundColor: isDark
                ? isKali ? '#130E26' : '#181411'
                : isKali ? '#FAF7FD' : '#FFFFFF',
              borderColor: isDark
                ? isKali ? '#2E2154' : '#2A241F'
                : isKali ? '#E8DCF5' : '#EEE8E1',
              paddingLeft: Math.max(safeLeft, 20),
              paddingRight: Math.max(safeRight, 20),
              paddingBottom: Math.max(insets.bottom, 10) + (isLandscape ? 4 : 12),
              paddingTop: isLandscape ? 12 : 18,
              maxHeight: isLandscape ? '96%' : '85%',
              maxWidth: isLandscape ? 820 : undefined,
              alignSelf: isLandscape ? 'center' : undefined,
              width: '100%',
              transform: [{ translateY: drawerTranslateY }],
            },
          ]}
        >
          {/* Header Row */}
          <View
            style={[
              styles.drawerHeader,
              {
                borderBottomColor: isDark
                  ? isKali ? '#2E2154' : '#2A241F'
                  : isKali ? '#E8DCF5' : '#EEE8E1',
                paddingBottom: isLandscape ? 8 : 12,
                marginBottom: isLandscape ? 10 : 16,
              },
            ]}
          >
            <Text
              style={[
                styles.drawerTitle,
                {
                  color: isDark
                    ? isKali ? '#F3E8FF' : '#EDE5DC'
                    : isKali ? '#2E1065' : '#242424',
                  fontSize: isLandscape ? 15 : 16,
                },
              ]}
            >
              {isBn ? 'অন্যান্য সুবিধাসমূহ' : 'More Features'}
            </Text>
            <AnimatedPressable
              preset="icon"
              scaleTo={0.88}
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityLabel="Close features drawer"
            >
              <Feather
                name="x"
                size={isLandscape ? 18 : 20}
                color={isDark ? (isKali ? '#C084FC' : '#A89E95') : (isKali ? '#7E22CE' : '#776D65')}
              />
            </AnimatedPressable>
          </View>

          {/* 8 Feature Cards Grid (2 cols in portrait, 4 cols in landscape) */}
          <View
            style={[
              styles.gridContainer,
              isLandscape && {
                rowGap: 8,
                marginBottom: 10,
              },
            ]}
          >
            {secondaryItems.map((item) => (
              <AnimatedPressable
                key={item.name}
                preset="chip"
                scaleTo={0.94}
                onPress={() => {
                  onClose();
                  requestAnimationFrame(() => {
                    if ((item as any).onAction) {
                      (item as any).onAction();
                    } else {
                      navigation.navigate(item.name);
                    }
                  });
                }}
                style={[
                  styles.featureCard,
                  {
                    backgroundColor: isDark
                      ? isKali ? '#1C1438' : '#201C18'
                      : isKali ? '#FFFFFF' : '#FCFAF7',
                    borderColor: isDark
                      ? isKali ? '#2E2154' : '#2A241F'
                      : isKali ? '#E8DCF5' : '#EEE8E1',
                    width: isLandscape ? '23.8%' : '48.5%',
                    paddingVertical: isLandscape ? 8 : 12,
                    paddingHorizontal: isLandscape ? 8 : 12,
                    gap: isLandscape ? 6 : 10,
                  },
                ]}
              >
                <View style={styles.cardIcon}>
                  {item.renderIcon(iconColor)}
                </View>
                <Text
                  style={[
                    styles.cardLabel,
                    {
                      color: isDark
                        ? isKali ? '#E9D5FF' : '#C4B9AE'
                        : isKali ? '#4C1D95' : '#4A423D',
                      fontSize: isLandscape ? 11.5 : 13,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </AnimatedPressable>
            ))}
          </View>

          {/* Quick Feedback Action Button */}
          <View
            style={[
              styles.feedbackSeparator,
              {
                borderTopColor: isDark
                  ? isKali ? '#2E2154' : '#2A241F'
                  : isKali ? '#E8DCF5' : '#EEE8E1',
                paddingTop: isLandscape ? 8 : 12,
              },
            ]}
          >
            <AnimatedPressable
              preset="button"
              scaleTo={0.96}
              onPress={() => {
                onClose();
                navigation.navigate('Feedback');
              }}
              style={[
                styles.feedbackActionBtn,
                {
                  backgroundColor: isDark ? '#1A2634' : '#F0F7FF',
                  borderColor: isDark ? 'rgba(10, 102, 194, 0.4)' : 'rgba(10, 102, 194, 0.3)',
                  paddingVertical: isLandscape ? 8 : 12,
                  maxWidth: isLandscape ? 400 : undefined,
                  alignSelf: isLandscape ? 'center' : undefined,
                  width: '100%',
                },
              ]}
            >
              <Feather name="message-square" size={15} color={isDark ? '#70B5F9' : '#0A66C2'} />
              <Text
                style={[
                  styles.feedbackActionText,
                  { color: isDark ? '#70B5F9' : '#0A66C2' },
                ]}
              >
                {isBn ? 'মতামত জানান (Feedback)' : 'Share Feedback'}
              </Text>
            </AnimatedPressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

interface TabBarButtonProps {
  label: string;
  isFocused: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  accessibilityRole: 'tab' | 'button';
  accessibilityState: { selected?: boolean; expanded?: boolean };
  accessibilityLabel: string;
  renderIcon: (color: string) => React.ReactNode;
  activeColor: string;
  inactiveColor: string;
  activeBgColor: string;
  reduceMotion: boolean;
  isLandscape?: boolean;
}

const TabBarButton: React.FC<TabBarButtonProps> = ({
  label,
  isFocused,
  onPress,
  onLongPress,
  accessibilityRole,
  accessibilityState,
  accessibilityLabel,
  renderIcon,
  activeColor,
  inactiveColor,
  activeBgColor,
  reduceMotion,
  isLandscape = false,
}) => {
  const animValue = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const iconPop = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reduceMotion) {
      animValue.setValue(isFocused ? 1 : 0);
    } else {
      Animated.timing(animValue, {
        toValue: isFocused ? 1 : 0,
        duration: motion.duration.standard,
        easing: motion.easing.standard,
        useNativeDriver: true,
      }).start();

      if (isFocused) {
        // Deliberate, noticeable icon spring feedback when selected
        Animated.sequence([
          Animated.spring(iconPop, {
            toValue: 1.18,
            tension: 320,
            friction: 12,
            useNativeDriver: true,
          }),
          Animated.spring(iconPop, {
            toValue: 1.0,
            tension: 260,
            friction: 20,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  }, [isFocused, reduceMotion]);

  const handlePressIn = () => {
    if (!reduceMotion) {
      Animated.timing(pressScale, {
        toValue: 0.92,
        duration: motion.duration.instant,
        easing: motion.easing.standard,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!reduceMotion) {
      Animated.spring(pressScale, {
        toValue: 1,
        tension: 320,
        friction: 20,
        useNativeDriver: true,
      }).start();
    }
  };

  const dotScale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1.0],
  });

  const bgScaleX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1.0],
  });

  const bgScaleY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1.0],
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.tabItem,
        isLandscape && styles.tabItemLandscape,
      ]}
    >
      <Animated.View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          transform: [{ scale: pressScale }],
        }}
      >
        {/* Animated active pill background highlight with blooming scale */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.tabActiveBg,
            {
              backgroundColor: activeBgColor,
              opacity: animValue,
              transform: [{ scaleX: bgScaleX }, { scaleY: bgScaleY }],
            },
          ]}
        />

        <Animated.View style={[styles.tabIconWrapper, { transform: [{ scale: iconPop }] }]}>
          <Animated.View
            style={{
              opacity: animValue.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
            }}
          >
            {renderIcon(inactiveColor)}
          </Animated.View>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                opacity: animValue,
              },
            ]}
          >
            {renderIcon(activeColor)}
          </Animated.View>
        </Animated.View>

        <View style={[styles.tabLabelWrapper, isLandscape && { marginTop: 0, marginLeft: 4 }]}>
          <Animated.Text
            style={[
              styles.tabLabel,
              {
                color: animValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [inactiveColor, activeColor],
                }),
                fontWeight: isFocused ? '700' : '600',
              },
              isLandscape && { fontSize: 11 },
            ]}
            numberOfLines={1}
          >
            {label}
          </Animated.Text>
        </View>

        {!isLandscape && (
          <Animated.View
            style={[
              styles.tabDot,
              {
                backgroundColor: activeColor,
                transform: [{ scale: dotScale }],
                opacity: animValue,
              },
            ]}
          />
        )}
      </Animated.View>
    </Pressable>
  );
};

interface MobileBottomTabBarProps extends BottomTabBarProps {
  onMorePress: () => void;
  isMoreOpen: boolean;
  festival?: 'durga' | 'kali';
}

const MobileBottomTabBar: React.FC<MobileBottomTabBarProps> = ({
  state,
  navigation,
  onMorePress,
  isMoreOpen,
  festival = 'durga',
}) => {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const reduceMotion = useReducedMotion();
  const { isLandscape, safeLeft, safeRight } = useResponsive();

  // Dynamic bottom inset to safely clear Android gesture navigation / 3-button navigation
  const bottomInset = Math.max(insets.bottom, 8);

  const isKali = festival === 'kali';
  const activeColor = isKali
    ? isDark ? '#C084FC' : '#7E22CE'
    : isDark ? '#E05656' : '#B42323';
  const inactiveColor = isDark
    ? isKali ? '#A78BFA' : '#A89E95'
    : isKali ? '#7E6B8F' : '#665A54';
  const activeBgColor = isKali
    ? isDark
      ? 'rgba(168, 85, 247, 0.18)'
      : 'rgba(126, 34, 206, 0.10)'
    : isDark
    ? 'rgba(52, 27, 24, 0.5)'
    : 'rgba(253, 238, 238, 0.5)';

  const iconSize = isLandscape ? 17 : 20;

  const navItems = [
    {
      routeName: 'HomeTab',
      label: isBn ? 'হোম' : 'Home',
      renderIcon: (color: string) => (
        <Feather name="home" size={iconSize} color={color} />
      ),
    },
    {
      routeName: 'ExploreTab',
      label: isBn ? 'অন্বেষণ' : 'Explore',
      renderIcon: (color: string) => (
        <Feather name="compass" size={iconSize} color={color} />
      ),
    },
    {
      routeName: 'MapTab',
      label: isBn ? 'মানচিত্র' : 'Map',
      renderIcon: (color: string) => (
        <Feather name="map-pin" size={iconSize} color={color} />
      ),
    },
    {
      routeName: 'PlannerTab',
      label: isBn ? 'পরিকল্পনা' : 'Planner',
      renderIcon: (color: string) => (
        <MaterialCommunityIcons name="routes" size={iconSize} color={color} />
      ),
    },
  ];

  return (
    <View
      style={[
        styles.navBarContainer,
        {
          backgroundColor: isDark
            ? isKali ? '#110B1E' : '#181411'
            : isKali ? '#FAF7FD' : '#FFFFFF',
          borderTopColor: isDark
            ? isKali ? '#2E1C44' : '#2A241F'
            : isKali ? '#E8DCF5' : '#EEE8E1',
          paddingTop: isLandscape ? 3 : 8,
          paddingBottom: isLandscape ? Math.max(insets.bottom, 3) : bottomInset,
          paddingLeft: safeLeft,
          paddingRight: safeRight,
        },
      ]}
    >
      <View style={[styles.navBarInner, isLandscape && { maxWidth: 640 }]}>
        {navItems.map((item) => {
          const routeIndex = state.routes.findIndex((r) => r.name === item.routeName);
          const isFocused = !isMoreOpen && state.index === routeIndex;
          const route = state.routes[routeIndex];

          const onPress = () => {
            if (!route) return;
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
            if (!route) return;
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TabBarButton
              key={item.routeName}
              label={item.label}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={item.label}
              renderIcon={item.renderIcon}
              activeColor={activeColor}
              inactiveColor={inactiveColor}
              activeBgColor={activeBgColor}
              reduceMotion={reduceMotion}
              isLandscape={isLandscape}
            />
          );
        })}

        {/* 5. More Trigger with matching smooth indicator */}
        <TabBarButton
          label={isBn ? 'আরও' : 'More'}
          isFocused={isMoreOpen}
          onPress={onMorePress}
          accessibilityRole="button"
          accessibilityState={{ expanded: isMoreOpen }}
          accessibilityLabel={isBn ? 'আরও' : 'More'}
          renderIcon={(color) => (
            <Feather name="more-horizontal" size={iconSize} color={color} />
          )}
          activeColor={activeColor}
          inactiveColor={inactiveColor}
          activeBgColor={activeBgColor}
          reduceMotion={reduceMotion}
          isLandscape={isLandscape}
        />
      </View>
    </View>
  );
};

type TabSceneInterpolationProps = {
  current: {
    progress: Animated.AnimatedInterpolation<number>;
  };
};

type TabSceneInterpolatedStyle = {
  sceneStyle: StyleProp<ViewStyle>;
};

const forTabSlide = ({ current }: TabSceneInterpolationProps): TabSceneInterpolatedStyle => {
  const { progress } = current;

  // Fluid 40dp horizontal slide with subtle perceived depth scaling
  const translateX = progress.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-40, 0, 40],
    extrapolate: 'clamp',
  });

  const scale = progress.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0.98, 1, 0.98],
    extrapolate: 'clamp',
  });

  // Solid opacity curve: keeps screens opaque during motion to prevent black flashes or ghosting
  const opacity = progress.interpolate({
    inputRange: [-1, -0.6, 0, 0.6, 1],
    outputRange: [0, 1, 1, 1, 0],
    extrapolate: 'clamp',
  });

  return {
    sceneStyle: {
      opacity,
      transform: [{ translateX }, { scale }],
    },
  };
};

const tabTransitionSpec = {
  animation: 'timing' as const,
  config: {
    duration: motion.duration.navigation,
    easing: motion.easing.standard,
  },
};

const reducedMotionSpec = {
  animation: 'timing' as const,
  config: {
    duration: 0,
  },
};

function MainTabNavigator({ navigation }: any) {
  const [moreDrawerVisible, setMoreDrawerVisible] = useState(false);
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const { isMapFullscreen } = useMapFullscreen();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {!isMapFullscreen && <AppHeader />}
      <Tab.Navigator
        backBehavior="history"
        detachInactiveScreens={true}
        tabBar={(props) =>
          isMapFullscreen ? null : (
            <MobileBottomTabBar
              {...props}
              festival="durga"
              onMorePress={() => setMoreDrawerVisible(true)}
              isMoreOpen={moreDrawerVisible}
            />
          )
        }
        screenOptions={{
          headerShown: false,
          lazy: true,
          sceneStyle: { backgroundColor: colors.background },
          animation: 'shift',
          transitionSpec: reduceMotion ? reducedMotionSpec : tabTransitionSpec,
          sceneStyleInterpolator: forTabSlide,
        }}
      >
        <Tab.Screen name="HomeTab" component={HomeScreen} />
        <Tab.Screen name="ExploreTab" component={ExploreScreen} />
        <Tab.Screen name="MapTab" component={MapScreen} />
        <Tab.Screen name="PlannerTab" component={PlannerScreen} />
      </Tab.Navigator>

      <MoreDrawerModal
        visible={moreDrawerVisible}
        onClose={() => setMoreDrawerVisible(false)}
        navigation={navigation}
        festival="durga"
      />
    </View>
  );
}

function KaliTabNavigator({ navigation }: any) {
  const [moreDrawerVisible, setMoreDrawerVisible] = useState(false);
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const { isMapFullscreen } = useMapFullscreen();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {!isMapFullscreen && <AppHeader />}
      <KaliTab.Navigator
        backBehavior="history"
        detachInactiveScreens={true}
        tabBar={(props) =>
          isMapFullscreen ? null : (
            <MobileBottomTabBar
              {...props}
              festival="kali"
              onMorePress={() => setMoreDrawerVisible(true)}
              isMoreOpen={moreDrawerVisible}
            />
          )
        }
        screenOptions={{
          headerShown: false,
          lazy: true,
          sceneStyle: { backgroundColor: colors.background },
          animation: 'shift',
          transitionSpec: reduceMotion ? reducedMotionSpec : tabTransitionSpec,
          sceneStyleInterpolator: forTabSlide,
        }}
      >
        <KaliTab.Screen name="HomeTab" component={KaliHomeScreen} />
        <KaliTab.Screen name="ExploreTab" component={ExploreScreen} />
        <KaliTab.Screen name="MapTab" component={MapScreen} />
        <KaliTab.Screen name="PlannerTab" component={PlannerScreen} />
      </KaliTab.Navigator>

      <MoreDrawerModal
        visible={moreDrawerVisible}
        onClose={() => setMoreDrawerVisible(false)}
        navigation={navigation}
        festival="kali"
      />
    </View>
  );
}

export function RootNavigator() {
  const { colors } = useTheme();
  const { activeFestival, resetFestival } = useFestival();
  const navigationRef = useNavigationContainerRef();
  const { pendingNavigation, clearPendingNavigation } = useNotifications();
  const { isMapFullscreen } = useMapFullscreen();

  // Handle deep-linking when a notification is tapped
  useEffect(() => {
    if (pendingNavigation && navigationRef.isReady()) {
      (navigationRef as any).navigate(pendingNavigation.screen, pendingNavigation.params);
      clearPendingNavigation();
    }
  }, [pendingNavigation, clearPendingNavigation]);

  // Rapid Back bounce debounce guard (220ms) and return to selector from root
  useEffect(() => {
    let lastBackPressTime = 0;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      const now = Date.now();
      if (now - lastBackPressTime < 220) {
        return true; // Discard rapid physical bounce
      }
      lastBackPressTime = now;

      if (navigationRef.isReady()) {
        if (navigationRef.canGoBack()) {
          navigationRef.goBack();
          return true;
        }
        // At the root tab of an active festival, pressing Back returns to the festival selector
        if (activeFestival !== null) {
          resetFestival();
          return true;
        }
      }
      return false; // On festival selector, let default Android back exit the app!
    });
    return () => subscription.remove();
  }, [activeFestival, resetFestival]);

  return (
    <View style={styles.rootContainer}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            header: ({ navigation, options, route }) => (
              <AppHeader
                title={options.title || route.name}
                showBack={true}
                onBack={() => navigation.goBack()}
              />
            ),
            contentStyle: { backgroundColor: colors.background },
            animation: 'slide_from_right',
            animationDuration: motion.duration.navigation,
            gestureEnabled: true,
          }}
        >
          {activeFestival === null ? (
            <Stack.Screen
              name="FestivalSelect"
              component={FestivalSelectScreen}
              options={{
                headerShown: false,
                animation: 'fade',
                animationDuration: motion.duration.standard,
              }}
            />
          ) : activeFestival === 'kali' ? (
            <Stack.Screen
              name="KaliTabs"
              component={KaliTabNavigator}
              options={{
                headerShown: false,
                animation: 'fade_from_bottom',
                animationDuration: motion.duration.navigation,
              }}
            />
          ) : (
            <Stack.Screen
              name="MainTabs"
              component={MainTabNavigator}
              options={{
                headerShown: false,
                animation: 'fade_from_bottom',
                animationDuration: motion.duration.navigation,
              }}
            />
          )}
          <Stack.Screen
            name="PandalDetail"
            component={PandalDetailScreen}
            options={{
              title: 'Pandal Profile',
              animation: 'slide_from_right',
              animationDuration: motion.duration.navigation,
            }}
          />
          <Stack.Screen
            name="Explore"
            component={ExploreScreen}
            options={{ title: 'Explore' }}
          />
          <Stack.Screen
            name="Map"
            component={MapScreen}
            options={{ title: 'Map' }}
          />
          <Stack.Screen
            name="Planner"
            component={PlannerScreen}
            options={{ title: 'Planner' }}
          />
          <Stack.Screen
            name="Metro"
            component={MetroScreen}
            options={{ title: 'Metro Guide' }}
          />
          <Stack.Screen
            name="Calendar"
            component={CalendarScreen}
            options={{ title: 'Calendar' }}
          />
          <Stack.Screen
            name="Music"
            component={MusicScreen}
            options={{ title: 'Puja Music' }}
          />
          <Stack.Screen
            name="Mahalaya"
            component={MahalayaScreen}
            options={{ title: 'Mahalaya' }}
          />
          <Stack.Screen
            name="Helpline"
            component={HelplineScreen}
            options={{ title: 'Helpline' }}
          />
          <Stack.Screen
            name="Saved"
            component={SavedScreen}
            options={{ title: 'Saved Pandals' }}
          />
          <Stack.Screen
            name="Developer"
            component={DeveloperScreen}
            options={{ title: 'Developers' }}
          />
          <Stack.Screen
            name="Feedback"
            component={FeedbackScreen}
            options={{ title: 'Feedback' }}
          />
          <Stack.Screen
            name="About"
            component={AboutScreen}
            options={{ title: 'Help & About' }}
          />
          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{ title: 'Notifications' }}
          />
          <Stack.Screen
            name="KaliPuja"
            component={KaliPujaScreen}
            options={{ title: 'Kali Puja' }}
          />
          <Stack.Screen
            name="KaliMusic"
            component={KaliMusicScreen}
            options={{ title: 'Kali Music' }}
          />
          <Stack.Screen
            name="KaliExplore"
            component={KaliExploreScreen}
            options={{ title: 'Sacred Kali Shrines' }}
          />
        </Stack.Navigator>

        {/* Global Floating Mini Audio Player (only visible inside an active festival and when map is not fullscreen) */}
        {activeFestival !== null && !isMapFullscreen && <MiniPlayer />}
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  navBarContainer: {
    borderTopWidth: 1,
    paddingTop: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 10,
  },
  navBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    maxWidth: 420,
    alignSelf: 'center',
    width: '100%',
  },
  tabItem: {
    flex: 1,
    maxWidth: 78,
    minHeight: 48,
    paddingVertical: 4,
    paddingHorizontal: 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  tabItemLandscape: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 130,
    minHeight: 36,
    paddingVertical: 4,
    paddingHorizontal: 6,
    gap: 4,
    borderRadius: 10,
  },
  tabActiveBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  tabIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabelWrapper: {
    position: 'relative',
    marginTop: 2,
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 11,
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  tabDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 2,
  },
  modalOverlayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  modalBackdrop: {
    ...(StyleSheet.absoluteFill as object),
    backgroundColor: 'rgba(0, 0, 0, 0.50)',
  },
  backdropPressable: {
    flex: 1,
  },
  drawerContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
    borderRadius: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginBottom: 16,
  },
  featureCard: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  cardIcon: {
    flexShrink: 0,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  feedbackSeparator: {
    borderTopWidth: 1,
    paddingTop: 12,
  },
  feedbackActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  feedbackActionText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
