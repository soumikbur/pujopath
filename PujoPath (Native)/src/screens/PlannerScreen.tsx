import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRoute } from '@/context/RouteContext';
import { formatDistance } from '@/lib/geo';
import { CustomStopModal } from '@/components/CustomStopModal';

interface PlannerScreenProps {
  navigation: any;
}

export const PlannerScreen: React.FC<PlannerScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { language, t } = useLanguage();
  const { stops, removeStop, clearRoute, optimizeRoute, reorderStops, totalDistanceKm } = useRoute();
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [optimizationMsg, setOptimizationMsg] = useState<string | null>(null);

  const handleOptimize = () => {
    if (stops.length < 3) {
      Alert.alert(
        language === 'bn' ? 'স্টপ যোগ করুন' : 'Add More Stops',
        language === 'bn'
          ? 'স্মার্ট রুট সাজানোর জন্য কমপক্ষে ৩টি মণ্ডপ প্রয়োজন।'
          : 'You need at least 3 stops to run smart route optimization.'
      );
      return;
    }
    const res = optimizeRoute();
    if (res.savingsKm > 0) {
      setOptimizationMsg(
        language === 'bn'
          ? `✓ রুট অপ্টিমাইজড! বাঁচানো গেছে ${res.savingsKm.toFixed(1)} কিমি (${res.savingsPercent.toFixed(0)}%)`
          : `✓ Route optimized! Saved ${res.savingsKm.toFixed(1)} km (${res.savingsPercent.toFixed(0)}%)`
      );
    } else {
      setOptimizationMsg(
        language === 'bn'
          ? '✓ আপনার রুট ইতিমধ্যে সেরা ক্রমানুসারে সাজানো আছে।'
          : '✓ Your stops are already in the optimal sequence.'
      );
    }
  };

  const handleStartNavigation = async () => {
    if (stops.length === 0) return;

    if (stops.length === 1) {
      const s = stops[0].pandal;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}`;
      await Linking.openURL(url);
      return;
    }

    const origin = stops[0].pandal;
    const destination = stops[stops.length - 1].pandal;
    const waypoints = stops.slice(1, stops.length - 1).map((s) => `${s.pandal.latitude},${s.pandal.longitude}`).join('|');

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&waypoints=${encodeURIComponent(waypoints)}&travelmode=walking`;

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Notice', 'Unable to launch external navigation.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {stops.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconBox, { backgroundColor: colors.badge }]}>
            <Ionicons name="map-outline" size={44} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('emptyRouteTitle')}</Text>
          <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>{t('emptyRouteDesc')}</Text>
          <View style={styles.emptyBtnRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Explore')}
              style={[styles.exploreBtn, { backgroundColor: colors.primary }]}
            >
              <Ionicons name="compass-outline" size={18} color="#FFFFFF" />
              <Text style={styles.exploreBtnText}>{t('explore')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowCustomModal(true)}
              style={[styles.addCustomEmptyBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
            >
              <Ionicons name="add" size={18} color={colors.primary} />
              <Text style={[styles.addCustomEmptyText, { color: colors.primary }]}>
                {language === 'bn' ? '+ নিজস্ব স্টপ' : '+ Custom Stop'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Summary Metric Header Card */}
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.summaryTopRow}>
              <View>
                <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>
                  {t('totalDistance')}
                </Text>
                <Text style={[styles.summaryDistance, { color: colors.primary }]}>
                  {formatDistance(totalDistanceKm, language)}
                </Text>
              </View>

              <View style={styles.stopsBadge}>
                <Ionicons name="flag" size={14} color={colors.secondary} />
                <Text style={[styles.stopsBadgeText, { color: colors.secondary }]}>
                  {stops.length} {t('stopsCount')}
                </Text>
              </View>
            </View>

            {optimizationMsg && (
              <View style={[styles.optMsgBox, { backgroundColor: colors.background, borderColor: colors.gold }]}>
                <Text style={[styles.optMsgText, { color: colors.textSecondary }]}>
                  {optimizationMsg}
                </Text>
              </View>
            )}

            {/* Action Buttons Row */}
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                onPress={handleOptimize}
                style={[styles.optimizeBtn, { backgroundColor: colors.primary }]}
              >
                <Ionicons name="flash" size={16} color="#FFFFFF" />
                <Text style={styles.optimizeBtnText}>{t('optimizeRoute')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleStartNavigation}
                style={[styles.navBtn, { backgroundColor: colors.secondary }]}
              >
                <Ionicons name="navigate" size={16} color="#FFFFFF" />
                <Text style={styles.navBtnText}>{t('startNavigation')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* List Controls Header */}
          <View style={styles.listHeaderRow}>
            <Text style={[styles.listHeaderTitle, { color: colors.text }]}>
              {language === 'bn' ? 'স্টপের পরিক্রমা সূচি' : 'Itinerary Sequence'}
            </Text>
            <View style={styles.topRightBtns}>
              <TouchableOpacity onPress={() => setShowCustomModal(true)} style={styles.miniBtn}>
                <Text style={[styles.miniBtnText, { color: colors.primary }]}>
                  {language === 'bn' ? '+ কাস্টম স্টপ' : '+ Custom'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={clearRoute} style={styles.miniBtn}>
                <Text style={[styles.miniBtnText, { color: '#EF4444' }]}>
                  {language === 'bn' ? 'মুছে ফেলুন' : 'Clear'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stop Cards */}
          {stops.map((stop, idx) => {
            const p = stop.pandal;
            const name = language === 'bn' ? (p.nameBn || p.name) : p.name;
            const isCustom = (p as any).isCustom;

            return (
              <View
                key={stop.pandalId}
                style={[
                  styles.stopCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: isCustom ? colors.gold : colors.border,
                  },
                ]}
              >
                {/* Order Circle */}
                <View style={[styles.orderCircle, { backgroundColor: isCustom ? colors.gold : colors.primary }]}>
                  <Text style={styles.orderNumber}>{idx + 1}</Text>
                </View>

                {/* Stop Info */}
                <View style={styles.stopInfo}>
                  <View style={styles.stopNameRow}>
                    <Text style={[styles.stopName, { color: colors.text }]} numberOfLines={1}>
                      {name}
                    </Text>
                    {isCustom && (
                      <View style={[styles.customBadge, { backgroundColor: colors.badge }]}>
                        <Text style={[styles.customBadgeText, { color: colors.primary }]}>
                          {language === 'bn' ? 'ব্যক্তিগত' : 'Personal'}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.stopLocality, { color: colors.textMuted }]} numberOfLines={1}>
                    {p.locality} • {p.zone}
                  </Text>
                </View>

                {/* Reordering Controls */}
                <View style={styles.reorderControls}>
                  {idx > 0 && (
                    <TouchableOpacity
                      onPress={() => reorderStops(idx, idx - 1)}
                      style={styles.arrowBtn}
                    >
                      <Ionicons name="chevron-up" size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                  )}
                  {idx < stops.length - 1 && (
                    <TouchableOpacity
                      onPress={() => reorderStops(idx, idx + 1)}
                      style={styles.arrowBtn}
                    >
                      <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Remove Stop */}
                <TouchableOpacity onPress={() => removeStop(stop.pandalId)} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}

      <CustomStopModal
        visible={showCustomModal}
        onClose={() => setShowCustomModal(false)}
      />
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  addCustomEmptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  addCustomEmptyText: {
    fontSize: 14,
    fontWeight: '700',
  },
  summaryCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  summaryDistance: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 2,
  },
  stopsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
  },
  stopsBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  optMsgBox: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  optMsgText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optimizeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 42,
    borderRadius: 10,
  },
  optimizeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 42,
    borderRadius: 10,
  },
  navBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  listHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  topRightBtns: {
    flexDirection: 'row',
    gap: 12,
  },
  miniBtn: {
    paddingVertical: 4,
  },
  miniBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  stopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  orderCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  orderNumber: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  stopInfo: {
    flex: 1,
  },
  stopNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stopName: {
    fontSize: 15,
    fontWeight: '700',
    flexShrink: 1,
  },
  customBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  customBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  stopLocality: {
    fontSize: 12,
    marginTop: 2,
  },
  reorderControls: {
    flexDirection: 'column',
    marginRight: 6,
  },
  arrowBtn: {
    padding: 2,
  },
  deleteBtn: {
    padding: 6,
  },
});
