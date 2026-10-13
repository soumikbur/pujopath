import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { PUJA_CALENDAR_DATA } from '@/data/calendar';
import { SANDHI_PUJA_SCHEDULES, SandhiPujaConvention } from '@/data/calendar/sandhiPuja';

interface CalendarScreenProps {
  navigation: any;
}

const conventions: SandhiPujaConvention[] = SANDHI_PUJA_SCHEDULES[2026]?.conventions || [];

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { language } = useLanguage();

  const [selectedConventionIndex, setSelectedConventionIndex] = useState(0);
  const currentConvention = conventions[selectedConventionIndex] || conventions[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Sandhi Puja Featured Special Hero Card */}
        <View style={[styles.sandhiHeroCard, { backgroundColor: colors.surface, borderColor: colors.gold }]}>
          <View style={styles.sandhiHeaderRow}>
            <View style={[styles.flameIconBox, { backgroundColor: colors.badge }]}>
              <Ionicons name="flame" size={24} color={colors.primary} />
            </View>
            <View style={styles.sandhiTitleBox}>
              <Text style={[styles.sandhiTitle, { color: colors.text }]}>
                {language === 'bn' ? 'সন্ধিপূজা ২০২৬ নির্ঘণ্ট' : 'Sandhi Puja 2026 Timings'}
              </Text>
              <Text style={[styles.sandhiSub, { color: colors.secondary }]}>
                {currentConvention.dateString}
              </Text>
            </View>
          </View>

          {/* Timing Display */}
          <View style={[styles.timingBanner, { backgroundColor: colors.background }]}>
            <Text style={[styles.timingTime, { color: colors.primary }]}>
              {currentConvention.startTime} – {currentConvention.endTime}
            </Text>
            <Text style={[styles.durationBadge, { color: colors.textMuted }]}>
              {currentConvention.durationDisplay}
            </Text>
          </View>

          {/* Almanac Convention Toggle Pills */}
          <Text style={[styles.conventionLabel, { color: colors.textMuted }]}>
            {language === 'bn' ? 'পঞ্জিকা বা সিদ্ধান্ত নির্বাচন:' : 'Select Almanac Tradition:'}
          </Text>
          <View style={styles.conventionRow}>
            {conventions.map((conv: SandhiPujaConvention, idx: number) => {
              const isSelected = selectedConventionIndex === idx;
              return (
                <TouchableOpacity
                  key={conv.id}
                  onPress={() => setSelectedConventionIndex(idx)}
                  style={[
                    styles.convChip,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.convChipText,
                      { color: isSelected ? '#FFFFFF' : colors.textSecondary, fontWeight: isSelected ? '700' : '500' },
                    ]}
                  >
                    {conv.name.split(' ')[0]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.significanceText, { color: colors.textSecondary }]}>
            {language === 'bn' ? currentConvention.significanceBn : currentConvention.significance}
          </Text>
        </View>

        {/* Complete Festival Calendar Days */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {language === 'bn' ? 'দুর্গাপূজা ২০২৬ নির্ঘণ্ট ও তিথি' : 'Festival Days & Auspicious Tithis'}
          </Text>
        </View>

        {PUJA_CALENDAR_DATA.map((day) => {
          const dayName = language === 'bn' ? day.dayNameBn : day.dayName;
          const significance = language === 'bn' ? day.significanceBn : day.significance;

          return (
            <View
              key={day.id}
              style={[styles.dayCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={styles.dayTopRow}>
                <View>
                  <Text style={[styles.dayName, { color: colors.primary }]}>{dayName}</Text>
                  <Text style={[styles.dateString, { color: colors.textMuted }]}>
                    {day.dateString}
                  </Text>
                </View>
                <View style={[styles.calendarIconBox, { backgroundColor: colors.background }]}>
                  <Ionicons name="calendar" size={18} color={colors.primary} />
                </View>
              </View>

              <Text style={[styles.daySignificance, { color: colors.textSecondary }]}>
                {significance}
              </Text>

              {day.pushpanjaliTimings && (
                <View style={[styles.anjaliBox, { backgroundColor: colors.background }]}>
                  <Ionicons name="flower-outline" size={14} color={colors.gold} />
                  <Text style={[styles.anjaliText, { color: colors.text }]}>
                    {language === 'bn' ? 'পুষ্পাঞ্জলি: ' : 'Pushpanjali: '}
                    {language === 'bn' ? day.pushpanjaliTimingsBn : day.pushpanjaliTimings}
                  </Text>
                </View>
              )}

              {/* Rituals List */}
              <View style={styles.ritualsContainer}>
                {day.rituals.map((ritual, rIdx) => (
                  <View key={rIdx} style={styles.ritualLine}>
                    <Text style={{ color: colors.primary }}>•</Text>
                    <Text style={[styles.ritualText, { color: colors.textMuted }]}>
                      {language === 'bn' && day.ritualsBn ? day.ritualsBn[rIdx] : ritual}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sandhiHeroCard: {
    borderRadius: 18,
    borderWidth: 2,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  sandhiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  flameIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sandhiTitleBox: {
    flex: 1,
  },
  sandhiTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  sandhiSub: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  timingBanner: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  timingTime: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  durationBadge: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
  },
  conventionLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },
  conventionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  convChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  convChipText: {
    fontSize: 11,
  },
  significanceText: {
    fontSize: 12,
    lineHeight: 18,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  dayCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },
  dayTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dayName: {
    fontSize: 17,
    fontWeight: '800',
  },
  dateString: {
    fontSize: 12,
    marginTop: 2,
  },
  calendarIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daySignificance: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  anjaliBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  anjaliText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ritualsContainer: {
    gap: 4,
  },
  ritualLine: {
    flexDirection: 'row',
    gap: 6,
  },
  ritualText: {
    fontSize: 12,
    flex: 1,
  },
});
