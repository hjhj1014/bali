import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, Image,
  KeyboardAvoidingView, Platform, Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { EmojiIcon as Ionicons } from '../../components/EmojiIcon';
import { getGuide, addGuideItem, updateGuideItem, deleteGuideItem } from '../../data/store';
import { GuideItem } from '../../types';
import { colors, spacing, radius, typography } from '../../constants/theme';

// ─── Constants ───────────────────────────────────────────────────────────────

const PRESET_CATEGORIES = ['카페', '식당', '마트', '세탁소', '병원', '관광', '학교', '기타'];

type FormMode = 'list' | 'add' | 'edit';

interface FormState {
  name: string;
  category: string;
  shortDescription: string;
  whyRecommended: string;
  distanceFromHouse: string;
  note: string;
  imageUrl: string;
  googleMapsUrl: string;
  blogUrl: string;
  visible: boolean;
}

const EMPTY_FORM: FormState = {
  name: '',
  category: '',
  shortDescription: '',
  whyRecommended: '',
  distanceFromHouse: '',
  note: '',
  imageUrl: '',
  googleMapsUrl: '',
  blogUrl: '',
  visible: true,
};

// ─── Main Screen ─────────────────────────────────────────────────────────────

export function AdminGuideManagerScreen() {
  const navigation = useNavigation();
  const [items, setItems]       = useState<GuideItem[]>([]);
  const [formMode, setFormMode] = useState<FormMode>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm]         = useState<FormState>(EMPTY_FORM);

  useFocusEffect(useCallback(() => {
    setItems(getGuide());
  }, []));

  const refresh = () => setItems(getGuide());

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormMode('add');
  };

  const openEdit = (item: GuideItem) => {
    setForm({
      name: item.name,
      category: item.category,
      shortDescription: item.shortDescription,
      whyRecommended: item.whyRecommended,
      distanceFromHouse: item.distanceFromHouse,
      note: item.note,
      imageUrl: item.imageUrl,
      googleMapsUrl: item.googleMapsUrl,
      blogUrl: item.blogUrl,
      visible: item.visible,
    });
    setEditingId(item.id);
    setFormMode('edit');
  };

  const cancelForm = () => {
    setFormMode('list');
    setEditingId(null);
  };

  const save = () => {
    if (!form.name.trim()) {
      Alert.alert('오류', '장소 이름을 입력해주세요.');
      return;
    }
    if (!form.googleMapsUrl.trim()) {
      Alert.alert('오류', '구글 지도 링크를 입력해주세요.');
      return;
    }

    const data: Omit<GuideItem, 'id'> = {
      name:             form.name.trim(),
      category:         form.category.trim() || '기타',
      shortDescription: form.shortDescription.trim(),
      whyRecommended:   form.whyRecommended.trim(),
      distanceFromHouse: form.distanceFromHouse.trim(),
      note:             form.note.trim(),
      imageUrl:         form.imageUrl.trim(),
      googleMapsUrl:    form.googleMapsUrl.trim(),
      blogUrl:          form.blogUrl.trim(),
      visible:          form.visible,
    };

    if (formMode === 'add') {
      addGuideItem({ id: Date.now().toString(), ...data });
    } else if (editingId) {
      updateGuideItem(editingId, data);
    }

    refresh();
    setFormMode('list');
    Alert.alert('저장 완료', formMode === 'add' ? '새 장소가 추가되었습니다.' : '장소 정보가 수정되었습니다.');
  };

  const confirmDelete = () => {
    if (!editingId) return;
    Alert.alert('삭제 확인', '이 장소를 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제', style: 'destructive',
        onPress: () => {
          deleteGuideItem(editingId);
          refresh();
          setFormMode('list');
        },
      },
    ]);
  };

  // ── Form view ──
  if (formMode !== 'list') {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Form header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={cancelForm}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {formMode === 'add' ? '새 장소 추가' : '장소 편집'}
          </Text>
          <TouchableOpacity style={styles.saveBtn} onPress={save}>
            <Text style={styles.saveBtnText}>저장</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Image preview */}
          {!!form.imageUrl && (
            <Image
              source={{ uri: form.imageUrl }}
              style={styles.imagePreview}
              resizeMode="cover"
            />
          )}

          <FormField label="장소 이름 *">
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={v => setField('name', v)}
              placeholder="예: Sanur Night Market"
              placeholderTextColor={colors.textMuted}
            />
          </FormField>

          {/* Category */}
          <FormField label="카테고리">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catChipScroll} contentContainerStyle={styles.catChipContent}>
              {PRESET_CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catChip, form.category === cat && styles.catChipActive]}
                  onPress={() => setField('category', cat)}
                >
                  <Text style={[styles.catChipText, form.category === cat && styles.catChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TextInput
              style={[styles.input, { marginTop: spacing.xs }]}
              value={form.category}
              onChangeText={v => setField('category', v)}
              placeholder="직접 입력 또는 위에서 선택"
              placeholderTextColor={colors.textMuted}
            />
          </FormField>

          <FormField label="짧은 설명">
            <TextInput
              style={[styles.input, styles.multiline]}
              value={form.shortDescription}
              onChangeText={v => setField('shortDescription', v)}
              multiline
              numberOfLines={3}
              placeholder="카드에 표시되는 한 줄 소개"
              placeholderTextColor={colors.textMuted}
            />
          </FormField>

          <FormField label="추천 이유">
            <TextInput
              style={[styles.input, styles.multiline]}
              value={form.whyRecommended}
              onChangeText={v => setField('whyRecommended', v)}
              multiline
              numberOfLines={3}
              placeholder="이 장소를 추천하는 이유"
              placeholderTextColor={colors.textMuted}
            />
          </FormField>

          <FormField label="숙소까지 거리">
            <TextInput
              style={styles.input}
              value={form.distanceFromHouse}
              onChangeText={v => setField('distanceFromHouse', v)}
              placeholder="예: 도보 10분 / 차로 5분"
              placeholderTextColor={colors.textMuted}
            />
          </FormField>

          <FormField label="메모 / 운영시간">
            <TextInput
              style={[styles.input, styles.multiline]}
              value={form.note}
              onChangeText={v => setField('note', v)}
              multiline
              numberOfLines={2}
              placeholder="운영시간, 주의사항 등"
              placeholderTextColor={colors.textMuted}
            />
          </FormField>

          <FormField label="이미지 URL">
            <TextInput
              style={styles.input}
              value={form.imageUrl}
              onChangeText={v => setField('imageUrl', v)}
              placeholder="https://images.unsplash.com/..."
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </FormField>

          <FormField label="구글 지도 링크 *">
            <TextInput
              style={styles.input}
              value={form.googleMapsUrl}
              onChangeText={v => setField('googleMapsUrl', v)}
              placeholder="https://maps.app.goo.gl/..."
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.fieldHint}>
              구글 지도에서 장소를 찾고 '공유 → 링크 복사'로 가져오세요.
            </Text>
          </FormField>

          <FormField label="블로그 링크 (선택)">
            <TextInput
              style={styles.input}
              value={form.blogUrl}
              onChangeText={v => setField('blogUrl', v)}
              placeholder="비워두면 버튼이 표시되지 않아요"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.fieldHint}>
              블로그 링크가 있을 때만 카드에 '블로그 글 보기' 버튼이 나타납니다.
            </Text>
          </FormField>

          {/* Visible toggle */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabel}>
              <Text style={styles.toggleLabelText}>공개 여부</Text>
              <Text style={styles.toggleSubText}>
                {form.visible ? '사용자 화면에 표시됩니다' : '숨겨진 상태입니다'}
              </Text>
            </View>
            <Switch
              value={form.visible}
              onValueChange={v => setField('visible', v)}
              trackColor={{ false: colors.border, true: colors.olive + 'AA' }}
              thumbColor={form.visible ? colors.olive : colors.textMuted}
            />
          </View>

          {/* Save */}
          <TouchableOpacity style={styles.saveButton} onPress={save}>
            <Ionicons name="checkmark-circle" size={20} color={colors.white} />
            <Text style={styles.saveButtonText}>저장하기</Text>
          </TouchableOpacity>

          {/* Delete (edit mode only) */}
          {formMode === 'edit' && (
            <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
              <Ionicons name="trash-outline" size={18} color={colors.booked} />
              <Text style={styles.deleteButtonText}>이 장소 삭제</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: spacing.xxl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // ── List view ──
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>가이드 관리</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Ionicons name="add" size={22} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {items.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="map-outline" size={44} color={colors.border} />
            <Text style={styles.emptyText}>등록된 장소가 없습니다</Text>
            <TouchableOpacity style={styles.emptyAddBtn} onPress={openAdd}>
              <Text style={styles.emptyAddBtnText}>+ 새 장소 추가</Text>
            </TouchableOpacity>
          </View>
        )}

        {items.map(item => (
          <View key={item.id} style={styles.itemRow}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.itemThumb} resizeMode="cover" />
            ) : (
              <View style={[styles.itemThumb, styles.itemThumbPlaceholder]}>
                <Ionicons name="image-outline" size={20} color={colors.border} />
              </View>
            )}

            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
            </View>

            <View style={[styles.visibleBadge, item.visible ? styles.visibleBadgeOn : styles.visibleBadgeOff]}>
              <Text style={[styles.visibleBadgeText, item.visible ? styles.visibleBadgeTextOn : styles.visibleBadgeTextOff]}>
                {item.visible ? '공개' : '비공개'}
              </Text>
            </View>

            <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)}>
              <Ionicons name="create-outline" size={20} color={colors.terracotta} />
            </TouchableOpacity>
          </View>
        ))}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

