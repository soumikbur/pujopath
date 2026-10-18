import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
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
import { NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';

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

import { AppHeader } from '@/components/AppHeader';
import { MiniPlayer } from '@/components/MiniPlayer';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

interface MoreDrawerModalProps {
  visible: boolean;
  onClose: () => void;
  navigation: any;
}

const MoreDrawerModal: React.FC<MoreDrawerModalProps> = ({ visible, onClose, navigation }) => {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const reduceMotion = useReducedMotion();

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
          duration: 220,
          easing: Easing.out(Easing.cubic),
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
          duration: 180,
          easing: Easing.in(Easing.cubic),
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

  const secondaryItems = [
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
      name: 'About',
      label: isBn ? 'সাহায্য ও তথ্য' : 'Help',
      renderIcon: (color: string) => <Feather name="info" size={16} color={color} />,
    },
    {
      name: 'Feedback',
      label: isBn ? 'মতামত' : 'Feedback',
      renderIcon: (color: string) => <Feather name="message-square" size={16} color={color} />,
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
              backgroundColor: isDark ? '#181411' : '#FFFFFF',
              borderColor: isDark ? '#2A241F' : '#EEE8E1',
              paddingBottom: Math.max(insets.bottom, 16) + 12,
              transform: [{ translateY: drawerTranslateY }],
            },
          ]}
        >
          {/* Header Row */}
          <View style={[styles.drawerHeader, { borderBottomColor: isDark ? '#2A241F' : '#EEE8E1' }]}>
            <Text style={[styles.drawerTitle, { color: isDark ? '#EDE5DC' : '#242424' }]}>
              {isBn ? 'অন্যান্য সুবিধাসমূহ' : 'More Features'}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityLabel="Close features drawer"
              activeOpacity={0.7}
            >
              <Feather name="x" size={20} color={isDark ? '#A89E95' : '#776D65'} />
            </TouchableOpacity>
          </View>

          {/* 8 Feature Cards Grid (2 columns) */}
          <View style={styles.gridContainer}>
            {secondaryItems.map((item) => (
              <TouchableOpacity
                key={item.name}
                activeOpacity={0.75}
                onPress={() => {
                  onClose();
                  navigation.navigate(item.name);
                }}
                style={[
                  styles.featureCard,
                  {
                    backgroundColor: isDark ? '#201C18' : '#FCFAF7',
                    borderColor: isDark ? '#2A241F' : '#EEE8E1',
                  },
                ]}
              >
                <View style={styles.cardIcon}>
                  {item.renderIcon(isDark ? '#E05656' : '#B42323')}
                </View>
                <Text
                  style={[
                    styles.cardLabel,
                    { color: isDark ? '#C4B9AE' : '#4A423D' },
                  ]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Feedback Action Button */}
          <View style={[styles.feedbackSeparator, { borderTopColor: isDark ? '#2A241F' : '#EEE8E1' }]}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => {
                onClose();
                navigation.navigate('Feedback');
              }}
              style={[
                styles.feedbackActionBtn,
                {
                  backgroundColor: isDark ? '#1A2634' : '#F0F7FF',
                  borderColor: isDark ? 'rgba(10, 102, 194, 0.4)' : 'rgba(10, 102, 194, 0.3)',
                },
              ]}
            >
              <Feather name="message-square" size={16} color={isDark ? '#70B5F9' : '#0A66C2'} />
              <Text
                style={[
                  styles.feedbackActionText,
                  { color: isDark ? '#70B5F9' : '#0A66C2' },
                ]}
              >
                {isBn ? 'মতামত জানান (Feedback)' : 'Share Feedback'}
              </Text>
            </TouchableOpacity>
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
}) => {
  const animValue = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    if (reduceMotion) {
      animValue.setValue(isFocused ? 1 : 0);
    } else {
      Animated.timing(animValue, {
        toValue: isFocused ? 1 : 0,
        duration: 280,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: true,
      }).start();
    }
  }, [isFocused, reduceMotion]);

  const dotScale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1.0],
  });

  const dotOpacity = animValue;
  const bgOpacity = animValue;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel}
      style={styles.tabItem}
    >
      {/* Animated active pill background highlight */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.tabActiveBg,
          {
            backgroundColor: activeBgColor,
            opacity: bgOpacity,
          },
        ]}
      />

      <View style={styles.tabIconWrapper}>
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
      </View>

      <View style={styles.tabLabelWrapper}>
        <Animated.Text
          style={[
            styles.tabLabel,
            {
              color: inactiveColor,
              fontWeight: '600',
              opacity: animValue.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
            },
          ]}
          numberOfLines={1}
        >
          {label}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.tabLabel,
            StyleSheet.absoluteFill,
            {
              color: activeColor,
              fontWeight: '700',
              opacity: animValue,
            },
          ]}
          numberOfLines={1}
        >
          {label}
        </Animated.Text>
      </View>

      <Animated.View
        style={[
          styles.tabDot,
          {
            backgroundColor: activeColor,
            transform: [{ scale: dotScale }],
            opacity: dotOpacity,
          },
        ]}
      />
    </TouchableOpacity>
  );
};

