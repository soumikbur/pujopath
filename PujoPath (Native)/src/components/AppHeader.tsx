import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRoute } from '@/context/RouteContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useNotifications } from '@/context/NotificationContext';
import { useFestival } from '@/context/FestivalContext';

import { useResponsive } from '@/hooks/useResponsive';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title, showBack, onBack }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { colors, isDark, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { activeFestival, resetFestival } = useFestival();
  const isBn = language === 'bn';
  const { favorites } = useRoute();
  const { activeScheduledCount } = useNotifications();
  const reduceMotion = useReducedMotion();
  const { isLandscape, screenPaddingLeft, screenPaddingRight, headerHeight } = useResponsive();

  const themeAnim = useRef(new Animated.Value(0)).current;
  const heartAnim = useRef(new Animated.Value(1)).current;
  const prevFavCount = useRef(favorites.length);

  useEffect(() => {
    if (favorites.length !== prevFavCount.current) {
      prevFavCount.current = favorites.length;
      if (!reduceMotion) {
        Animated.sequence([
          Animated.timing(heartAnim, {
            toValue: 1.25,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.spring(heartAnim, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  }, [favorites.length, reduceMotion]);

  const handleToggleTheme = () => {
    if (!reduceMotion) {
      themeAnim.setValue(0);
      Animated.timing(themeAnim, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
    toggleTheme();
  };

  const themeSpin = themeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const themeScale = themeAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.8, 1],
  });

  const topInset = isLandscape
    ? Math.max(insets.top, 4)
    : Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: topInset,
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.headerBar,
          {
            height: headerHeight,
            paddingLeft: screenPaddingLeft,
            paddingRight: screenPaddingRight,
          },
        ]}
      >
        {/* Left Section: Only left-pointing back arrow icon (no PujoPath text, no 'Back' text) */}
        <View style={styles.leftGroup}>
          {showBack && onBack ? (
            <TouchableOpacity
              onPress={onBack}
              style={styles.backButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityLabel={isBn ? 'পূর্ববর্তী পৃষ্ঠায় ফিরে যান' : 'Go back'}
              accessibilityRole="button"
              activeOpacity={0.75}
            >
              <View
                style={[
                  styles.backIconCircle,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                    borderColor: colors.borderSubtle,
                  },
                ]}
              >
                <Ionicons
                  name="arrow-back"
                  size={isLandscape ? 18 : 20}
                  color={colors.primary}
                />
              </View>
              {title ? (
                <Text
                  style={[
                    styles.screenTitle,
                    {
                      color: colors.textPrimary,
                      fontSize: isLandscape ? 14 : 16,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {title}
                </Text>
              ) : null}
            </TouchableOpacity>
          ) : (
            <View style={styles.rootBackRow}>
              <TouchableOpacity
                onPress={resetFestival}
                style={styles.backButton}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                accessibilityLabel={isBn ? 'উৎসব নির্বাচনে ফিরে যান' : 'Back to festival selection'}
                accessibilityRole="button"
                activeOpacity={0.75}
              >
                <View
                  style={[
                    styles.backIconCircle,
                    {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                      borderColor: colors.borderSubtle,
                    },
                  ]}
                >
                  <Ionicons
                    name="arrow-back"
                    size={isLandscape ? 18 : 20}
                    color={colors.primary}
                  />
                </View>
              </TouchableOpacity>

              {activeFestival && (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={resetFestival}
                  style={[
                    styles.festivalBadgePill,
                    {
                      backgroundColor: colors.badge,
                      borderColor: colors.border,
                    },
                  ]}
                  accessibilityLabel="Switch festival"
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.festivalBadgePillText,
                      { color: colors.badgeText },
                    ]}
                  >
                    {activeFestival === 'kali'
                      ? isBn
                        ? '🪔 কালীপূজা ▾'
                        : '🪔 Kali Puja ▾'
                      : isBn
                      ? '🌸 দুর্গাপূজা ▾'
                      : '🌸 Durga Puja ▾'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Right Section: Theme Toggle + Language Toggle + Saved Heart */}
        <View style={styles.actionsRow}>
          {/* Theme Switcher Toggle (Sun / Moon) with smooth rotation */}
          <TouchableOpacity
            onPress={handleToggleTheme}
            activeOpacity={0.75}
            style={[
              styles.iconButton,
              {
                borderColor: colors.border,
                backgroundColor: isDark ? colors.surface : 'transparent',
              },
            ]}
            accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Animated.View
              style={{
                transform: [
                  { rotate: themeSpin },
                  { scale: themeScale },
                ],
              }}
            >
              <Ionicons
                name={isDark ? 'sunny' : 'moon'}
                size={17}
                color={isDark ? '#FBBF24' : '#625B55'}
              />
            </Animated.View>
          </TouchableOpacity>

          {/* Language Switcher Pill [ EN | বাংলা ] */}
          <View
            style={[
              styles.langPillContainer,
              {
                borderColor: colors.border,
                backgroundColor: isDark ? colors.surface : 'transparent',
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => setLanguage('en')}
              style={[
                styles.langOption,
                language === 'en' && [styles.langOptionActive, { backgroundColor: colors.primary }],
              ]}
              accessibilityLabel="English"
            >
              <Text
                style={[
                  styles.langText,
                  { color: language === 'en' ? '#FFFFFF' : colors.textSecondary },
                  language === 'en' && styles.langTextActive,
                ]}
              >
                EN
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => setLanguage('bn')}
              style={[
                styles.langOption,
                language === 'bn' && [styles.langOptionActive, { backgroundColor: colors.primary }],
              ]}
              accessibilityLabel="Bengali"
            >
              <Text
                style={[
                  styles.langText,
                  { color: language === 'bn' ? '#FFFFFF' : colors.textSecondary },
                  language === 'bn' && styles.langTextActive,
                ]}
              >
                বাংলা
              </Text>
            </TouchableOpacity>
          </View>

          {/* Saved Pandals Heart with Dynamic Counter Badge & Micro-Bounce */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              const rootNav = navigation?.getParent?.() || navigation;
              rootNav?.navigate('Saved');
            }}
            style={[
              styles.iconButton,
              {
                borderColor: colors.border,
                backgroundColor: isDark ? colors.surface : 'transparent',
              },
            ]}
            accessibilityLabel="Saved pandals"
          >
            <Animated.View
              style={{
                transform: [{ scale: heartAnim }],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name={favorites.length > 0 ? 'heart' : 'heart-outline'}
                size={17}
                color={favorites.length > 0 ? colors.primary : (isDark ? '#B4A99E' : '#625B55')}
              />
              {favorites.length > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.badgeText}>
                    {favorites.length > 99 ? '99+' : favorites.length}
                  </Text>
                </View>
              )}
            </Animated.View>
          </TouchableOpacity>

          {/* Notifications & Reminders Bell */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              const rootNav = navigation?.getParent?.() || navigation;
              rootNav?.navigate('Notifications');
            }}
            style={[
              styles.iconButton,
              {
                borderColor: colors.border,
                backgroundColor: isDark ? colors.surface : 'transparent',
              },
            ]}
            accessibilityLabel="Notifications and reminders"
          >
            <Ionicons
              name="notifications-outline"
              size={17}
              color={activeScheduledCount > 0 ? colors.primary : (isDark ? '#B4A99E' : '#625B55')}
            />
            {activeScheduledCount > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text style={styles.badgeText}>
                  {activeScheduledCount > 9 ? '9+' : activeScheduledCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    zIndex: 100,
  },
  headerBar: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginRight: 8,
  },
  rootBackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  festivalBadgePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  festivalBadgePillText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  backIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonLabel: {
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  langPillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 2,
  },
  langOption: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  langOptionActive: {
    // background dynamically set via colors.primary
  },
  langText: {
    fontSize: 11,
    fontWeight: '700',
  },
  langTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