// ─── FormField helper ────────────────────────────────────────────────────────

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

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
  addBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.terracotta,
    alignItems: 'center', justifyContent: 'center',
  },
  saveBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.terracotta,
    borderRadius: radius.sm,
  },
  saveBtnText: { color: colors.white, fontWeight: '700', fontSize: 13 },

  // ── List ──
  listContent: { padding: spacing.md, gap: spacing.sm },

  emptyState: { alignItems: 'center', paddingTop: 60, gap: spacing.sm },
  emptyText: { ...typography.body, color: colors.textMuted },
  emptyAddBtn: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    backgroundColor: colors.terracotta,
    borderRadius: radius.full,
  },
  emptyAddBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  itemThumb: {
    width: 54,
    height: 54,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
  },
  itemThumbPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.creamDark,
  },
  itemInfo: { flex: 1 },
  itemName: { ...typography.body, fontWeight: '700', fontSize: 14 },
  itemCategory: { ...typography.caption, color: colors.textMuted, marginTop: 2 },

  visibleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  visibleBadgeOn: { backgroundColor: colors.available + '22', borderColor: colors.available },
  visibleBadgeOff: { backgroundColor: colors.border, borderColor: colors.textMuted },
  visibleBadgeText: { fontSize: 11, fontWeight: '700' },
  visibleBadgeTextOn: { color: colors.available },
  visibleBadgeTextOff: { color: colors.textMuted },

  editBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },

  // ── Form ──
  formContent: { padding: spacing.md, gap: spacing.sm },

  imagePreview: {
    width: '100%',
    height: 160,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },

  fieldWrap: { gap: 6 },
  fieldLabel: {
    ...typography.label,
    color: colors.textSecondary,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
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
  fieldHint: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
    marginTop: 4,
  },

  catChipScroll: { flexGrow: 0, marginBottom: 4 },
  catChipContent: { gap: spacing.xs, paddingBottom: 2 },
  catChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  catChipActive: { backgroundColor: colors.terracotta, borderColor: colors.terracotta },
  catChipText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  catChipTextActive: { color: colors.white },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  toggleLabel: { flex: 1 },
  toggleLabelText: { ...typography.body, fontWeight: '600' },
  toggleSubText: { ...typography.caption, color: colors.textMuted, marginTop: 2 },

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

  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.booked,
    marginTop: spacing.xs,
  },
  deleteButtonText: { color: colors.booked, fontWeight: '700', fontSize: 14 },
});
