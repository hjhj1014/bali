import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { EmojiIcon as Ionicons } from '../../components/EmojiIcon';
import { getAccommodation, updateAccommodation } from '../../data/store';
import { colors, spacing, radius, typography } from '../../constants/theme';

export function AdminEditInfoScreen() {
  const navigation = useNavigation();
  const acc = getAccommodation();

  const [name, setName]                     = useState(acc.name);
  const [location, setLocation]             = useState(acc.location);
  const [shortDescription, setShortDesc]    = useState(acc.shortDescription);
  const [description, setDescription]       = useState(acc.description);
  const [maxGuests, setMaxGuests]           = useState(String(acc.maxGuests));
  const [bedrooms, setBedrooms]             = useState(String(acc.bedrooms));
  const [bathrooms, setBathrooms]           = useState(String(acc.bathrooms));
  const [kakaoId, setKakaoId]               = useState(acc.kakaoId);
  const [amenities, setAmenities]           = useState(acc.amenities.join(', '));

  const save = () => {
    const guestsNum = parseInt(maxGuests, 10);
    const bedsNum   = parseInt(bedrooms, 10);
    const bathsNum  = parseInt(bathrooms, 10);

    if (!name.trim()) { Alert.alert('오류', '숙소 이름을 입력해주세요.'); return; }
    if (isNaN(guestsNum) || guestsNum < 1) { Alert.alert('오류', '최대 인원을 올바르게 입력해주세요.'); return; }

    updateAccommodation({
      name: name.trim(),
      location: location.trim(),
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      maxGuests: guestsNum,
      bedrooms: isNaN(bedsNum) ? acc.bedrooms : bedsNum,
      bathrooms: isNaN(bathsNum) ? acc.bathrooms : bathsNum,
      kakaoId: kakaoId.trim(),
      amenities: amenities.split(',').map(a => a.trim()).filter(Boolean),
    });

    Alert.alert('저장 완료', '숙소 정보가 업데이트되었습니다.', [
      { text: '확인', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>숙소 정보 편집</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={save}>
          <Text style={styles.saveBtnText}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        <Field label="숙소 이름">
          <TextInput style={styles.input} value={name} onChangeText={setName}
            placeholder="예: Bali Cozy House" placeholderTextColor={colors.textMuted} />
        </Field>

        <Field label="위치">
          <TextInput style={styles.input} value={location} onChangeText={setLocation}
            placeholder="예: Sanur, Bali" placeholderTextColor={colors.textMuted} />
        </Field>

        <Field label="짧은 소개 (목록 화면용)">
          <TextInput
            style={[styles.input, styles.multiline]}
            value={shortDescription}
            onChangeText={setShortDesc}
            multiline
            numberOfLines={3}
            placeholder="숙소의 핵심 특징을 간략하게..."
            placeholderTextColor={colors.textMuted}
          />
        </Field>

        <Field label="상세 설명">
          <TextInput
            style={[styles.input, styles.multiline]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            placeholder="숙소에 대한 자세한 설명..."
            placeholderTextColor={colors.textMuted}
          />
        </Field>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Field label="최대 인원">
              <TextInput style={styles.input} value={maxGuests} onChangeText={setMaxGuests}
                keyboardType="number-pad" placeholder="6" placeholderTextColor={colors.textMuted} />
            </Field>
          </View>
          <View style={{ width: spacing.sm }} />
          <View style={{ flex: 1 }}>
            <Field label="침실 수">
              <TextInput style={styles.input} value={bedrooms} onChangeText={setBedrooms}
                keyboardType="number-pad" placeholder="3" placeholderTextColor={colors.textMuted} />
            </Field>
          </View>
          <View style={{ width: spacing.sm }} />
          <View style={{ flex: 1 }}>
            <Field label="욕실 수">
              <TextInput style={styles.input} value={bathrooms} onChangeText={setBathrooms}
                keyboardType="number-pad" placeholder="2" placeholderTextColor={colors.textMuted} />
            </Field>
          </View>
        </View>

        <Field label="카카오톡 채널 ID">
          <TextInput style={styles.input} value={kakaoId} onChangeText={setKakaoId}
            placeholder="mamibalistay" placeholderTextColor={colors.textMuted}
            autoCapitalize="none" autoCorrect={false} />
        </Field>

        <Field label="편의시설 (쉼표로 구분)">
          <TextInput
            style={[styles.input, styles.multiline]}
            value={amenities}
            onChangeText={setAmenities}
            multiline
            numberOfLines={3}
            placeholder="수영장, 에어컨, 와이파이, 주방..."
            placeholderTextColor={colors.textMuted}
          />
        </Field>

        <TouchableOpacity style={styles.saveButton} onPress={save}>
          <Ionicons name="checkmark-circle" size={20} color={colors.white} />
          <Text style={styles.saveButtonText}>변경사항 저장</Text>
        </TouchableOpacity>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 52,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', ...typography.h3, fontSize: 16 },
  saveBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.terracotta,
    borderRadius: radius.sm,
  },
  saveBtnText: { color: colors.white, fontWeight: '700', fontSize: 13 },

  content: { padding: spacing.md },
  field: { marginBottom: spacing.md },
  fieldLabel: {
    ...typography.label,
    color: colors.textSecondary,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 15,
    color: colors.text,
  },
  multiline: {
    minHeight: 80,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  row: { flexDirection: 'row', marginBottom: spacing.md },

  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.terracotta,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  saveButtonText: { color: colors.white, fontWeight: '700', fontSize: 15 },
});
