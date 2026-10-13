import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRoute } from '@/context/RouteContext';
import { PandalService } from '@/lib/services/PandalService';
import { PandalCard } from '@/components/PandalCard';
import { ZoneFilterBar } from '@/components/ZoneFilterBar';
import { CustomStopModal } from '@/components/CustomStopModal';
import { Pandal } from '@/types';

interface ExploreScreenProps {
  navigation: any;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { language, t } = useLanguage();
  const { customStops } = useRoute();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('All');
  const [showCustomModal, setShowCustomModal] = useState(false);

  const filteredPandals = useMemo(() => {
    let list = PandalService.filterPandals(
      {
        searchQuery,
        zone: selectedZone === 'All' ? undefined : (selectedZone as any),
      },
      undefined,
      undefined,
      customStops
    );
    return list;
  }, [searchQuery, selectedZone, customStops]);

  const renderItem = ({ item }: { item: Pandal }) => (
    <PandalCard
      pandal={item}
      onPress={() => navigation.navigate('PandalDetail', { pandalId: item.id })}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Input Bar */}
      <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder={t('searchPlaceholder')}
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Zone Filter Horizontal Scroll */}
      <ZoneFilterBar selectedZone={selectedZone} onSelectZone={setSelectedZone} />

      {/* Header Info & Custom Stop Trigger */}
      <View style={styles.resultsHeader}>
        <Text style={[styles.countText, { color: colors.textMuted }]}>
          {filteredPandals.length}{' '}
          {language === 'bn' ? 'টি মণ্ডপ পাওয়া গেছে' : 'pandals found'}
        </Text>

        <TouchableOpacity
          onPress={() => setShowCustomModal(true)}
          style={[styles.addCustomBtn, { backgroundColor: colors.badge }]}
        >
          <Ionicons name="add" size={16} color={colors.primary} />
          <Text style={[styles.addCustomText, { color: colors.primary }]}>
            {language === 'bn' ? '+ নিজস্ব স্টপ' : '+ Custom Stop'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Virtualized Pandals List */}
      <FlatList
        data={filteredPandals}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        initialNumToRender={10}
        maxToRenderPerBatch={15}
        windowSize={11}
        removeClippedSubviews={true}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {language === 'bn' ? 'কোনো মণ্ডপ মেলেনি' : 'No pandals found'}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              {language === 'bn'
                ? 'অন্য কোনো নাম বা এলাকা দিয়ে অনুসন্ধান করুন।'
                : 'Try adjusting your search query or selected zone.'}
            </Text>
          </View>
        }
      />

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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addCustomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  addCustomText: {
    fontSize: 11,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 24,
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
  },
});
