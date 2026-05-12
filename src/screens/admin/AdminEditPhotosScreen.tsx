import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { EmojiIcon as Ionicons } from '../../components/EmojiIcon';
import { getAccommodation, updateAccommodation } from '../../data/store';
import { imageSource } from '../../utils/imageSource';
import { colors, spacing, radius, typography } from '../../constants/theme';

export function AdminEditPhotosScreen() {
  const navigation = useNavigation();
  // photos is (string | number)[] — numbers are local require() assets
  const [photos, setPhotos] = useState<(string | number)[]>(() => [...getAccommodation().photos]);
  const [newUrl, setNewUrl] = useState('');

  const addPhoto = () => {
    const trimmed = newUrl.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http')) {
      Alert.alert('오류', 'http 또는 https로 시작하는 URL을 입력해주세요.');
      return;
    }
    setPhotos(prev => [...prev, trimmed]);
    setNewUrl('');
  };

  const removePhoto = (index: number) => {
    if (photos.length <= 1) {
      Alert.alert('오류', '사진은 최소 1장 이상 있어야 합니다.');
      return;
    }
    Alert.alert('사진 삭제', '이 사진을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제', style: 'destructive',
        onPress: () => setPhotos(prev => prev.filter((_, i) => i !== index)),
      },
    ]);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setPhotos(prev => {
      const arr = [...prev];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
  };

  const moveDown = (index: number) => {
    if (index === photos.length - 1) return;
    setPhotos(prev => {
      const arr = [...prev];
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
      return arr;
    });
  };

  const updateUrl = (index: number, value: string) => {
    setPhotos(prev => {
      const arr = [...prev];
      arr[index] = value;
      return arr;
    });
  };

  const save = () => {
    const valid = photos.filter(p => p !== '');
    if (valid.length === 0) {
      Alert.alert('오류', '사진이 최소 1장 이상 있어야 합니다.');
      return;
    }
    updateAccommodation({ photos: valid });
    Alert.alert('저장 완료', '사진 목록이 업데이트되었습니다.', [
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
        <Text style={styles.headerTitle}>사진 편집</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={save}>
          <Text style={styles.saveBtnText}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">

        <Text style={styles.hint}>첫 번째 사진이 대표 이미지로 사용됩니다.</Text>

        {photos.map((photo, i) => {
          const isLocal = typeof photo === 'number';
          return (
            <View key={i} style={styles.photoRow}>
              {/* Thumbnail */}
              <Image
                source={imageSource(photo)}
                style={styles.thumb}
                resizeMode="cover"
              />

              <View style={styles.photoContent}>
                <Text style={styles.photoIndex}>사진 {i + 1}</Text>
                {isLocal ? (
                  <View style={styles.localBadge}>
                    <Ionicons name="image" size={13} color={colors.olive} />
                    <Text style={styles.localText}>로컬 이미지</Text>
                  </View>
                ) : (
                  <TextInput
                    style={styles.urlInput}
                    value={photo as string}
                    onChangeText={v => updateUrl(i, v)}
                    placeholder="https://..."
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    multiline
                  />
                )}
              </View>

              <View style={styles.photoActions}>
                <TouchableOpacity onPress={() => moveUp(i)} style={styles.actionBtn} disabled={i === 0}>
                  <Ionicons name="chevron-up" size={18} color={i === 0 ? colors.border : colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => moveDown(i)} style={styles.actionBtn} disabled={i === photos.length - 1}>
                  <Ionicons name="chevron-down" size={18} color={i === photos.length - 1 ? colors.border : colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removePhoto(i)} style={styles.actionBtn}>
                  <Ionicons name="trash-outline" size={18} color={colors.booked} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* Add new URL */}
        <View style={styles.addSection}>
          <Text style={styles.addLabel}>새 사진 추가 (URL)</Text>
          <View style={styles.addRow}>
            <TextInput
              style={styles.addInput}
              value={newUrl}
              onChangeText={setNewUrl}
              placeholder="https://images.unsplash.com/..."
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={addPhoto}
            />
            <TouchableOpacity style={styles.addBtn} onPress={addPhoto}>
              <Ionicons name="add" size={22} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={save}>
          <Ionicons name="checkmark-circle" size={20} color={colors.white} />
          <Text style={styles.saveButtonText}>변경사항 저장</Text>
        </TouchableOpacity>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </KeyboardAvoidingView>
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
  hint: { ...typography.bodySmall, color: colors.textMuted, marginBottom: spacing.md },

  photoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
  },
  photoContent: { flex: 1, justifyContent: 'center' },
  photoIndex: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 4,
    fontWeight: '600',
  },
  localBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.olive + '18',
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  localText: {
    fontSize: 12,
    color: colors.olive,
    fontWeight: '600',
  },
  urlInput: {
    fontSize: 12,
    color: colors.textSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    backgroundColor: colors.background,
    minHeight: 40,
  },
  photoActions: {
    gap: 2,
  },
  actionBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },

  addSection: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  addLabel: {
    ...typography.label,
    color: colors.textSecondary,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  addRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  addInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.olive,
    alignItems: 'center',
    justifyContent: 'center',
  },

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
