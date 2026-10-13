import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
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
  'North Kolkata': { en: 'North', bn: 'উত্তর' },
  'South Kolkata': { en: 'South', bn: 'দক্ষিণ' },
  'Central Kolkata': { en: 'Central', bn: 'মধ্য' },
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
  const { colors } = useTheme();
  const { language } = useLanguage();

  return (
    <View style={styles.container}>
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
              onPress={() => onSelectZone(zone)}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? colors.primary : colors.surface,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: isSelected ? '#FFFFFF' : colors.textSecondary,
                    fontWeight: isSelected ? '700' : '500',
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
    paddingVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 13,
  },
});
