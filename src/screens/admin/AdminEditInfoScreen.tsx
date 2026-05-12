import React, { useState, useCallback } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { EmojiIcon as Ionicons } from '../../components/EmojiIcon';
import { getAccommodation } from '../../data/store';
import { syncAccommodation, saveAccommodation } from '../../data/supabaseStore';
import { colors, spacing, radius, typography } from '../../constants/theme';

export function AdminEditInfoScreen() {
  const navigation = useNavigation();

  // 폼 상태 — 초기값은 in-memory(앱 기동 직후 mockData)
  // useFocusEffect에서 Supabase 최신값으로 덮어씀
  const acc = getAccommodation();
  const [name,             setName]      = useState(acc.name);
  const [location,         setLocation]  = useState(acc.location);
  const [shortDescription, setShortDesc] = useState(acc.shortDescription);
  const [description,      setDesc]      = useState(acc.description);
  const [notice,           setNotice]    = useState(acc.notice ?? '');
  const [maxGuests,        setMaxGuests] = useState(String(acc.maxGuests));
  const [bedrooms,         setBedrooms]  = useState(String(acc.bedrooms));
  const [bathrooms,        setBathrooms] = useState(String(acc.bathrooms));
  const [kakaoId,          setKakaoId]   = useState(acc.kakaoId);
  const [amenities,        setAmenities] = useState(acc.amenities.join(', '));
  const [loading,          setLoading]   = useState(true);
  const [saving,           setSaving]    = useState(false);

  // ── 화면 진입 시 Supabase에서 최신 데이터를 불러와 폼을 채움 ──────────────
  // 이 부분이 없으면 새로고침 후 mockData 기본값만 보임
  useFocusEffect(useCallback(() => {
    setLoading(true);
    syncAccommodation()
      .then((fresh) => {
        setName(fresh.name);
        setLocation(fresh.location);
        setShortDesc(fresh.shortDescription);
        setDesc(fresh.description);
        setNotice(fresh.notice ?? '');
        setMaxGuests(String(fresh.maxGuests));
        setBedrooms(String(fresh.bedrooms));
        setBathrooms(String(fresh.bathrooms));
        setKakaoId(fresh.kakaoId);
        setAmenities(fresh.amenities.join(', '));
        console.log('[AdminEditInfo] 폼 로드 완료:', fresh.name);
      })
      .catch((err) => {
        console.error('[AdminEditInfo] 폼 로드 실패:', err);
        Alert.alert('로드 실패', 'Supabase 연결을 확인해주세요.\n' + (err?.message ?? ''));
      })
      .finally(() => setLoading(false));
  }, []));

  // ── 저장 ──────────────────────────────────────────────────────────────────
  const save = async () => {
    const guestsNum = parseInt(maxGuests, 10);
    const bedsNum   = parseInt(bedrooms, 10);
    const bathsNum  = parseInt(bathrooms, 10);

    if (!name.trim()) {
      Alert.alert('오류', '숙소 이름을 입력해주세요.');
      return;
    }
    if (isNaN(guestsNum) || guestsNum < 1) {
      Alert.alert('오류', '최대 인원을 올바르게 입력해주세요.');
      return;
    }

    setSaving(true);
    try {
      await saveAccommodation({
        name:             name.trim(),
        location:         location.trim(),
        shortDescription: shortDescription.trim(),
        description:      description.trim(),
        notice:           notice.trim(),
        pricePerNight:    0,
        maxGuests:        guestsNum,
        bedrooms:         isNaN(bedsNum)  ? acc.bedrooms  : bedsNum,
        bathrooms:        isNaN(bathsNum) ? acc.bathrooms : bathsNum,
        kakaoId:          kakaoId.trim(),
        amenities:        amenities.split(',').map((a) => a.trim()).filter(Boolean),
      });

      Alert.alert('저장 완료 ✅', 'Supabase에 저장되었습니다.\n새로고침해도 데이터가 유지됩니다.', [
        { text: '확인', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      console.error('[AdminEditInfo] 저장 실패:', err);
      Alert.alert(
        '저장 실패 ❌',
        `오류: ${err?.message ?? '알 수 없는 오류'}\n\nSupabase RLS 정책 또는 URL/Key를 확인해주세요.`
      );
    } finally {
      setSaving(false);
    }
  };

  // ── 로딩 중 화면 ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={colors.terracotta} />
        <Text style={styles.loadingText}>Supabase에서 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>숙소 정보 편집</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={saving}>
          {saving
            ? <ActivityIndicator size="small" color={colors.white} />
            : <Text style={styles.saveBtnText}>저장</Text>
          }
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
            value={shortDescription} onChangeText={setShortDesc}
            multiline numberOfLines={3}
            placeholder="숙소의 핵심 특징을 간략하게..."
            placeholderTextColor={colors.textMuted}
          />
        </Field>

        <Field label="상세 설명">
          <TextInput
            style={[styles.input, styles.multiline]}
            value={description} onChangeText={setDesc}
            multiline numberOfLines={5}
            placeholder="숙소에 대한 자세한 설명..."
            placeholderTextColor={colors.textMuted}
          />
        </Field>

        <Field label="📢 안내 문구 (홈 화면 배너)">
          <TextInput
            style={[styles.input, styles.multiline]}
            value={notice} onChangeText={setNotice}
            multiline numberOfLines={2}
            placeholder="예: 7월 특가 진행 중! 카톡 문의 주세요 😊  (비워두면 배너 숨겨짐)"
            placeholderTextColor={colors.textMuted}
          />
        </Field>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Field label="최대 인원">
              <TextInput style={styles.input} value={maxGuests} onChangeText={setMaxGuests}
                keyboardType="number-pad" placeholder="4" placeholderTextColor={colors.textMuted} />
            </Field>
          </View>
          <View style={{ width: spacing.sm }} />
          <View style={{ flex: 1 }}>
            <Field label="침실 수">
              <TextInput style={styles.input} value={bedrooms} onChangeText={setBedrooms}
                keyboardType="number-pad" placeholder="2" placeholderTextColor={colors.textMuted} />
            </Field>
          </View>
          <View style={{ width: spacing.sm }} />
          <View style={{ flex: 1 }}>
            <Field label="욕실 수">
              <TextInput style={styles.input} value={bathrooms} onChangeText={setBathrooms}
                keyboardType="number-pad" placeholder="1" placeholderTextColor={colors.textMuted} />
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
            value={amenities} onChangeText={setAmenities}
            multiline numberOfLines={3}
            placeholder="수영장, 에어컨, 와이파이, 주방..."
            placeholderTextColor={colors.textMuted}
          />
        </Field>

        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.7 }]}
          onPress={save}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color={colors.white} />
              <Text style={styles.saveButtonText}>Supabase에 저장하기</Text>
            </>
          )}
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

  loadingWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.background, gap: spacing.md,
  },
  loadingText: { ...typography.bodySmall, color: colors.textMuted },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 52, paddingBottom: spacing.md, paddingHorizontal: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', ...typography.h3, fontSize: 16 },
  saveBtn: {
    minWidth: 44, height: 32, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.terracotta, borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
  },
  saveBtnText: { color: colors.white, fontWeight: '700', fontSize: 13 },

  content: { padding: spacing.md },
  field: { marginBottom: spacing.md },
  fieldLabel: {
    ...typography.label, color: colors.textSecondary, fontSize: 11,
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6,
  },
  input: {
    backgroundColor: colors.card, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 15, color: colors.text,
  },
  multiline: { minHeight: 80, paddingTop: 12, textAlignVertical: 'top' },
  row: { flexDirection: 'row', marginBottom: spacing.md },

  saveButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, backgroundColor: colors.terracotta,
    paddingVertical: spacing.md, borderRadius: radius.md, marginTop: spacing.sm,
  },
  saveButtonText: { color: colors.white, fontWeight: '700', fontSize: 15 },
});
