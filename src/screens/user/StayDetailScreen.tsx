import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, Image,
  TouchableOpacity, StyleSheet, Dimensions, Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { EmojiIcon as Ionicons } from '../../components/EmojiIcon';
import { getAccommodation } from '../../data/store';
import { syncAccommodation } from '../../data/supabaseStore';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { RootStackParamList } from '../../types';
import { openKakaoChat, openWhatsApp } from '../../utils/kakao';
import { imageSource } from '../../utils/imageSource';
import { useLanguage } from '../../context/LanguageContext';
import { accTranslations } from '../../i18n/translations';
import { AIRBNB_URL } from '../../config/constants';

type Nav = StackNavigationProp<RootStackParamList>;

const width = Math.min(Dimensions.get('window').width, 430);

export function StayDetailScreen() {
  const navigation = useNavigation<Nav>();
  const [acc, setAcc]           = useState(getAccommodation());
  const [photoIndex, setPhotoIndex] = useState(0);
  const { t, lang } = useLanguage();
  const accT = accTranslations[lang];

  useFocusEffect(useCallback(() => {
    syncAccommodation().then(setAcc).catch(() => setAcc(getAccommodation()));
    setPhotoIndex(0);
  }, []));

  const openAirbnb = () => {
    if (AIRBNB_URL) Linking.openURL(AIRBNB_URL);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

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
          <Text style={styles.name}>{accT.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color={colors.terracotta} />
            <Text style={styles.location}>{acc.location}</Text>
          </View>

          {/* Specs */}
          <View style={styles.specs}>
            {[
              { icon: 'people-outline',  label: t.detail.guests(acc.maxGuests) },
              { icon: 'bed-outline',     label: t.detail.bedrooms(acc.bedrooms) },
              { icon: 'water-outline',   label: t.detail.bathrooms(acc.bathrooms) },
            ].map(s => (
              <View key={s.label} style={styles.spec}>
                <Ionicons name={s.icon as any} size={18} color={colors.olive} />
                <Text style={styles.specText}>{s.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionLabel}>{t.detail.about}</Text>
          <Text style={styles.description}>{accT.desc}</Text>

          <View style={styles.divider} />

          {/* Amenities */}
          <Text style={styles.sectionLabel}>{t.detail.amenities}</Text>
          <View style={styles.amenities}>
            {acc.amenities.map(a => (
              <View key={a} style={styles.amenityChip}>
                <Ionicons name="checkmark-circle" size={13} color={colors.olive} />
                <Text style={styles.amenityText}>{t.amenities[a] ?? a}</Text>
              </View>
            ))}
          </View>

          {/* Calendar button */}
          <TouchableOpacity
            style={styles.calendarBtn}
            onPress={() => navigation.navigate('CalendarView')}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.terracotta} />
            <Text style={styles.calendarBtnText}>{t.detail.calendarBtn}</Text>
            <Ionicons name="chevron-forward" size={17} color={colors.terracotta} />
          </TouchableOpacity>
        </View>

        {/* ── 5-B: Story ── */}
        <View style={styles.storySection}>
          <Text style={styles.storySectionTitle}>{t.detail.storyTitle}</Text>
          <Text style={styles.storySectionBody}>{t.detail.storyBody}</Text>
        </View>

        {/* ── 5-C: Books & Art ── */}
        <View style={styles.featureSection}>
          <Text style={styles.featureTitle}>{t.detail.booksArtTitle}</Text>
          <Text style={styles.featureBody}>{t.detail.booksArtBody}</Text>
          <View style={styles.quoteBox}>
            <Text style={styles.quoteText}>{t.detail.booksArtQuote}</Text>
          </View>
        </View>

        {/* ── 5-D: For Mom ── */}
        <View style={[styles.featureSection, styles.featureSectionAlt]}>
          <Text style={styles.featureTitle}>{t.detail.forMomTitle}</Text>
          <Text style={styles.featureBody}>{t.detail.forMomBody}</Text>
          <View style={[styles.quoteBox, styles.quoteBoxAlt]}>
            <Text style={styles.quoteText}>{t.detail.forMomQuote}</Text>
          </View>
        </View>

        {/* ── 5-E: Sanur Life ── */}
        <View style={styles.featureSection}>
          <Text style={styles.featureTitle}>{t.detail.sanurLifeTitle}</Text>
          <Text style={styles.featureBody}>{t.detail.sanurLifeBody}</Text>
          <View style={styles.noteBox}>
            <Ionicons name="information-circle-outline" size={15} color={colors.textMuted} />
            <Text style={styles.noteText}>{t.detail.sanurLifeNote}</Text>
          </View>
        </View>

        {/* ── 5-F: Tropical Living ── */}
        <View style={[styles.featureSection, styles.featureSectionAlt]}>
          <Text style={styles.featureTitle}>{t.detail.tropicalTitle}</Text>
          <Text style={styles.featureBody}>{t.detail.tropicalBody}</Text>
          <View style={[styles.quoteBox, styles.quoteBoxSubtle]}>
            <Text style={styles.quoteText}>{t.detail.tropicalQuote}</Text>
          </View>
        </View>

        {/* ── 5-G: Final CTA + Airbnb ── */}
        <View style={styles.finalCta}>
          <Text style={styles.finalCtaTitle}>{t.detail.finalCtaTitle}</Text>
          <Text style={styles.finalCtaBody}>{t.detail.finalCtaBody}</Text>

          {AIRBNB_URL ? (
            <TouchableOpacity style={styles.airbnbBtn} onPress={openAirbnb}>
              <Text style={styles.airbnbBtnText}>{t.detail.airbnbBtn}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.airbnbBtnDisabled}>
              <Text style={styles.airbnbBtnDisabledText}>{t.detail.airbnbComingSoon}</Text>
            </View>
          )}

          <Text style={styles.airbnbNote}>{t.detail.airbnbNote}</Text>
        </View>

        <View style={{ height: 240 }} />
      </ScrollView>

      {/* ── Sticky contact bar ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.kakaoBtn} onPress={openKakaoChat}>
          <Ionicons name="chatbubble-ellipses" size={20} color="#3A1D1D" />
          <Text style={styles.kakaoBtnText}>{t.detail.kakaoBtn}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsApp}>
          <Text style={styles.whatsappBtnText}>{t.detail.whatsappBtn}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  scroll: { flex: 1 },

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

  // 5-B Story
  storySection: {
    backgroundColor: colors.creamDark,
    marginHorizontal: spacing.md, marginBottom: spacing.md,
    borderRadius: radius.xl, padding: spacing.xl,
  },
  storySectionTitle: { fontSize: 20, fontWeight: '800', color: colors.text, lineHeight: 28, marginBottom: spacing.md },
  storySectionBody: { ...typography.body, color: colors.textSecondary, lineHeight: 26 },

  // 5-C/D/E/F Feature sections
  featureSection: {
    paddingHorizontal: spacing.xl, paddingVertical: spacing.xl,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  featureSectionAlt: {
    backgroundColor: colors.card,
  },
  featureTitle: { fontSize: 18, fontWeight: '800', color: colors.text, lineHeight: 26, marginBottom: spacing.md },
  featureBody: { ...typography.body, color: colors.textSecondary, lineHeight: 24, marginBottom: spacing.md },

  quoteBox: {
    backgroundColor: colors.terracotta + '14',
    borderLeftWidth: 3, borderLeftColor: colors.terracotta,
    borderRadius: radius.sm, padding: spacing.md, marginTop: spacing.sm,
  },
  quoteBoxAlt: {
    backgroundColor: colors.olive + '14',
    borderLeftColor: colors.olive,
  },
  quoteBoxSubtle: {
    backgroundColor: colors.border,
    borderLeftColor: colors.textMuted,
  },
  quoteText: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 22, fontStyle: 'italic' },

  noteBox: {
    flexDirection: 'row', gap: spacing.xs, alignItems: 'flex-start',
    backgroundColor: colors.creamDark, borderRadius: radius.sm,
    padding: spacing.sm, marginTop: spacing.sm,
  },
  noteText: { flex: 1, fontSize: 12, color: colors.textMuted, lineHeight: 18 },

  // 5-G Final CTA
  finalCta: {
    margin: spacing.md, backgroundColor: colors.terracotta,
    borderRadius: radius.xl, padding: spacing.xl, alignItems: 'center',
  },
  finalCtaTitle: { fontSize: 20, fontWeight: '800', color: colors.white, lineHeight: 28, textAlign: 'center', marginBottom: spacing.sm },
  finalCtaBody: { fontSize: 14, color: 'rgba(255,255,255,0.88)', lineHeight: 22, textAlign: 'center', marginBottom: spacing.xl },
  airbnbBtn: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xl, paddingVertical: 14,
    borderRadius: radius.full, marginBottom: spacing.sm,
  },
  airbnbBtnText: { color: colors.terracotta, fontWeight: '800', fontSize: 15 },
  airbnbBtnDisabled: {
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: spacing.xl, paddingVertical: 12,
    borderRadius: radius.full, marginBottom: spacing.sm,
  },
  airbnbBtnDisabledText: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
  airbnbNote: { fontSize: 11, color: 'rgba(255,255,255,0.65)', textAlign: 'center' },

  // Bottom bar
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: 28,
    borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.sm,
  },
  kakaoBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FEE500', paddingVertical: 13, borderRadius: radius.full, gap: spacing.sm,
  },
  kakaoBtnText: { color: '#3A1D1D', fontWeight: '700', fontSize: 15 },
  whatsappBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#25D366', paddingVertical: 13, borderRadius: radius.full,
  },
  whatsappBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
