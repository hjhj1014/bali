import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, Image,
  TouchableOpacity, StyleSheet, Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { EmojiIcon as Ionicons } from '../../components/EmojiIcon';
import { getAccommodation } from '../../data/store';
import { syncAccommodation } from '../../data/supabaseStore';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { RootStackParamList } from '../../types';
import { imageSource } from '../../utils/imageSource';
import { useLanguage } from '../../context/LanguageContext';
import { accTranslations } from '../../i18n/translations';
import { AIRBNB_URL } from '../../config/constants';

type Nav = StackNavigationProp<RootStackParamList>;

const HERO = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200';

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [acc, setAcc] = useState(getAccommodation());
  const { t, lang } = useLanguage();
  const accT = accTranslations[lang];

  useFocusEffect(useCallback(() => {
    syncAccommodation().then(setAcc).catch(() => setAcc(getAccommodation()));
  }, []));

  const openAirbnb = () => {
    if (AIRBNB_URL) Linking.openURL(AIRBNB_URL);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* ── Hero ── */}
      <View style={styles.hero}>
        <Image
          source={acc.photos[0] != null ? imageSource(acc.photos[0]) : { uri: HERO }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroEyebrow}>🌴 Sanur, Bali</Text>
          <Text style={styles.heroTagline}>{t.home.tagline}</Text>
          <Text style={styles.heroTitle}>{accT.name}</Text>
          <View style={styles.heroButtons}>
            <TouchableOpacity style={styles.heroBtn} onPress={() => navigation.navigate('StayDetail')}>
              <Text style={styles.heroBtnText}>{t.home.viewDetail}</Text>
              <Ionicons name="arrow-forward" size={15} color={colors.white} />
            </TouchableOpacity>
            {AIRBNB_URL ? (
              <TouchableOpacity style={styles.heroBtnAirbnb} onPress={openAirbnb}>
                <Text style={styles.heroBtnAirbnbText}>{t.home.airbnbBtn}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.heroBtnAirbnbDisabled}>
                <Text style={styles.heroBtnAirbnbDisabledText}>{t.home.airbnbComingSoon}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* ── 안내 문구 배너 ── */}
      {!!acc.notice && (
        <View style={styles.noticeBanner}>
          <Text style={styles.noticeText}>📢 {acc.notice}</Text>
        </View>
      )}

      {/* ── Quick facts ── */}
      <View style={styles.factsCard}>
        {[
          { icon: 'people-outline',  label: t.home.guests(acc.maxGuests) },
          { icon: 'bed-outline',     label: t.home.bedrooms(acc.bedrooms) },
          { icon: 'water-outline',   label: t.home.bathrooms(acc.bathrooms) },
          { icon: 'wifi-outline',    label: t.home.wifi },
        ].map(f => (
          <View key={f.label} style={styles.fact}>
            <Ionicons name={f.icon as any} size={20} color={colors.olive} />
            <Text style={styles.factText}>{f.label}</Text>
          </View>
        ))}
      </View>

      {/* ── Short description ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.home.aboutTitle}</Text>
        <Text style={styles.bodyText}>{accT.shortDesc}</Text>
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

      {/* ── Story section ── */}
      <View style={styles.storySection}>
        <Text style={styles.storyTitle}>{t.home.storyTitle}</Text>
        <Text style={styles.storyBody}>{t.home.storyBody}</Text>
        <TouchableOpacity style={styles.storyBtn} onPress={() => navigation.navigate('StayDetail')}>
          <Text style={styles.storyBtnText}>{t.home.storyBtn}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Calendar CTA ── */}
      <TouchableOpacity style={styles.calendarCta} onPress={() => navigation.navigate('CalendarView')}>
        <Ionicons name="calendar-outline" size={22} color={colors.terracotta} />
        <View style={{ flex: 1 }}>
          <Text style={styles.ctaTitle}>{t.home.calendarTitle}</Text>
          <Text style={styles.ctaSub}>{t.home.calendarSub}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.terracotta} />
      </TouchableOpacity>

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

  hero: { height: 460, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(20,10,0,0.50)' },
  heroContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.xl },
  heroEyebrow: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '700', marginBottom: 6 },
  heroTagline: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '400', lineHeight: 22, marginBottom: 12 },
  heroTitle: { color: colors.white, fontSize: 26, fontWeight: '800', marginBottom: spacing.md },
  heroButtons: { gap: spacing.sm },
  heroBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.terracotta, alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg, paddingVertical: 12,
    borderRadius: radius.full,
  },
  heroBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  heroBtnAirbnb: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg, paddingVertical: 12,
    borderRadius: radius.full,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.8)',
  },
  heroBtnAirbnbText: { color: colors.white, fontWeight: '600', fontSize: 13 },
  heroBtnAirbnbDisabled: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg, paddingVertical: 10,
    borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
  },
  heroBtnAirbnbDisabledText: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },

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

  storySection: {
    marginHorizontal: spacing.md, marginBottom: spacing.md,
    backgroundColor: colors.creamDark, borderRadius: radius.xl,
    padding: spacing.xl,
  },
  storyTitle: { fontSize: 18, fontWeight: '800', color: colors.text, lineHeight: 26, marginBottom: spacing.md },
  storyBody: { ...typography.body, color: colors.textSecondary, lineHeight: 24, marginBottom: spacing.lg },
  storyBtn: { alignSelf: 'flex-start' },
  storyBtnText: { color: colors.terracotta, fontWeight: '700', fontSize: 14 },

  calendarCta: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    margin: spacing.md, padding: spacing.md,
    backgroundColor: colors.card, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: colors.terracotta,
  },
  ctaTitle: { ...typography.body, fontWeight: '700', color: colors.terracotta },
  ctaSub: { ...typography.bodySmall, marginTop: 2 },

  noticeBanner: {
    margin: spacing.md, marginBottom: 0,
    backgroundColor: colors.terracotta + '18',
    borderRadius: radius.md, padding: spacing.md,
    borderLeftWidth: 3, borderLeftColor: colors.terracotta,
  },
  noticeText: { fontSize: 13, color: colors.terracotta, fontWeight: '600', lineHeight: 20 },

  adminBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, alignSelf: 'center', marginTop: spacing.lg,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
  },
  adminBtnText: { fontSize: 11, color: colors.textMuted },
});
