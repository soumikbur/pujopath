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
import { METRO_STATIONS_DATA } from '@/data/metro';
import { FESTIVAL_SPECIAL_METRO_TIMETABLES } from '@/data/metro/timetables';
import { MetroLineTimetable } from '@/types';

interface MetroScreenProps {
  navigation: any;
}

export const MetroScreen: React.FC<MetroScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'stations' | 'pujaSchedule'>('stations');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Switcher Tab */}
      <View style={[styles.tabBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => setActiveTab('stations')}
          style={[
            styles.tabBtn,
            { backgroundColor: activeTab === 'stations' ? colors.primary : 'transparent' },
          ]}
        >
          <Text
            style={[
              styles.tabBtnText,
              { color: activeTab === 'stations' ? '#FFFFFF' : colors.textSecondary },
            ]}
          >
            {language === 'bn' ? 'মেট্রো স্টেশনসমূহ' : 'Metro Stations'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('pujaSchedule')}
          style={[
            styles.tabBtn,
            { backgroundColor: activeTab === 'pujaSchedule' ? colors.primary : 'transparent' },
          ]}
        >
          <Text
            style={[
              styles.tabBtnText,
              { color: activeTab === 'pujaSchedule' ? '#FFFFFF' : colors.textSecondary },
            ]}
          >
            {language === 'bn' ? 'পূজা সারারাত সার্ভিস' : 'Puja Overnight Services'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'stations' ? (
          <>
            <View style={[styles.infoBanner, { backgroundColor: colors.badge }]}>
              <Ionicons name="information-circle" size={18} color={colors.primary} />
              <Text style={[styles.infoBannerText, { color: colors.primary }]}>
                {language === 'bn'
                  ? 'নীল ও সবুজ লাইনের স্টেশনসমূহ এবং নিকটবর্তী বিখ্যাত মণ্ডপসমূহ'
                  : 'Blue & Green line stations connecting to Kolkata’s top Durga Puja pandals'}
              </Text>
            </View>

            {METRO_STATIONS_DATA.map((station) => {
              const name = language === 'bn' ? (station.nameBn || station.name) : station.name;

              return (
                <View
                  key={station.id}
                  style={[styles.stationCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <View style={styles.stationTop}>
                    <View style={[styles.metroIconBox, { backgroundColor: colors.primary }]}>
                      <Ionicons name="subway" size={18} color="#FFFFFF" />
                    </View>
                    <View style={styles.stationTitleGroup}>
                      <Text style={[styles.stationName, { color: colors.text }]}>{name}</Text>
                      <Text style={[styles.stationLine, { color: colors.textMuted }]}>
                        {station.line}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.stationAddress, { color: colors.textSecondary }]}>
                    📍 {station.address}
                  </Text>

                  {station.nearbyPandalIds && station.nearbyPandalIds.length > 0 && (
                    <View style={[styles.connectingPandalsBox, { backgroundColor: colors.background }]}>
                      <Text style={[styles.connectingLabel, { color: colors.primary }]}>
                        {language === 'bn' ? 'সংযোগকারী মণ্ডপ:' : 'Connecting Pandals:'}
                      </Text>
                      <Text style={[styles.connectingNames, { color: colors.textSecondary }]}>
                        {station.nearbyPandalIds.map((id) => id.replace(/-/g, ' ')).join(' • ')}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </>
        ) : (
          <>
            <View style={[styles.infoBanner, { backgroundColor: 'rgba(217, 119, 6, 0.1)' }]}>
              <Ionicons name="moon" size={18} color={colors.secondary} />
              <Text style={[styles.infoBannerText, { color: colors.secondary }]}>
                {language === 'bn'
                  ? 'সপ্তমী, অষ্টমী ও নবমীতে মেট্রো রেলওয়ে কলকাতা কর্তৃক বিশেষ সারারাত পরিষেবা'
                  : 'Special all-night overnight train services operated on Saptami, Ashtami & Navami'}
              </Text>
            </View>

            {FESTIVAL_SPECIAL_METRO_TIMETABLES.map((schedule: MetroLineTimetable, idx: number) => (
              <View
                key={idx}
                style={[styles.scheduleCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <View style={styles.scheduleHeader}>
                  <Text style={[styles.scheduleDay, { color: colors.primary }]}>
                    {schedule.dayType}
                  </Text>
                  <View style={[styles.hoursBadge, { backgroundColor: colors.badge }]}>
                    <Text style={[styles.hoursText, { color: colors.primary }]}>
                      Overnight
                    </Text>
                  </View>
                </View>

                <Text style={[styles.scheduleLine, { color: colors.text }]}>
                  {schedule.lineName}
                </Text>

                <View style={styles.scheduleDetails}>
                  <Text style={[styles.scheduleDetailText, { color: colors.textSecondary }]}>
                    ⏱ Peak Frequency: Every {schedule.peakFrequencyMinutes} mins
                  </Text>
                  <Text style={[styles.scheduleDetailText, { color: colors.textSecondary }]}>
                    🚉 First Train: {schedule.firstTrain} | Last: {schedule.lastTrain}
                  </Text>
                </View>

                {schedule.notes && (
                  <Text style={[styles.scheduleNote, { color: colors.textMuted }]}>
                    ℹ {schedule.notes}
                  </Text>
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  infoBannerText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  stationCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  stationTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metroIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stationTitleGroup: {
    flex: 1,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '700',
  },
  stationLine: {
    fontSize: 12,
    marginTop: 2,
  },
  stationAddress: {
    fontSize: 12,
    marginBottom: 8,
  },
  connectingPandalsBox: {
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  connectingLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  connectingNames: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  scheduleCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  scheduleDay: {
    fontSize: 16,
    fontWeight: '800',
  },
  hoursBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  hoursText: {
    fontSize: 10,
    fontWeight: '700',
  },
  scheduleLine: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  scheduleDetails: {
    gap: 4,
    marginBottom: 6,
  },
  scheduleDetailText: {
    fontSize: 12,
  },
  scheduleNote: {
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 4,
  },
});
