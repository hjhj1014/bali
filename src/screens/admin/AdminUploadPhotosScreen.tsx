import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { EmojiIcon as Ionicons } from '../../components/EmojiIcon';
import {
  getAdminPhotos,
  addAdminPhoto,
  removeAdminPhoto,
  reorderAdminPhotos,
} from '../../data/store';
import { colors, spacing, radius, typography } from '../../constants/theme';

const COLS = 2;
const WIN_W = Math.min(Dimensions.get('window').width, 430);
const PHOTO_SIZE = Math.floor((WIN_W - spacing.md * 2 - spacing.sm) / COLS);

// ─── 이미지 압축 (웹 전용) ──────────────────────────────────────────────────
// 최대 1200px, JPEG 75% 품질로 압축 → 사진 한 장 약 100~300KB
// localStorage 총 용량이 ~5MB이므로 15~50장 저장 가능
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (ev) => {
      const img = new (window as any).Image() as HTMLImageElement;
      img.onerror = reject;
      img.onload = () => {
        const MAX = 1200;
        let w = img.width;
        let h = img.height;
        if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
        if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas context unavailable')); return; }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function AdminUploadPhotosScreen() {
  const navigation = useNavigation();
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // 화면이 포커스될 때마다 localStorage에서 최신 목록을 불러옴
  useFocusEffect(useCallback(() => {
    setPhotos(getAdminPhotos());
  }, []));

  const refresh = () => setPhotos(getAdminPhotos());

  // ─── 파일 선택 & 업로드 ─────────────────────────────────────────────────
  // 브라우저 파일 선택 다이얼로그를 프로그래밍 방식으로 열기
  // (React Native Web에서는 <input type="file"> DOM 요소를 직접 생성)
  const pickAndUpload = () => {
    if (Platform.OS !== 'web') {
      Alert.alert('안내', '사진 업로드는 웹 브라우저에서만 지원됩니다.');
      return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = async (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || files.length === 0) return;
      setUploading(true);
      try {
        for (const file of Array.from(files)) {
          const dataUrl = await compressImage(file);
          addAdminPhoto(dataUrl);
        }
        refresh();
      } catch {
        Alert.alert(
          '업로드 실패',
          '사진 저장 중 오류가 발생했습니다.\n저장 공간(localStorage 5MB)이 부족할 수 있습니다.\n일부 사진을 삭제한 뒤 다시 시도해 주세요.'
        );
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  // ─── 사진 삭제 ──────────────────────────────────────────────────────────
  const handleDelete = (index: number) => {
    Alert.alert('사진 삭제', '이 사진을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => { removeAdminPhoto(index); refresh(); },
      },
    ]);
  };

  // ─── 대표 사진 설정 (첫 번째로 이동) ────────────────────────────────────
  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const updated = [...photos];
    const [item] = updated.splice(index, 1);
    updated.unshift(item);
    reorderAdminPhotos(updated);
    refresh();
  };

  // ─── 전체 삭제 (기본 사진으로 복원) ────────────────────────────────────
  const handleClearAll = () => {
    Alert.alert(
      '전체 삭제',
      '업로드한 모든 사진을 삭제하시겠습니까?\n삭제 후에는 기본 사진이 손님 화면에 표시됩니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '전체 삭제',
          style: 'destructive',
          onPress: () => { reorderAdminPhotos([]); refresh(); },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* ── 헤더 ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>사진 업로드</Text>
          <Text style={styles.headerSub}>
            {photos.length > 0 ? `${photos.length}장 등록됨` : '사진 없음'}
          </Text>
        </View>
        {photos.length > 0 ? (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>전체삭제</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* ── 업로드 버튼 ── */}
        <TouchableOpacity
          style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
          onPress={pickAndUpload}
          disabled={uploading}
          activeOpacity={0.85}
        >
          {uploading ? (
            <ActivityIndicator color={colors.white} size="large" />
          ) : (
            <Text style={styles.uploadIcon}>📷</Text>
          )}
          <Text style={styles.uploadButtonText}>
            {uploading ? '업로드 중...' : '사진 선택하기'}
          </Text>
          {!uploading && (
            <Text style={styles.uploadHint}>여러 장 동시 선택 가능 · 자동 압축 저장</Text>
          )}
        </TouchableOpacity>

        {/* ── 저장 방식 안내 ── */}
        {/*
          ⚠️ localStorage 방식 안내
          - 현재: 이 브라우저(기기)에서만 사진이 보임
          - 개선: Supabase Storage 연동 시 모든 기기에 즉시 반영 가능
        */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>⚠️ 저장 방식 안내</Text>
          <Text style={styles.infoText}>
            {'현재 사진은 이 브라우저(기기)에만 저장됩니다.\n'}
            {'손님들 폰에도 바로 보이게 하려면\nSupabase Storage 연동이 필요합니다.'}
          </Text>
        </View>

        {/* ── 사진이 없을 때 ── */}
        {photos.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🖼️</Text>
            <Text style={styles.emptyTitle}>업로드한 사진이 없습니다</Text>
            <Text style={styles.emptyHint}>
              {'사진을 올리면 손님 화면 숙소 갤러리에\n바로 반영됩니다'}
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.gridLabel}>업로드한 사진 ({photos.length}장)</Text>
            <Text style={styles.gridHint}>⭐ 첫 번째 사진이 대표 이미지입니다</Text>

            {/* ── 사진 그리드 ── */}
            <View style={styles.grid}>
              {photos.map((photo, i) => (
                <View key={i} style={[styles.photoCard, i === 0 && styles.photoCardCover]}>
                  <Image
                    source={{ uri: photo }}
                    style={styles.photo}
                    resizeMode="cover"
                  />
                  {/* 대표 사진 배지 */}
                  {i === 0 && (
                    <View style={styles.coverBadge}>
                      <Text style={styles.coverBadgeText}>⭐ 대표</Text>
                    </View>
                  )}
                  {/* 액션 버튼 */}
                  <View style={styles.photoActions}>
                    {i !== 0 && (
                      <TouchableOpacity
                        style={styles.actionBtnCover}
                        onPress={() => handleSetCover(i)}
                      >
                        <Text style={styles.actionBtnCoverText}>⭐ 대표로</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.actionBtnDelete}
                      onPress={() => handleDelete(i)}
                    >
                      <Text style={styles.actionBtnDeleteText}>🗑️ 삭제</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
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
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { ...typography.h3, fontSize: 16 },
  headerSub: { ...typography.caption, color: colors.terracotta, marginTop: 1 },
  clearBtn: { paddingHorizontal: spacing.sm, paddingVertical: 4 },
  clearBtnText: { fontSize: 12, color: colors.booked, fontWeight: '700' },

  content: { padding: spacing.md },

  uploadButton: {
    backgroundColor: colors.terracotta,
    borderRadius: radius.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadButtonDisabled: { opacity: 0.7 },
  uploadIcon: { fontSize: 40 },
  uploadButtonText: { color: colors.white, fontWeight: '700', fontSize: 18 },
  uploadHint: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },

  infoBox: {
    backgroundColor: '#FFFBEA',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#F0C300',
    marginBottom: spacing.lg,
  },
  infoTitle: { fontSize: 13, fontWeight: '700', color: '#7A5F00', marginBottom: 4 },
  infoText: { fontSize: 12, color: '#7A5F00', lineHeight: 19 },

  empty: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyIcon: { fontSize: 56, marginBottom: spacing.md },
  emptyTitle: { ...typography.body, fontWeight: '700', color: colors.textSecondary },
  emptyHint: {
    ...typography.bodySmall,
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },

  gridLabel: { ...typography.label, marginBottom: 4 },
  gridHint: { ...typography.caption, color: colors.terracotta, marginBottom: spacing.md },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  photoCard: {
    width: PHOTO_SIZE,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoCardCover: {
    borderWidth: 2,
    borderColor: colors.terracotta,
  },
  photo: {
    width: '100%',
    height: PHOTO_SIZE,
  },
  coverBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  coverBadgeText: { color: colors.white, fontSize: 11, fontWeight: '700' },

  photoActions: {
    flexDirection: 'row',
    gap: 4,
    padding: 6,
    backgroundColor: colors.card,
  },
  actionBtnCover: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: colors.olive + '20',
    borderRadius: radius.sm,
  },
  actionBtnCoverText: { fontSize: 11, color: colors.olive, fontWeight: '700' },
  actionBtnDelete: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: colors.booked + '15',
    borderRadius: radius.sm,
  },
  actionBtnDeleteText: { fontSize: 11, color: colors.booked, fontWeight: '700' },
});
