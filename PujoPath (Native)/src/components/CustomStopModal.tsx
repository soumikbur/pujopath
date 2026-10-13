import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRoute } from '@/context/RouteContext';
import { Pandal } from '@/types';

interface CustomStopModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CustomStopModal: React.FC<CustomStopModalProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const { t, language } = useLanguage();
  const { addCustomStop } = useRoute();

  const [name, setName] = useState('');
  const [locality, setLocality] = useState('');
  const [address, setAddress] = useState('');
  const [zone, setZone] = useState('North Kolkata');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter a name for your stop.');
      return;
    }

    const customId = `custom-stop-${Date.now()}`;
    const newStop: Pandal = {
      id: customId,
      slug: customId,
      name: name.trim(),
      nameBn: name.trim(),
      zone: zone as any,
      locality: locality.trim() || 'Custom Stop',
      localityBn: locality.trim() || 'কাস্টম স্টপ',
      address: address.trim() || 'Personal stop location',
      addressBn: address.trim() || 'ব্যক্তিগত স্টপ অবস্থান',
      latitude: 22.5726, // Center of Kolkata fallback
      longitude: 88.3639,
      theme: 'Personal Custom Stop',
      themeBn: 'ব্যক্তিগত কাস্টম স্টপ',
      category: 'Community/Theme',
      description: 'Personal pandal stop created privately on this device.',
      descriptionBn: 'এই ডিভাইসে ব্যক্তিগতভাবে সংরক্ষিত নিজস্ব স্টপ।',
      isCustom: true,
    } as any;

    addCustomStop(newStop);
    setName('');
    setLocality('');
    setAddress('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={[styles.modalBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.modalHeader}>
            <View style={styles.titleRow}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {language === 'bn' ? 'ব্যক্তিগত স্টপ যোগ করুন' : 'Add Personal Stop'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Privacy Disclaimer Banner */}
          <View style={[styles.disclaimerBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Ionicons name="shield-checkmark" size={16} color={colors.secondary} />
            <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
              {t('customStopDisclaimer')}
            </Text>
          </View>

          <ScrollView style={styles.formScroll}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {language === 'bn' ? 'স্টপের নাম *' : 'Stop Name *'}
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="e.g. My Neighborhood Puja / Friend's House"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {language === 'bn' ? 'এলাকা / লোকালিটি' : 'Locality / Area'}
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="e.g. Shyambazar, Salt Lake, Behala"
              placeholderTextColor={colors.textMuted}
              value={locality}
              onChangeText={setLocality}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {language === 'bn' ? 'ঠিকানা বা ল্যান্ডমার্ক' : 'Address / Landmark'}
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="e.g. Near Tank 3, Gate No. 2"
              placeholderTextColor={colors.textMuted}
              value={address}
              onChangeText={setAddress}
            />
          </ScrollView>

          <View style={styles.btnRow}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.cancelBtn, { borderColor: colors.border }]}
            >
              <Text style={[styles.cancelBtnText, { color: colors.textMuted }]}>
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              style={[styles.saveBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.saveBtnText}>
                {language === 'bn' ? 'সংরক্ষণ ও রুটে যোগ' : 'Save & Add to Plan'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  disclaimerText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  formScroll: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 2,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