interface MobileBottomTabBarProps extends BottomTabBarProps {
  onMorePress: () => void;
  isMoreOpen: boolean;
}

const MobileBottomTabBar: React.FC<MobileBottomTabBarProps> = ({
  state,
  navigation,
  onMorePress,
  isMoreOpen,
}) => {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const reduceMotion = useReducedMotion();

  // Dynamic bottom inset to safely clear Android gesture navigation / 3-button navigation
  const bottomInset = Math.max(insets.bottom, 8);

  const activeColor = '#B42323';
  const inactiveColor = isDark ? '#A89E95' : '#665A54';
  const activeBgColor = isDark
    ? 'rgba(52, 27, 24, 0.5)'
    : 'rgba(253, 238, 238, 0.5)';

  const navItems = [
    {
      routeName: 'HomeTab',
      label: isBn ? 'হোম' : 'Home',
      renderIcon: (color: string) => (
        <Feather name="home" size={20} color={color} />
      ),
    },
    {
      routeName: 'ExploreTab',
      label: isBn ? 'অন্বেষণ' : 'Explore',
      renderIcon: (color: string) => (
        <Feather name="compass" size={20} color={color} />
      ),
    },
    {
      routeName: 'MapTab',
      label: isBn ? 'মানচিত্র' : 'Map',
      renderIcon: (color: string) => (
        <Feather name="map-pin" size={20} color={color} />
      ),
    },
    {
      routeName: 'PlannerTab',
      label: isBn ? 'পরিকল্পনা' : 'Planner',
      renderIcon: (color: string) => (
        <MaterialCommunityIcons name="routes" size={20} color={color} />
      ),
    },
  ];

  return (
    <View
      style={[
        styles.navBarContainer,
        {
          backgroundColor: isDark ? '#181411' : '#FFFFFF',
          borderTopColor: isDark ? '#2A241F' : '#EEE8E1',
          paddingBottom: bottomInset,
        },
      ]}
    >
      <View style={styles.navBarInner}>
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
            <Feather name="more-horizontal" size={20} color={color} />
          )}
          activeColor={activeColor}
          inactiveColor={inactiveColor}
          activeBgColor={activeBgColor}
          reduceMotion={reduceMotion}
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

  // progress is:
  // -1 if screen index < active index (outgoing to left or incoming from left)
  //  0 if active screen
  //  1 if screen index > active index (outgoing to right or incoming from right)
  const translateX = progress.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-80, 0, 80],
    extrapolate: 'clamp',
  });

  // Solid opacity curve: keeps screens opaque during motion to prevent black flashes or ghosting,
  // while providing a clean, subtle fade at the transition boundary.
  const opacity = progress.interpolate({
    inputRange: [-1, -0.85, 0, 0.85, 1],
    outputRange: [0, 1, 1, 1, 0],
    extrapolate: 'clamp',
  });

  return {
    sceneStyle: {
      opacity,
      transform: [{ translateX }],
    },
  };
};

const tabTransitionSpec = {
  animation: 'timing' as const,
  config: {
    duration: 280,
    easing: Easing.bezier(0.4, 0.0, 0.2, 1),
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

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader />
      <Tab.Navigator
        backBehavior="history"
        detachInactiveScreens={false}
        tabBar={(props) => (
          <MobileBottomTabBar
            {...props}
            onMorePress={() => setMoreDrawerVisible(true)}
            isMoreOpen={moreDrawerVisible}
          />
        )}
        screenOptions={{
          headerShown: false,
          lazy: false,
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
      />
    </View>
  );
}

export function RootNavigator() {
  const { colors } = useTheme();

  // Rapid Back bounce debounce guard (220ms) to prevent duplicate transitions or corrupted state
  useEffect(() => {
    let lastBackPressTime = 0;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      const now = Date.now();
      if (now - lastBackPressTime < 220) {
        return true; // Discard rapid physical bounce
      }
      lastBackPressTime = now;
      return false; // Let normal back navigation proceed
    });
    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.rootContainer}>
      <NavigationContainer>
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
            animation: 'fade_from_bottom',
            animationDuration: 220,
            gestureEnabled: true,
          }}
        >
          <Stack.Screen
            name="MainTabs"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PandalDetail"
            component={PandalDetailScreen}
            options={{ title: 'Pandal Profile' }}
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
        </Stack.Navigator>

        {/* Global Floating Mini Audio Player */}
        <MiniPlayer />
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
    minWidth: 56,
    minHeight: 48,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
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
