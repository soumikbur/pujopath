import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title, subtitle, showBack, onBack }) => {
  const insets = useSafeAreaInsets();
  const { colors, isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 12) + 8,
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.contentRow}>
        <View style={styles.leftGroup}>
          {showBack && onBack ? (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
          ) : (
            <View style={[styles.logoIconBadge, { backgroundColor: colors.primary }]}>
              <Ionicons name="sparkles" size={16} color="#FFF" />
            </View>
          )}

          <View style={styles.titleGroup}>
            <Text style={[styles.appTitle, { color: colors.primary }]}>
              {title || t('appName')}
            </Text>
            <Text style={[styles.appSubtitle, { color: colors.textMuted }]} numberOfLines={1}>
              {subtitle || t('tagline')}
            </Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          {/* Language Toggle */}
          <TouchableOpacity
            onPress={toggleLanguage}
            style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.border }]}
            accessibilityLabel="Switch language"
          >
            <Text style={[styles.langText, { color: colors.primary }]}>
              {language === 'en' ? 'বাংলা' : 'EN'}
            </Text>
          </TouchableOpacity>

          {/* Theme Toggle */}
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.border }]}
            accessibilityLabel="Toggle dark mode"
          >
            <Ionicons
              name={isDark ? 'sunny' : 'moon'}
              size={18}
              color={isDark ? colors.gold : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 10,
    padding: 4,
  },
  logoIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titleGroup: {
    flex: 1,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  appSubtitle: {
    fontSize: 11,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    height: 34,
    minWidth: 36,
    paddingHorizontal: 8,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
