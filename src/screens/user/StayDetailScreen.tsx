import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, Image,
  TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { EmojiIcon as Ionicons } from '../../components/EmojiIcon';
import { getAccommodation } from '../../data/store';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { RootStackParamList } from '../../types';
import { openKakaoChat } from '../../utils/kakao';
import { imageSource } from '../../utils/imageSource';

type Nav = StackNavigationProp<RootStackParamList>;

const width = Math.min(Dimensions.get('window').width, 430);

export function StayDetailScreen() {
  const navigation = useNavigation<Nav>();
  const [acc, setAcc]           = useState(getAccommodation());
  const [photoIndex, setPhotoIndex] = useState(0);

  useFocusEffect(useCallback(() => {
    setAcc(getAccommodation());
    setPhotoIndex(0);
  }, []));

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Photo gallery ── */}
        <View>
          <Image
            source={imageSource(acc.photos[photoIndex])}
            style={styles.mainPhoto}
            resizeMode="cover"
          />
          {/* Back */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={colors.white} />
          </TouchableOpacity>
          {/* Counter */}
          <View style={styles.counter}>
            <Text style={styles.counterText}>{photoIndex + 1} / {acc.photos.length}</Text>
          </View>
          {/* Thumbnails */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbRow}
            contentContainerStyle={styles.thumbContent}
          >
            {acc.photos.map((uri, i) => (
              <TouchableOpacity key={i} onPress={() => setPhotoIndex(i)}>
                <Image
                  source={imageSource(uri)}
                  style={[styles.thumb, i === photoIndex && styles.thumbActive]}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Info ── */}
        <View style={styles.info}>
          <Text style={styles.name}>{acc.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color={colors.terracotta} />
            <Text style={styles.location}>{acc.location}</Text>
          </View>

          {/* Specs */}
          <View style={styles.specs}>
            {[
              { icon: 'people-outline',  label: `최대 ${acc.maxGuests}명` },
              { icon: 'bed-outline',     label: `침실 ${acc.bedrooms}개` },
              { icon: 'water-outline',   label: `욕실 ${acc.bathrooms}개` },
            ].map(s => (
              <View key={s.label} style={styles.spec}>
                <Ionicons name={s.icon as any} size={18} color={colors.olive} />
                <Text style={styles.specText}>{s.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionLabel}>숙소 소개</Text>
          <Text style={styles.description}>{acc.description}</Text>

          <View style={styles.divider} />

          {/* Amenities */}
          <Text style={styles.sectionLabel}>편의시설</Text>
          <View style={styles.amenities}>
            {acc.amenities.map(a => (
              <View key={a} style={styles.amenityChip}>
                <Ionicons name="checkmark-circle" size={13} color={colors.olive} />
                <Text style={styles.amenityText}>{a}</Text>
              </View>
            ))}
          </View>

          {/* Calendar button */}
          <TouchableOpacity
            style={styles.calendarBtn}
            onPress={() => navigation.navigate('CalendarView')}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.terracotta} />
            <Text style={styles.calendarBtnText}>예약 가능 달력 보기</Text>
            <Ionicons name="chevron-forward" size={17} color={colors.terracotta} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── KakaoTalk sticky bar ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.kakaoBtn} onPress={openKakaoChat}>
          <Ionicons name="chatbubble-ellipses" size={20} color="#3A1D1D" />
          <Text style={styles.kakaoBtnText}>카카오톡으로 예약 문의</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  mainPhoto: { width, height: 300 },
  backBtn: {
    position: 'absolute', top: 48, left: spacing.md,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center',
  },
  counter: {
    position: 'absolute', top: 56, right: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.full,
  },
  counterText: { color: colors.white, fontSize: 12, fontWeight: '600' },
  thumbRow: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.3)' },
  thumbContent: { paddingHorizontal: spacing.sm, paddingVertical: spacing.sm, gap: spacing.sm },
  thumb: { width: 54, height: 40, borderRadius: radius.sm, opacity: 0.7 },
  thumbActive: { opacity: 1, borderWidth: 2, borderColor: colors.white },

  info: { padding: spacing.md },
  name: { ...typography.h2, marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.md },
  location: { color: colors.terracotta, fontWeight: '600', fontSize: 14 },

  specs: {
    flexDirection: 'row', gap: spacing.xl,
    paddingVertical: spacing.md, justifyContent: 'center',
    backgroundColor: colors.creamDark, borderRadius: radius.md, marginBottom: spacing.md,
  },
  spec: { alignItems: 'center', gap: 4 },
  specText: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },

  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  sectionLabel: { ...typography.label, color: colors.textSecondary, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  description: { ...typography.body, color: colors.textSecondary, lineHeight: 24 },

  amenities: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  amenityChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.card, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    borderRadius: radius.full, borderWidth: 1, borderColor: colors.border,
  },
  amenityText: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },

  calendarBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginTop: spacing.lg, padding: spacing.md,
    backgroundColor: colors.card, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.terracotta,
  },
  calendarBtnText: { flex: 1, color: colors.terracotta, fontWeight: '700', fontSize: 15 },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md, paddingVertical: spacing.md, paddingBottom: 28,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  kakaoBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FEE500', paddingVertical: 14, borderRadius: radius.full, gap: spacing.sm,
  },
  kakaoBtnText: { color: '#3A1D1D', fontWeight: '700', fontSize: 16 },
});
