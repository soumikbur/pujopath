import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRoute } from '@/context/RouteContext';
import { PANDALS_DATA } from '@/data/pandals';
import { ZoneFilterBar } from '@/components/ZoneFilterBar';
import { Pandal } from '@/types';

interface MapScreenProps {
  navigation: any;
}

export const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { language, t } = useLanguage();
  const { isPandalInRoute, addStop, removeStop } = useRoute();

  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedPandal, setSelectedPandal] = useState<Pandal>(PANDALS_DATA[0]);

  const zonePandals = selectedZone === 'All'
    ? PANDALS_DATA.slice(0, 50) // High performance subset for map overview
    : PANDALS_DATA.filter((p) => p.zone === selectedZone);

  const handleLaunchExternalNavigation = async (p: Pandal) => {
    const lat = p.latitude;
    const lng = p.longitude;
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(p.name)}@${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(p.name)})`,
      default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    });
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
    }
  };

  const inPlan = isPandalInRoute(selectedPandal.id);
  const displayName = language === 'bn' ? (selectedPandal.nameBn || selectedPandal.name) : selectedPandal.name;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Zone Filter selector */}
      <ZoneFilterBar selectedZone={selectedZone} onSelectZone={setSelectedZone} />

      {/* Interactive Map Visual Stage */}
      <View style={[styles.mapStage, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
        <View style={styles.mapGridPattern}>
          <Ionicons name="map" size={54} color={colors.border} />
          <Text style={[styles.mapWatermark, { color: colors.textMuted }]}>
            {language === 'bn' ? 'কলকাতা মানচিত্র পরিক্রমা' : 'Kolkata Pandal Map Explorer'}
          </Text>
        </View>

        {/* Interactive Marker Chips Carousel on Map */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.markersCarousel}
        >
          {zonePandals.map((p) => {
            const isTarget = selectedPandal.id === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                onPress={() => setSelectedPandal(p)}
                style={[
                  styles.mapMarkerPin,
                  {
                    backgroundColor: isTarget ? colors.primary : colors.surface,
                    borderColor: isTarget ? colors.gold : colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="location"
                  size={16}
                  color={isTarget ? '#FFFFFF' : colors.primary}
                />
                <Text
                  style={[
                    styles.pinText,
                    { color: isTarget ? '#FFFFFF' : colors.text, fontWeight: isTarget ? '700' : '500' },
                  ]}
                  numberOfLines={1}
                >
                  {p.locality}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Floating Selected Pandal Card */}
      <View style={[styles.detailDrawer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.drawerHeader}>
          <View style={styles.drawerBadgeRow}>
            <View style={[styles.zoneBadge, { backgroundColor: colors.badge }]}>
              <Text style={[styles.zoneText, { color: colors.primary }]}>{selectedPandal.zone}</Text>
            </View>
            <Text style={[styles.localityText, { color: colors.textMuted }]}>
              {selectedPandal.locality}
            </Text>
          </View>
        </View>

        <Text style={[styles.drawerTitle, { color: colors.text }]} numberOfLines={1}>
          {displayName}
        </Text>
        <Text style={[styles.drawerAddress, { color: colors.textSecondary }]} numberOfLines={2}>
          {selectedPandal.address}
        </Text>

        {selectedPandal.metroLinks && selectedPandal.metroLinks.length > 0 && (
          <View style={styles.metroRow}>
            <Ionicons name="subway" size={14} color={colors.primary} />
            <Text style={[styles.metroText, { color: colors.textMuted }]}>
              {selectedPandal.metroLinks[0].stationName} (~{(selectedPandal.metroLinks[0].walkingDistanceMeters / 1000).toFixed(1)} km)
            </Text>
          </View>
        )}

        <View style={styles.drawerButtonsRow}>
          <TouchableOpacity
            onPress={() => {
              if (inPlan) removeStop(selectedPandal.id);
              else addStop(selectedPandal);
            }}
            style={[
              styles.drawerPlanBtn,
              { backgroundColor: inPlan ? colors.background : colors.primary, borderColor: colors.primary },
            ]}
          >
            <Ionicons
              name={inPlan ? 'checkmark-circle' : 'add-circle'}
              size={16}
              color={inPlan ? colors.primary : '#FFFFFF'}
            />
            <Text style={[styles.drawerPlanText, { color: inPlan ? colors.primary : '#FFFFFF' }]}>
              {inPlan ? t('inPlan') : t('addToPlan')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleLaunchExternalNavigation(selectedPandal)}
            style={[styles.drawerNavBtn, { backgroundColor: colors.secondary }]}
          >
            <Ionicons name="navigate" size={16} color="#FFFFFF" />
            <Text style={styles.drawerNavText}>
              {language === 'bn' ? 'ন্যাভিগেশন' : 'Navigate'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('PandalDetail', { pandalId: selectedPandal.id })}
            style={[styles.drawerDetailBtn, { borderColor: colors.border }]}
          >
            <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapStage: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapGridPattern: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
  },
  mapWatermark: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  markersCarousel: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    gap: 8,
    paddingRight: 24,
  },
  mapMarkerPin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1.5,
    elevation: 3,
  },
  pinText: {
    fontSize: 12,
  },
  detailDrawer: {
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    elevation: 4,
  },
  drawerHeader: {
    marginBottom: 6,
  },
  drawerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  zoneBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  zoneText: {
    fontSize: 10,
    fontWeight: '700',
  },
  localityText: {
    fontSize: 12,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  drawerAddress: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  metroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  metroText: {
    fontSize: 12,
  },
  drawerButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  drawerPlanBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
  },
  drawerPlanText: {
    fontSize: 13,
    fontWeight: '700',
  },
  drawerNavBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    borderRadius: 10,
  },
  drawerNavText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  drawerDetailBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
