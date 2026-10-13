import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pandal } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRoute } from '@/context/RouteContext';

interface PandalCardProps {
  pandal: Pandal;
  onPress: () => void;
}

export const PandalCard: React.FC<PandalCardProps> = ({ pandal, onPress }) => {
  const { colors } = useTheme();
  const { language, t } = useLanguage();
  const { isPandalInRoute, addStop, removeStop, isFavorite, toggleFavorite } = useRoute();

  const inPlan = isPandalInRoute(pandal.id);
  const favorited = isFavorite(pandal.id);

  const displayName = language === 'bn' ? (pandal.nameBn || pandal.name) : pandal.name;
  const secondaryName = language === 'bn' ? pandal.name : pandal.nameBn;
  const locality = language === 'bn' ? (pandal.localityBn || pandal.locality) : pandal.locality;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        {/* Left Icon or Photo Indicator */}
        <View style={[styles.avatarBox, { backgroundColor: colors.badge }]}>
          <Ionicons name="business" size={20} color={colors.primary} />
        </View>

        {/* Title and Locality */}
        <View style={styles.titleContainer}>
          <View style={styles.badgeRow}>
            <View style={[styles.zoneBadge, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.zoneText, { color: colors.primary }]}>{pandal.zone}</Text>
            </View>
            {pandal.category && (
              <View style={[styles.categoryBadge, { backgroundColor: colors.background }]}>
                <Text style={[styles.categoryText, { color: colors.textMuted }]}>{pandal.category}</Text>
              </View>
            )}
          </View>

          <Text style={[styles.pandalName, { color: colors.text }]} numberOfLines={1}>
            {displayName}
          </Text>
          {secondaryName && (
            <Text style={[styles.pandalSecondaryName, { color: colors.textMuted }]} numberOfLines={1}>
              {secondaryName}
            </Text>
          )}
        </View>

        {/* Favorite Button */}
        <TouchableOpacity
          onPress={() => toggleFavorite(pandal.id)}
          style={styles.favButton}
          accessibilityLabel="Save pandal to favorites"
        >
          <Ionicons
            name={favorited ? 'heart' : 'heart-outline'}
            size={22}
            color={favorited ? '#E11D48' : colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      {/* Locality & Nearest Metro info */}
      <View style={styles.detailsRow}>
        <View style={styles.infoPill}>
          <Ionicons name="location-outline" size={13} color={colors.secondary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]} numberOfLines={1}>
            {locality}
          </Text>
        </View>

        {pandal.metroLinks && pandal.metroLinks.length > 0 && (
          <View style={styles.infoPill}>
            <Ionicons name="subway-outline" size={13} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]} numberOfLines={1}>
              {pandal.metroLinks[0].stationName}
            </Text>
          </View>
        )}
      </View>

      {/* Card Action Footer */}
      <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
        <View style={styles.timingBox}>
          {pandal.openingTime && pandal.closingTime ? (
            <Text style={[styles.timingText, { color: colors.textMuted }]}>
              🕒 {pandal.openingTime} - {pandal.closingTime}
            </Text>
          ) : (
            <Text style={[styles.timingText, { color: colors.textMuted }]}>
              ✨ Kolkata Durga Puja
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => {
            if (inPlan) {
              removeStop(pandal.id);
            } else {
              addStop(pandal);
            }
          }}
          style={[
            styles.planBtn,
            {
              backgroundColor: inPlan ? colors.background : colors.primary,
              borderColor: inPlan ? colors.primary : 'transparent',
            },
          ]}
        >
          <Ionicons
            name={inPlan ? 'checkmark-circle' : 'add-circle-outline'}
            size={16}
            color={inPlan ? colors.primary : '#FFFFFF'}
          />
          <Text
            style={[
              styles.planBtnText,
              { color: inPlan ? colors.primary : '#FFFFFF' },
            ]}
          >
            {inPlan ? t('inPlan') : t('addToPlan')}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  zoneBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  zoneText: {
    fontSize: 10,
    fontWeight: '700',
  },
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  pandalName: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  pandalSecondaryName: {
    fontSize: 12,
    marginTop: 2,
  },
  favButton: {
    padding: 4,
    marginLeft: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
    marginBottom: 6,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
  infoText: {
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  timingBox: {
    flex: 1,
  },
  timingText: {
    fontSize: 11,
  },
  planBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  planBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
