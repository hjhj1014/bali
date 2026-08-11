import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { EmojiIcon as Ionicons } from '../../components/EmojiIcon';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { openKakaoChat, openWhatsApp } from '../../utils/kakao';
import { RootStackParamList } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { AIRBNB_URL } from '../../config/constants';

type Nav = StackNavigationProp<RootStackParamList>;

export function ContactScreen() {
  const navigation = useNavigation<Nav>();
  const { t } = useLanguage();

  const openAirbnb = () => {
    if (AIRBNB_URL) Linking.openURL(AIRBNB_URL);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t.contact.title}</Text>
        <Text style={styles.subtitle}>{t.contact.subtitle}</Text>
      </View>

      {/* ── Airbnb card (first) ── */}
      <View style={styles.airbnbCard}>
        <Text style={styles.airbnbCardTitle}>{t.contact.airbnbCardTitle}</Text>
        <Text style={styles.airbnbCardDesc}>{t.contact.airbnbCardDesc}</Text>
        {AIRBNB_URL ? (
          <TouchableOpacity style={styles.airbnbButton} onPress={openAirbnb}>
            <Text style={styles.airbnbButtonText}>{t.contact.airbnbCardBtn}</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.white} />
          </TouchableOpacity>
        ) : (
          <View style={styles.airbnbButtonDisabled}>
            <Text style={styles.airbnbButtonDisabledText}>{t.contact.airbnbComingSoon}</Text>
          </View>
        )}
      </View>

      {/* ── Questions section ── */}
      <View style={styles.chatSection}>
        <Text style={styles.chatTitle}>{t.contact.chatTitle}</Text>
        <Text style={styles.chatDesc}>{t.contact.chatDesc}</Text>
      </View>

      {/* KakaoTalk */}
      <View style={styles.mainCard}>
        <View style={styles.kakaoIconWrap}>
          <Ionicons name="chatbubble-ellipses" size={36} color="#3A1D1D" />
        </View>
        <Text style={styles.cardTitle}>{t.contact.kakaoCardTitle}</Text>
        <Text style={styles.cardDesc}>{t.contact.kakaoCardDesc}</Text>
        <TouchableOpacity style={styles.kakaoButton} onPress={openKakaoChat}>
          <Text style={styles.kakaoButtonText}>{t.contact.kakaoCardBtn}</Text>
          <Ionicons name="arrow-forward" size={18} color="#3A1D1D" />
        </TouchableOpacity>
        <View style={styles.kakaoIdRow}>
          <Text style={styles.kakaoIdLabel}>{t.contact.openchat}</Text>
          <Text style={styles.kakaoId}>open.kakao.com/o/sW9hPrui</Text>
        </View>
      </View>

      {/* WhatsApp */}
      <View style={styles.whatsappCard}>
        <Text style={styles.whatsappTitle}>{t.contact.whatsappCardTitle}</Text>
        <Text style={styles.whatsappDesc}>{t.contact.whatsappCardDesc}</Text>
        <TouchableOpacity style={styles.whatsappButton} onPress={openWhatsApp}>
          <Text style={styles.whatsappButtonText}>{t.contact.whatsappCardBtn}</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.whatsappNumber}>{t.contact.whatsappNumber}</Text>
      </View>

      {/* FAQ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.contact.faqTitle}</Text>
        {t.contact.faq.map((item, i) => (
          <FAQItem key={i} q={item.q} a={item.a} />
        ))}
      </View>

      {/* Hours */}
      <View style={styles.infoCard}>
        <Ionicons name="time-outline" size={20} color={colors.olive} />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>{t.contact.hoursTitle}</Text>
          <Text style={styles.infoText}>{t.contact.hoursText}</Text>
        </View>
      </View>

      {/* Admin access */}
      <TouchableOpacity
        style={styles.adminBtn}
        onPress={() => navigation.navigate('AdminLogin')}
      >
        <Ionicons name="settings-outline" size={14} color={colors.textMuted} />
        <Text style={styles.adminBtnText}>관리자</Text>
      </TouchableOpacity>

      <View style={{ height: spacing.xxl }} />
    </ScrollView>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <TouchableOpacity style={styles.faqItem} onPress={() => setOpen(!open)} activeOpacity={0.8}>
      <View style={styles.faqQuestion}>
        <Text style={styles.faqQ}>Q. {q}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textMuted} />
      </View>
      {open && <Text style={styles.faqA}>{a}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    paddingRight: 110,
  },
  title: { ...typography.h1 },
  subtitle: { ...typography.bodySmall, marginTop: 4 },

  // Airbnb card
  airbnbCard: {
    margin: spacing.md,
    backgroundColor: colors.terracotta,
    borderRadius: radius.xl, padding: spacing.xl, alignItems: 'center',
  },
  airbnbCardTitle: { fontSize: 18, fontWeight: '800', color: colors.white, marginBottom: spacing.sm, textAlign: 'center' },
  airbnbCardDesc: { fontSize: 14, color: 'rgba(255,255,255,0.88)', lineHeight: 22, textAlign: 'center', marginBottom: spacing.lg },
  airbnbButton: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
    borderRadius: radius.full, gap: spacing.sm,
  },
  airbnbButtonText: { color: colors.terracotta, fontWeight: '800', fontSize: 15 },
  airbnbButtonDisabled: {
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: spacing.xl, paddingVertical: 12,
    borderRadius: radius.full,
  },
  airbnbButtonDisabledText: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },

  // Questions section header
  chatSection: {
    paddingHorizontal: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.sm,
  },
  chatTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
  chatDesc: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },

  mainCard: {
    margin: spacing.md, backgroundColor: '#FEE500',
    borderRadius: radius.xl, padding: spacing.xl, alignItems: 'center',
  },
  kakaoIconWrap: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#3A1D1D', marginBottom: spacing.sm },
  cardDesc: { fontSize: 14, color: '#5A3D3D', lineHeight: 22, textAlign: 'center', marginBottom: spacing.lg },
  kakaoButton: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.12)',
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
    borderRadius: radius.full, gap: spacing.sm, marginBottom: spacing.md,
  },
  kakaoButtonText: { color: '#3A1D1D', fontWeight: '700', fontSize: 15 },
  kakaoIdRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  kakaoIdLabel: { fontSize: 12, color: '#5A3D3D' },
  kakaoId: { fontSize: 13, fontWeight: '700', color: '#3A1D1D' },

  whatsappCard: {
    margin: spacing.md, backgroundColor: '#25D366',
    borderRadius: radius.xl, padding: spacing.xl, alignItems: 'center',
  },
  whatsappTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: spacing.sm },
  whatsappDesc: { fontSize: 14, color: 'rgba(255,255,255,0.9)', lineHeight: 22, textAlign: 'center', marginBottom: spacing.lg },
  whatsappButton: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)',
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
    borderRadius: radius.full, gap: spacing.sm, marginBottom: spacing.md,
  },
  whatsappButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  whatsappNumber: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.9)' },

  section: { padding: spacing.md, paddingTop: spacing.lg },
  sectionTitle: { ...typography.h3, marginBottom: spacing.md },
  faqItem: {
    backgroundColor: colors.card, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  faqQuestion: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQ: { ...typography.body, fontWeight: '600', flex: 1, marginRight: spacing.sm },
  faqA: { ...typography.bodySmall, lineHeight: 20, marginTop: spacing.sm, color: colors.textSecondary },

  infoCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    margin: spacing.md, backgroundColor: colors.card,
    borderRadius: radius.md, padding: spacing.md,
    gap: spacing.sm, borderWidth: 1, borderColor: colors.border,
  },
  infoContent: { flex: 1 },
  infoTitle: { ...typography.label, marginBottom: 4 },
  infoText: { ...typography.bodySmall, lineHeight: 20 },

  adminBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'center', marginTop: spacing.lg,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radius.full, borderWidth: 1, borderColor: colors.border,
  },
  adminBtnText: { fontSize: 12, color: colors.textMuted, fontWeight: '500' },
});
