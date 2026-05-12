import React, { useCallback, useState } from 'react';
import {
  View, Text, Image, ScrollView,
  TouchableOpacity, StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { EmojiIcon as Ionicons } from '../../components/EmojiIcon';
import { getAccommodation } from '../../data/store';
import { imageSource } from '../../utils/imageSource';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { RootStackParamList } from '../../types';

type Nav = StackNavigationProp<RootStackParamList>;

export function StayListScreen() {
  const navigation = useNavigation<Nav>();
  const [acc, setAcc] = useState(getAccommodation());

  useFocusEffect(useCallback(() => { setAcc(getAccommodation()); }, []));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>발리 숙소</Text>
        <Text style={styles.subtitle}>아이와 함께 머무는 발리의 따뜻한 집</Text>
      </View>

      {/* ── Single accommodation card ── */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('StayDetail')}
        activeOpacity={0.93}
      >
        <Image source={imageSource(acc.photos[0])} style={styles.cardImage} resizeMode="cover" />

        {/* Tags */}
        <View style={styles.tagRow}>
          {acc.tags.slice(0, 2).map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.cardName}>{acc.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={13} color={colors.terracotta} />
            <Text style={styles.location}>{acc.location}</Text>
          </View>
          <Text style={styles.cardDesc} numberOfLines={2}>{acc.shortDescription}</Text>

          <View style={styles.cardFooter}>
            <View style={styles.specs}>
              <View style={styles.spec}>
                <Ionicons name="people-outline" size={13} color={colors.textMuted} />
                <Text style={styles.specText}>최대 {acc.maxGuests}명</Text>
              </View>
              <View style={styles.spec}>
                <Ionicons name="bed-outline" size={13} color={colors.textMuted} />
                <Text style={styles.specText}>{acc.bedrooms}침실</Text>
              </View>
            </View>
            <Text style={styles.priceLabel}>가격 문의</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* ── Calendar CTA ── */}
      <TouchableOpacity style={styles.calendarRow} onPress={() => navigation.navigate('CalendarView')}>
        <Ionicons name="calendar-outline" size={18} color={colors.terracotta} />
        <Text style={styles.calendarText}>예약 가능 달력 확인하기</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.terracotta} />
      </TouchableOpacity>

      <View style={{ height: spacing.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.sm },
  title: { ...typography.h1 },
  subtitle: { ...typography.bodySmall, marginTop: 2 },

  card: {
    marginHorizontal: spacing.md, marginTop: spacing.md,
    backgroundColor: colors.card, borderRadius: radius.lg,
    overflow: 'hidden',
    shadowColor: '#3D2B1F', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  cardImage: { width: '100%', height: 240 },
  tagRow: { position: 'absolute', top: spacing.md, left: spacing.md, flexDirection: 'row', gap: 6 },
  tag: { backgroundColor: 'rgba(61,43,31,0.72)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  tagText: { color: colors.white, fontSize: 11, fontWeight: '600' },

  cardBody: { padding: spacing.md },
  cardName: { ...typography.h2, marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: spacing.sm },
  location: { color: colors.terracotta, fontWeight: '600', fontSize: 13 },
  cardDesc: { ...typography.bodySmall, lineHeight: 20, marginBottom: spacing.sm },

  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  specs: { flexDirection: 'row', gap: spacing.md },
  spec: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  specText: { fontSize: 12, color: colors.textMuted },
  priceLabel: { color: colors.terracotta, fontWeight: '700', fontSize: 15 },

  calendarRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginHorizontal: spacing.md, marginTop: spacing.md,
    padding: spacing.md, backgroundColor: colors.card,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
  },
  calendarText: { flex: 1, color: colors.terracotta, fontWeight: '600', fontSize: 14 },
});
