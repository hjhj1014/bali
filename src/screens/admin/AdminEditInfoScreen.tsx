import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { EmojiIcon as Ionicons } from '../../components/EmojiIcon';
import { supabase } from '../../lib/supabase';           // ← 직접 호출
import { updateAccommodation } from '../../data/store';  // in-memory 갱신용
import { colors, spacing, radius, typography } from '../../constants/theme';

const HOUSE_ID = 'bali-cozy-house';

export function AdminEditInfoScreen() {
  const navigation = useNavigation();

  const [name,             setName]      = useState('');
  const [location,         setLocation]  = useState('');
  const [shortDescription, setShortDesc] = useState('');
  const [description,      setDesc]      = useState('');
  const [notice,           setNotice]    = useState('');
  const [maxGuests,        setMaxGuests] = useState('4');
  const [bedrooms,         setBedrooms]  = useState('2');
  const [bathrooms,        setBathrooms] = useState('1');
  const [kakaoId,          setKakaoId]   = useState('');
  const [amenities,        setAmenities] = useState('');
  const [loading,          setLoading]   = useState(true);
  const [saving,           setSaving]    = useState(false);

  // ── 화면 진입 시 Supabase에서 직접 fetch ──────────────────────────────────
  useFocusEffect(useCallback(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      console.log('[AdminEditInfo] Supabase fetch 시작...');

      const { data, error } = await supabase
        .from('accommodation')
        .select('*')
        .eq('id', HOUSE_ID)
        .single();

      if (cancelled) return;

      if (error) {
        console.error('[AdminEditInfo] fetch 실패:', error.code, error.message);
        Alert.alert(
          '❌ 데이터 로드 실패',
          `코드: ${error.code}\n메시지: ${error.message}\n\nsupabase.ts의 URL/Key를 확인해주세요.`
        );
        setLoading(false);
        return;
      }

      if (!data) {
        Alert.alert('⚠️ 데이터 없음', 'accommodation 테이블에 행이 없습니다. SQL 초기 insert를 실행해주세요.');
        setLoading(false);
        return;
      }

      console.log('[AdminEditInfo] fetch 성공 ✅:', data.name);

      // 폼 채우기
      setName(data.name ?? '');
      setLocation(data.location ?? '');
      setShortDesc(data.short_description ?? '');
      setDesc(data.description ?? '');
      setNotice(data.notice ?? '');
      setMaxGuests(String(data.max_guests ?? 4));
      setBedrooms(String(data.bedrooms ?? 2));
      setBathrooms(String(data.bathrooms ?? 1));
      setKakaoId(data.kakao_id ?? '');
      setAmenities((data.amenities ?? []).join(', '));
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, []));

  // ── 저장: Supabase upsert → 검증 SELECT → alert ───────────────────────────
  const save = async () => {
    const guestsNum = parseInt(maxGuests, 10);
    const bedsNum   = parseInt(bedrooms,  10);
    const bathsNum  = parseInt(bathrooms, 10);

    if (!name.trim()) { Alert.alert('오류', '숙소 이름을 입력해주세요.'); return; }
    if (isNaN(guestsNum) || guestsNum < 1) { Alert.alert('오류', '최대 인원을 올바르게 입력해주세요.'); return; }

    setSaving(true);

    const payload = {
      id:                HOUSE_ID,
      name:              name.trim(),
      location:          location.trim(),
      short_description: shortDescription.trim(),
      description:       description.trim(),
      notice:            notice.trim(),
      price_per_night:   0,
      max_guests:        guestsNum,
      bedrooms:          isNaN(bedsNum)  ? 2 : bedsNum,
      bathrooms:         isNaN(bathsNum) ? 1 : bathsNum,
      kakao_id:          kakaoId.trim(),
      amenities:         amenities.split(',').map((a) => a.trim()).filter(Boolean),
      updated_at:        new Date().toISOString(),
    };

    console.log('[AdminEditInfo] upsert 시작:', JSON.stringify(payload));

    // ① upsert
    const { error: upsertError } = await supabase
      .from('accommodation')
      .upsert(payload, { onConflict: 'id' });

    if (upsertError) {
      setSaving(false);
      console.error('[AdminEditInfo] upsert 실패:', upsertError.code, upsertError.message);
      Alert.alert(
        '❌ 저장 실패',
        `코드: ${upsertError.code}\n메시지: ${upsertError.message}\n\n` +
        'Supabase RLS 정책 또는 URL/Key를 확인해주세요.'
      );
      return;
    }

    // ② 저장 직후 검증 SELECT
    const { data: verified, error: verifyError } = await supabase
      .from('accommodation')
      .select('name, description, notice, updated_at')
      .eq('id', HOUSE_ID)
      .single();

    setSaving(false);

    if (verifyError) {
      console.error('[AdminEditInfo] 검증 fetch 실패:', verifyError.message);
      Alert.alert('⚠️ upsert는 됐지만 검증 실패', verifyError.message);
      return;
    }

    console.log('[AdminEditInfo] 저장 검증 ✅ DB 최신값:', JSON.stringify(verified));

    // ③ in-memory도 동기화 (손님 화면 즉시 반영)
    updateAccommodation({
      name:             payload.name,
      location:         payload.location,
      shortDescription: payload.short_description,
      description:      payload.description,
      notice:           payload.notice,
      maxGuests:        payload.max_guests,
      bedrooms:         payload.bedrooms,
      bathrooms:        payload.bathrooms,
      kakaoId:          payload.kakao_id,
      amenities:        payload.amenities,
    });

    Alert.alert(
      '✅ Supabase 저장 완료',
      `DB에 저장된 이름: ${verified.name}\n수정일시: ${verified.updated_at}`,
      [{ text: '확인', onPress: () => navigation.goBack() }]
    );
  };

  // ── 로딩 중 ──────────────────────────────────────────────────────────────
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
            placeholder="예: 7월 특가! (비워두면 배너 숨겨짐)"
            placeholderTextColor={colors.textMuted}
          />
        </Field>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Field label="최대 인원">
              <TextInput style={styles.input} value={maxGuests} onChangeText={setMaxGuests}
                keyboardType="number-pad" placeholderTextColor={colors.textMuted} />
            </Field>
          </View>
          <View style={{ width: spacing.sm }} />
          <View style={{ flex: 1 }}>
            <Field label="침실 수">
              <TextInput style={styles.input} value={bedrooms} onChangeText={setBedrooms}
                keyboardType="number-pad" placeholderTextColor={colors.textMuted} />
            </Field>
          </View>
          <View style={{ width: spacing.sm }} />
          <View style={{ flex: 1 }}>
            <Field label="욕실 수">
              <TextInput style={styles.input} value={bathrooms} onChangeText={setBathrooms}
                keyboardType="number-pad" placeholderTextColor={colors.textMuted} />
            </Field>
          </View>
        </View>

        <Field label="카카오톡 채널 ID">
          <TextInput style={styles.input} value={kakaoId} onChangeText={setKakaoId}
            autoCapitalize="none" autoCorrect={false}
            placeholderTextColor={colors.textMuted} />
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
          onPress={save} disabled={saving}
        >
          {saving
            ? <ActivityIndicator color={colors.white} />
            : (
              <>
                <Ionicons name="checkmark-circle" size={20} color={colors.white} />
                <Text style={styles.saveButtonText}>Supabase에 저장하기</Text>
              </>
            )
          }
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
    backgroundColor: colors.terracotta, borderRadius: radius.sm, paddingHorizontal: spacing.sm,
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
