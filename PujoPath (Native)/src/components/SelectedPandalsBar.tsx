import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRoute } from '@/context/RouteContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { toBengaliDigits } from '@/lib/geo';

export const SelectedPandalsBar: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { stops, removeStop, clearRoute } = useRoute();
  const reduceMotion = useReducedMotion();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // System Back button: collapse expanded bottom drawer before navigating away
  useEffect(() => {
    if (!isExpanded) return;

    const onBackPress = () => {
      if (!reduceMotion) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      }
      setIsExpanded(false);
      return true; // Consumed: collapses bottom drawer without leaving the screen
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [isExpanded, reduceMotion]);

  const stopCount = stops.length;
  const floatingBottom = 56 + Math.max(insets.bottom, 8) + 8;

  const handleToggleExpand = () => {
    if (!reduceMotion) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setIsExpanded((prev) => !prev);
  };

  const handleRemoveStop = (pandalId: string) => {
    if (!reduceMotion) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    removeStop(pandalId);
  };

  const handleClearRoute = () => {
    if (!reduceMotion) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    clearRoute();
  };

  const handleDismiss = () => {
    if (!reduceMotion) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setIsDismissed(true);
  };

  if (isDismissed) {
    return null;
  }

  // 1. Empty State: (0 Pandals Selected)
  if (stopCount === 0) {
    return (
      <View style={[styles.floatingWrapper, { bottom: floatingBottom }]} pointerEvents="box-none">
        <View
          style={[
            styles.barContainer,
            {
              backgroundColor: isDark ? 'rgba(26, 22, 19, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              borderColor: isDark ? '#2F2720' : '#EEE8E1',
            },
          ]}
        >
          <View style={styles.rowContent}>
            <View style={styles.leftInfo}>
              <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(180,35,35,0.2)' : '#FDEEEE' }]}>
                <Ionicons name="git-network-outline" size={17} color="#B42323" />
              </View>
              <View style={styles.textBox}>
                <Text style={[styles.mainTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                  {isBn ? 'কোনো মণ্ডপ নির্বাচিত নেই' : '0 Pandals Selected'}
                </Text>
                <Text style={[styles.subTitle, { color: colors.textMuted }]} numberOfLines={1}>
                  {isBn ? 'কার্ড থেকে "রুট যোগ" বাটনে চাপ দিন' : 'Click "Add Route" on any card to build your trail'}
                </Text>
              </View>
            </View>

            <View style={styles.rightActions}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Planner')}
                style={[
                  styles.openPlannerBtn,
                  {
                    borderColor: isDark ? '#2F2720' : '#EEE8E1',
                  },
                ]}
              >
                <Ionicons name="git-network" size={13} color={colors.textSecondary} />
                <Text style={[styles.openPlannerBtnText, { color: colors.textSecondary }]}>
                  {isBn ? 'প্ল্যানার খুলুন' : 'Open Planner'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDismiss}
                activeOpacity={0.7}
                style={[
                  styles.dismissBtn,
                  {
                    borderColor: isDark ? '#2F2720' : '#EEE8E1',
                  },
                ]}
              >
                <Ionicons name="close" size={14} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // 2. Active State with stops
  return (
    <View style={[styles.floatingWrapper, { bottom: floatingBottom }]} pointerEvents="box-none">
      <View
        style={[
          styles.barContainer,
          {
            backgroundColor: isDark ? 'rgba(26, 22, 19, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: isDark ? '#2F2720' : '#EEE8E1',
          },
        ]}
      >
        {/* Expanded stops list drawer */}
        {isExpanded && (
          <View style={[styles.expandedDrawer, { borderBottomColor: isDark ? '#2F2720' : '#EEE8E1' }]}>
            <View style={styles.expandedHeader}>
              <Text style={[styles.expandedTitle, { color: colors.textMuted }]}>
                {isBn
                  ? `নির্বাচিত মণ্ডপসমূহ (${toBengaliDigits(stopCount)}টি):`
                  : `Selected Pandals (${stopCount} stops):`}
              </Text>
              <TouchableOpacity onPress={handleClearRoute} activeOpacity={0.7}>
                <Text style={styles.clearAllText}>
                  {isBn ? 'সব মুছুন' : 'Clear All'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.expandedStopsList}>
              {stops.map((stop, idx) => (
                <View
                  key={stop.pandalId}
                  style={[
                    styles.drawerStopItem,
                    {
                      backgroundColor: isDark ? '#201C18' : '#F9F6F0',
                      borderColor: isDark ? '#2F2720' : '#EEE8E1',
                    },
                  ]}
                >
                  <View style={styles.drawerStopLeft}>
                    <View style={styles.drawerStopNum}>
                      <Text style={styles.drawerStopNumText}>
                        {isBn ? toBengaliDigits(idx + 1) : idx + 1}
                      </Text>
                    </View>
                    <Text style={[styles.drawerStopName, { color: colors.textPrimary }]} numberOfLines={1}>
                      {isBn && stop.pandal.nameBn ? stop.pandal.nameBn : stop.pandal.name}
                    </Text>
                  </View>

                  <TouchableOpacity onPress={() => handleRemoveStop(stop.pandalId)} activeOpacity={0.7}>
                    <Ionicons name="close" size={15} color="#F43F5E" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Compact row */}
        <View style={styles.rowContent}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleToggleExpand}
            style={styles.leftInfo}
          >
            <View style={styles.badgeCount}>
              <Text style={styles.badgeCountText}>
                {isBn ? toBengaliDigits(stopCount) : stopCount}
              </Text>
            </View>
            <View style={styles.textBox}>
              <View style={styles.expandableTitleRow}>
                <Text style={[styles.mainTitle, { color: colors.textPrimary }]}>
                  {isBn ? `${toBengaliDigits(stopCount)}টি মণ্ডপ নির্বাচিত` : `${stopCount} Pandals Selected`}
                </Text>
                <Ionicons
                  name={isExpanded ? 'chevron-down' : 'chevron-up'}
                  size={14}
                  color={colors.textMuted}
                />
              </View>
              <Text style={[styles.subTitle, { color: colors.textMuted }]} numberOfLines={1}>
                {isBn ? 'তালিকায় ক্লিক করে বিস্তারিত দেখুন' : 'Tap to expand stops list'}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.rightActions}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Planner')}
              style={styles.launchPlannerBtn}
            >
              <Ionicons name="navigate" size={13} color="#FFFFFF" />
              <Text style={styles.launchPlannerBtnText}>
                {isBn ? 'রুট দেখুন' : 'View Route'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 900,
  },
  barContainer: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCount: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#B42323',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCountText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  textBox: {
    flex: 1,
  },
  expandableTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mainTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  subTitle: {
    fontSize: 11,
    marginTop: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  openPlannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  openPlannerBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dismissBtn: {
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  launchPlannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#B42323',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  launchPlannerBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  expandedDrawer: {
    maxHeight: 180,
    padding: 12,
    borderBottomWidth: 1,
  },
  expandedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expandedTitle: {
    fontSize: 11,
    fontWeight: '800',
  },
  clearAllText: {
    color: '#E11D48',
    fontSize: 11,
    fontWeight: '800',
  },
  expandedStopsList: {
    gap: 6,
  },
  drawerStopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  drawerStopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  drawerStopNum: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#B42323',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerStopNumText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  drawerStopName: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
});
