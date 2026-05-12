import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, Image,
  TouchableOpacity, StyleSheet,
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

const HERO = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200';

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [acc, setAcc] = useState(getAccommodation());

  useFocusEffect(useCallback(() => { setAcc(getAccommodation()); }, []));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* ── Hero ── */}
      <View style={styles.hero}>
        <Image source={acc.photos[0] != null ? imageSource(acc.photos[0]) : { uri: HERO }} style={styles.heroImage} resizeMode="cover" />
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroEyebrow}>🌴 Bali Mom & Kid Stay</Text>
          <Text style={styles.heroTagline}>엄마와 아이의 발리 한달살기</Text>
          <Text style={styles.heroTitle}>{acc.name}</Text>
          <Text style={styles.heroLocation}>
            <Ionicons name="location" size={13} color="rgba(255,255,255,0.85)" /> {acc.location}
          </Text>
          <TouchableOpacity style={styles.heroBtn} onPress={() => navigation.navigate('StayDetail')}>
            <Text style={styles.heroBtnText}>숙소 자세히 보기</Text>
            <Ionicons name="arrow-forward" size={15} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Quick facts ── */}
      <View style={styles.factsCard}>
        {[
          { icon: 'people-outline',  label: `최대 ${acc.maxGuests}명` },
          { icon: 'bed-outline',     label: `침실 ${acc.bedrooms}개` },
          { icon: 'water-outline',   label: `욕실 ${acc.bathrooms}개` },
          { icon: 'wifi-outline',    label: '와이파이' },
        ].map(f => (
          <View key={f.label} style={styles.fact}>
            <Ionicons name={f.icon as any} size={20} color={colors.olive} />
            <Text style={styles.factText}>{f.label}</Text>
          </View>
        ))}
      </View>

      {/* ── Short description ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>숙소 소개</Text>
        <Text style={styles.bodyText}>{acc.shortDescription}</Text>
      </View>

      {/* ── Photo strip ── */}
      {acc.photos.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photoStrip}
        >
          {acc.photos.slice(1).map((uri, i) => (
            <TouchableOpacity key={i} onPress={() => navigation.navigate('StayDetail')}>
              <Image source={imageSource(uri)} style={styles.stripPhoto} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* ── Calendar CTA ── */}
      <TouchableOpacity style={styles.calendarCta} onPress={() => navigation.navigate('CalendarView')}>
        <Ionicons name="calendar-outline" size={22} color={colors.terracotta} />
        <View style={{ flex: 1 }}>
          <Text style={styles.ctaTitle}>예약 가능 날짜 확인</Text>
          <Text style={styles.ctaSub}>달력에서 날짜별 예약 상황을 확인하세요</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.terracotta} />
      </TouchableOpacity>

      {/* ── KakaoTalk CTA ── */}
      <View style={styles.kakaoBanner}>
        <Ionicons name="chatbubble-ellipses" size={26} color="#3A1D1D" />
        <Text style={styles.kakaoTitle}>예약 문의는 카카오톡으로</Text>
        <Text style={styles.kakaoSub}>빠르고 편하게 상담드립니다 😊</Text>
        <TouchableOpacity style={styles.kakaoBtn} onPress={openKakaoChat}>
          <Text style={styles.kakaoBtnText}>카카오톡 상담하기</Text>
        </TouchableOpacity>
      </View>

      {/* ── Admin access ── */}
      <TouchableOpacity
        style={styles.adminBtn}
        onPress={() => navigation.navigate('AdminLogin')}
      >
        <Ionicons name="settings-outline" size={13} color={colors.textMuted} />
        <Text style={styles.adminBtnText}>관리자</Text>
      </TouchableOpacity>

      <View style={{ height: spacing.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  hero: { height: 420, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(20,10,0,0.45)' },
  heroContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.xl },
  heroEyebrow: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '700', marginBottom: 4 },
  heroTagline: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '400', marginBottom: 8 },
  heroTitle: { color: colors.white, fontSize: 28, fontWeight: '800', marginBottom: 4 },
  heroLocation: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: spacing.lg },
  heroBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.terracotta, alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg, paddingVertical: 12,
    borderRadius: radius.full,
  },
  heroBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },

  factsCard: {
    flexDirection: 'row', justifyContent: 'space-around',
    margin: spacing.md, backgroundColor: colors.card,
    borderRadius: radius.lg, paddingVertical: spacing.lg,
    borderWidth: 1, borderColor: colors.border,
  },
  fact: { alignItems: 'center', gap: 6 },
  factText: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },

  section: { paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  sectionTitle: { ...typography.h3, marginBottom: spacing.sm },
  bodyText: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },

  photoStrip: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingBottom: spacing.md },
  stripPhoto: { width: 160, height: 110, borderRadius: radius.md },

  calendarCta: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    margin: spacing.md, padding: spacing.md,
    backgroundColor: colors.card, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: colors.terracotta,
  },
  ctaTitle: { ...typography.body, fontWeight: '700', color: colors.terracotta },
  ctaSub: { ...typography.bodySmall, marginTop: 2 },

  kakaoBanner: {
    margin: spacing.md, backgroundColor: '#FEE500',
    borderRadius: radius.xl, padding: spacing.xl, alignItems: 'center',
  },
  kakaoTitle: { fontSize: 17, fontWeight: '700', color: '#3A1D1D', marginTop: 8, marginBottom: 4 },
  kakaoSub: { fontSize: 13, color: '#5A3D3D', marginBottom: spacing.lg },
  kakaoBtn: {
    backgroundColor: 'rgba(0,0,0,0.12)', paddingHorizontal: spacing.xl,
    paddingVertical: 12, borderRadius: radius.full,
  },
  kakaoBtnText: { color: '#3A1D1D', fontWeight: '700', fontSize: 15 },
  adminBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, alignSelf: 'center', marginTop: spacing.lg,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
  },
  adminBtnText: { fontSize: 11, color: colors.textMuted },
});
