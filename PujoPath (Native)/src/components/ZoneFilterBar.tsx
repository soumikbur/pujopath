import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View, LayoutAnimation } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { LocalityZone } from '@/types';

export const ZONES_LIST: (LocalityZone | 'All')[] = [
  'All',
  'North Kolkata',
  'South Kolkata',
  'Central Kolkata',
  'Salt Lake',
  'Behala',
  'Howrah',
  'Dum Dum',
  'New Town',
];

const ZONE_TRANSLATIONS: Record<string, { en: string; bn: string }> = {
  All: { en: 'All Zones', bn: 'সব অঞ্চল' },
  'North Kolkata': { en: 'North Kolkata', bn: 'উত্তর কলকাতা' },
  'South Kolkata': { en: 'South Kolkata', bn: 'দক্ষিণ কলকাতা' },
  'Central Kolkata': { en: 'Central Kolkata', bn: 'মধ্য কলকাতা' },
  'Salt Lake': { en: 'Salt Lake', bn: 'সল্টলেক' },
  Behala: { en: 'Behala', bn: 'বেহালা' },
  Howrah: { en: 'Howrah', bn: 'হাওড়া' },
  'Dum Dum': { en: 'Dum Dum', bn: 'দমদম' },
  'New Town': { en: 'New Town', bn: 'নিউ টাউন' },
};

interface ZoneFilterBarProps {
  selectedZone: string;
  onSelectZone: (zone: string) => void;
}

export const ZoneFilterBar: React.FC<ZoneFilterBarProps> = ({ selectedZone, onSelectZone }) => {
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const reduceMotion = useReducedMotion();

  const handleSelectZone = (zone: string) => {
    if (!reduceMotion && selectedZone !== zone) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    onSelectZone(zone);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: colors.textMuted }]}>
        {isBn ? 'এলাকা অনুযায়ী ফিল্টার' : 'Filter by Zone'}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {ZONES_LIST.map((zone) => {
          const isSelected = selectedZone === zone;
          const label = ZONE_TRANSLATIONS[zone]
            ? ZONE_TRANSLATIONS[zone][language]
            : zone;

          return (
            <TouchableOpacity
              key={zone}
              activeOpacity={0.75}
              onPress={() => handleSelectZone(zone)}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected
                    ? '#B42323'
                    : (isDark ? '#1A1613' : '#FFFFFF'),
                  borderColor: isSelected ? '#B42323' : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: isSelected ? '#FFFFFF' : colors.textSecondary,
                    fontWeight: isSelected ? '800' : '600',
                  },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  heading: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 12,
  },
});
