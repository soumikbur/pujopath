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
import { useRoute } from '@/context/RouteContext';
import { PANDALS_DATA } from '@/data/pandals';
import { PandalCard } from '@/components/PandalCard';
import { CustomStopModal } from '@/components/CustomStopModal';

interface SavedScreenProps {
  navigation: any;
}

export const SavedScreen: React.FC<SavedScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const { favorites, customStops } = useRoute();

  const [activeTab, setActiveTab] = useState<'favorites' | 'custom'>('favorites');
  const [showCustomModal, setShowCustomModal] = useState(false);

  const favoritedPandals = PANDALS_DATA.filter((p) => favorites.includes(p.id));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Switcher Tab */}
      <View style={[styles.tabBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => setActiveTab('favorites')}
          style={[
            styles.tabBtn,
            { backgroundColor: activeTab === 'favorites' ? colors.primary : 'transparent' },
          ]}
        >
          <Text
            style={[
              styles.tabBtnText,
              { color: activeTab === 'favorites' ? '#FFFFFF' : colors.textSecondary },
            ]}
          >
            {language === 'bn' ? 'পছন্দের মণ্ডপ' : 'Saved Favorites'} ({favoritedPandals.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('custom')}
          style={[
            styles.tabBtn,
            { backgroundColor: activeTab === 'custom' ? colors.primary : 'transparent' },
          ]}
        >
          <Text
            style={[
              styles.tabBtnText,
              { color: activeTab === 'custom' ? '#FFFFFF' : colors.textSecondary },
            ]}
          >
            {language === 'bn' ? 'ব্যক্তিগত স্টপ' : 'Personal Stops'} ({customStops.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'favorites' ? (
          favoritedPandals.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="heart-outline" size={44} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                {language === 'bn' ? 'কোনো পছন্দের মণ্ডপ সংরক্ষিত নেই' : 'No favorites saved yet'}
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                {language === 'bn'
                  ? 'মণ্ডপ দেখার সময় হার্ট আইকন ট্যাপ করে পছন্দ সংরক্ষণ করুন।'
                  : 'Tap the heart icon on any pandal card to save it here for fast access.'}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Explore')}
                style={[styles.exploreBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.exploreBtnText}>
                  {language === 'bn' ? 'মণ্ডপ খুঁজুন' : 'Explore Pandals'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            favoritedPandals.map((pandal) => (
              <PandalCard
                key={pandal.id}
                pandal={pandal}
                onPress={() => navigation.navigate('PandalDetail', { pandalId: pandal.id })}
              />
            ))
          )
        ) : (
          <>
            <View style={styles.customHeader}>
              <TouchableOpacity
                onPress={() => setShowCustomModal(true)}
                style={[styles.addNewCustomBtn, { backgroundColor: colors.primary }]}
              >
                <Ionicons name="add" size={18} color="#FFFFFF" />
                <Text style={styles.addNewCustomText}>
                  {language === 'bn' ? '+ নতুন ব্যক্তিগত স্টপ যোগ করুন' : '+ Add New Personal Stop'}
                </Text>
              </TouchableOpacity>
            </View>

            {customStops.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="location-outline" size={44} color={colors.textMuted} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  {language === 'bn' ? 'কোনো ব্যক্তিগত স্টপ নেই' : 'No custom stops created yet'}
                </Text>
                <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                  {language === 'bn'
                    ? 'আপনার পাড়ার পূজা বা বন্ধুদের বাড়ি ব্যক্তিগতভাবে যুক্ত করুন।'
                    : 'Add friends’ houses or neighborhood pandals privately to your route.'}
                </Text>
              </View>
            ) : (
              customStops.map((stop) => (
                <PandalCard
                  key={stop.id}
                  pandal={stop}
                  onPress={() => navigation.navigate('PandalDetail', { pandalId: stop.id })}
                />
              ))
            )}
          </>
        )}
      </ScrollView>

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
    paddingBottom: 40,
  },
  customHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  addNewCustomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addNewCustomText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  exploreBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
