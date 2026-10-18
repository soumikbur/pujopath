import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRoute } from '@/context/RouteContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';

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
  const { favorites } = useRoute();
  const reduceMotion = useReducedMotion();

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

  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0);

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
      <View style={styles.headerBar}>
        {/* Left Section: Brand Logo or Back Button */}
        <View style={styles.leftGroup}>
          {showBack && onBack ? (
            <TouchableOpacity
              onPress={onBack}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={22} color="#B42323" />
              {title ? (
                <Text style={[styles.screenTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                  {title}
                </Text>
              ) : null}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation?.navigate('MainTabs', { screen: 'HomeTab' })}
              style={styles.brandContainer}
              accessibilityLabel="PujoPath home"
            >
              <Text style={styles.brandTitle}>PujoPath</Text>
            </TouchableOpacity>
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
                language === 'en' && styles.langOptionActive,
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
                language === 'bn' && styles.langOptionActive,
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
                color={favorites.length > 0 ? '#B42323' : (isDark ? '#B4A99E' : '#625B55')}
              />
              {favorites.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {favorites.length > 99 ? '99+' : favorites.length}
                  </Text>
                </View>
              )}
            </Animated.View>
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
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#B42323',
    letterSpacing: -0.4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  screenTitle: {
    fontSize: 17,
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
    backgroundColor: '#B42323',
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
    backgroundColor: '#B42323',
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
