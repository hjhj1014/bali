import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TextInput,
  TouchableOpacity, StyleSheet, Image,
  Linking, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { EmojiIcon as Ionicons } from '../../components/EmojiIcon';
import { getGuide } from '../../data/store';
import { GuideItem } from '../../types';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';

function extractMinutes(dist: string): number {
  const match = dist.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

export function GuideScreen() {
  const [allItems, setAllItems]       = useState<GuideItem[]>([]);
  const [query, setQuery]             = useState('');
  const [selectedCat, setSelectedCat] = useState('전체');
  const { t } = useLanguage();

  useFocusEffect(useCallback(() => {
    setAllItems(getGuide().filter(item => item.visible));
  }, []));

  const categories = ['전체', ...Array.from(new Set(allItems.map(i => i.category)))];

  const catLabel = (cat: string) =>
    cat === '전체' ? t.guide.allCategory : (t.guide.categoryNames[cat] ?? cat);

  const q = query.trim().toLowerCase();
  const filtered = allItems.filter(item => {
    const matchesCat = selectedCat === '전체' || item.category === selectedCat;
    if (!matchesCat) return false;
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.shortDescription.toLowerCase().includes(q) ||
      item.note.toLowerCase().includes(q)
    );
  });

  return (
    <View style={styles.container}>
      {/* ── Fixed top section ── */}
      <View style={styles.topSection}>
        <View style={styles.header}>
          <Text style={styles.title}>{t.guide.title}</Text>
          <Text style={styles.subtitle}>{t.guide.subtitle}</Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder={t.guide.searchPlaceholder}
            placeholderTextColor={colors.textMuted}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipContent}
        >
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, selectedCat === cat && styles.chipActive]}
              onPress={() => setSelectedCat(cat)}
            >
              <Text style={[styles.chipText, selectedCat === cat && styles.chipTextActive]}>
                {catLabel(cat)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Scrollable cards ── */}
      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={44} color={colors.border} />
            <Text style={styles.emptyText}>{t.guide.empty}</Text>
            {q.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
                <Text style={styles.clearBtnText}>{t.guide.clearSearch}</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filtered.map(item => (
            <GuideCard
              key={item.id}
              item={item}
              desc={t.guide.itemDescs[item.id] ?? item.shortDescription}
              distance={t.guide.bikeMin(extractMinutes(item.distanceFromHouse))}
              mapsBtn={t.guide.mapsBtn}
              blogBtn={t.guide.blogBtn}
            />
          ))
        )}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

// ─── Guide Card ──────────────────────────────────────────────────────────────

function GuideCard({
  item, desc, distance, mapsBtn, blogBtn,
}: {
  item: GuideItem;
  desc: string;
  distance: string;
  mapsBtn: string;
  blogBtn: string;
}) {
  const openMaps = () =>
    Linking.openURL(item.googleMapsUrl).catch(() =>
      Alert.alert('오류', '구글 지도를 열 수 없습니다.')
    );

  const openBlog = () =>
    item.blogUrl &&
    Linking.openURL(item.blogUrl).catch(() =>
      Alert.alert('오류', '블로그를 열 수 없습니다.')
    );

  const hasBlog = !!item.blogUrl;

  return (
    <View style={styles.card}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} resizeMode="cover" />
      ) : (
        <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
          <Ionicons name="map-outline" size={32} color={colors.border} />
        </View>
      )}

      <View style={styles.catBadge}>
        <Text style={styles.catBadgeText}>{item.category}</Text>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardDesc}>{desc}</Text>

        {!!item.distanceFromHouse && (
          <View style={styles.distanceRow}>
            <Text style={styles.distanceText}>🏍️ {distance}</Text>
          </View>
        )}

        {!!item.note && (
          <Text style={styles.noteText}>💡 {item.note}</Text>
        )}
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.mapsBtn, !hasBlog && styles.mapsBtnFull]}
          onPress={openMaps}
          activeOpacity={0.85}
        >
          <Ionicons name="map-outline" size={15} color={colors.white} />
          <Text style={styles.mapsBtnText}>{mapsBtn}</Text>
        </TouchableOpacity>

        {hasBlog && (
          <TouchableOpacity style={styles.blogBtn} onPress={openBlog} activeOpacity={0.85}>
            <Ionicons name="reader-outline" size={15} color={colors.terracotta} />
            <Text style={styles.blogBtnText}>{blogBtn}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  topSection: {
    backgroundColor: colors.background,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    paddingRight: 110,
  },
  title: { ...typography.h1 },
  subtitle: { ...typography.bodySmall, marginTop: 2 },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: spacing.md, marginBottom: spacing.sm,
    backgroundColor: colors.card, borderRadius: radius.full,
    borderWidth: 1.5, borderColor: colors.border,
    paddingHorizontal: spacing.md, height: 44, gap: spacing.sm,
  },
  searchIcon: { flexShrink: 0 },
  searchInput: { flex: 1, fontSize: 15, color: colors.text, height: '100%' },

  chipScroll: { flexGrow: 0 },
  chipContent: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingBottom: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md, paddingVertical: 7,
    borderRadius: radius.full, borderWidth: 1.5,
    borderColor: colors.border, backgroundColor: colors.card,
  },
  chipActive: { backgroundColor: colors.terracotta, borderColor: colors.terracotta },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  chipTextActive: { color: colors.white },

  list: { flex: 1 },
  listContent: { padding: spacing.md, paddingTop: spacing.md, gap: spacing.md },

  emptyState: { alignItems: 'center', paddingTop: 60, gap: spacing.sm },
  emptyText: { ...typography.body, color: colors.textMuted },
  clearBtn: {
    marginTop: spacing.xs, paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm, borderRadius: radius.full, backgroundColor: colors.creamDark,
  },
  clearBtnText: { fontSize: 13, fontWeight: '600', color: colors.terracotta },

  card: {
    backgroundColor: colors.card, borderRadius: radius.lg,
    overflow: 'hidden', borderWidth: 1, borderColor: colors.border,
    shadowColor: '#3D2B1F', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  cardImage: { width: '100%', height: 170 },
  cardImagePlaceholder: {
    backgroundColor: colors.creamDark, alignItems: 'center', justifyContent: 'center',
  },
  catBadge: {
    position: 'absolute', top: spacing.sm, left: spacing.sm,
    backgroundColor: 'rgba(61,43,31,0.78)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full,
  },
  catBadgeText: { color: colors.white, fontSize: 11, fontWeight: '700' },
  cardBody: { padding: spacing.md, gap: 6 },
  cardName: { ...typography.h3, fontSize: 16 },
  cardDesc: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20 },
  distanceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  distanceText: { fontSize: 12, fontWeight: '600', color: colors.terracotta },
  noteText: { fontSize: 12, color: colors.textMuted, lineHeight: 18, marginTop: 2 },

  cardActions: {
    flexDirection: 'row', gap: spacing.sm,
    paddingHorizontal: spacing.md, paddingBottom: spacing.md, paddingTop: spacing.xs,
  },
  mapsBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, backgroundColor: colors.terracotta, paddingVertical: 11, borderRadius: radius.md,
  },
  mapsBtnFull: {},
  mapsBtnText: { color: colors.white, fontWeight: '700', fontSize: 13 },
  blogBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, borderWidth: 1.5, borderColor: colors.terracotta,
    paddingVertical: 11, borderRadius: radius.md, backgroundColor: colors.card,
  },
  blogBtnText: { color: colors.terracotta, fontWeight: '700', fontSize: 13 },
});
