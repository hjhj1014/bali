import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { EmojiIcon as Ionicons } from '../../components/EmojiIcon';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { openKakaoChat } from '../../utils/kakao';
import { RootStackParamList } from '../../types';

type Nav = StackNavigationProp<RootStackParamList>;

export function ContactScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>문의하기</Text>
        <Text style={styles.subtitle}>궁금한 점은 편하게 물어보세요 😊</Text>
      </View>

      {/* Main CTA */}
      <View style={styles.mainCard}>
        <View style={styles.kakaoIconWrap}>
          <Ionicons name="chatbubble-ellipses" size={36} color="#3A1D1D" />
        </View>
        <Text style={styles.cardTitle}>카카오톡으로 바로 상담</Text>
        <Text style={styles.cardDesc}>
          숙소 예약 가능 여부, 가격, 장기 체류 할인 등{'\n'}
          모든 문의를 카카오톡으로 빠르게 답변드려요.
        </Text>
        <TouchableOpacity style={styles.kakaoButton} onPress={openKakaoChat}>
          <Text style={styles.kakaoButtonText}>카카오톡으로 상담하기</Text>
          <Ionicons name="arrow-forward" size={18} color="#3A1D1D" />
        </TouchableOpacity>
        <View style={styles.kakaoIdRow}>
          <Text style={styles.kakaoIdLabel}>1:1 오픈채팅</Text>
          <Text style={styles.kakaoId}>open.kakao.com/o/sW9hPrui</Text>
        </View>
      </View>

      {/* FAQ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>자주 묻는 질문</Text>

        {FAQ_ITEMS.map((item, i) => (
          <FAQItem key={i} q={item.q} a={item.a} />
        ))}
      </View>

      {/* Info */}
      <View style={styles.infoCard}>
        <Ionicons name="time-outline" size={20} color={colors.olive} />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>상담 운영 시간</Text>
          <Text style={styles.infoText}>매일 오전 9시 ~ 오후 10시{'\n'}(발리 현지 시간 기준 / WITA)</Text>
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
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.textMuted}
        />
      </View>
      {open && <Text style={styles.faqA}>{a}</Text>}
    </TouchableOpacity>
  );
}

const FAQ_ITEMS = [
  {
    q: '예약은 어떻게 하나요?',
    a: '카카오톡 채널로 원하는 숙소와 날짜를 알려주세요. 가용 여부 확인 후 안내드립니다.',
  },
  {
    q: '장기 체류 할인이 있나요?',
    a: '한 달 이상 장기 체류 시 별도 할인이 적용됩니다. 카카오톡으로 문의해 주세요.',
  },
  {
    q: '아이와 함께 가기 좋은 숙소가 있나요?',
    a: '저희 모든 숙소는 가족 여행을 기준으로 검증되었습니다. Sanur Family House와 School-near Sanur Home이 특히 아이와 함께하기 좋습니다.',
  },
  {
    q: '공항 픽업은 되나요?',
    a: '별도 요금으로 공항 픽업 서비스를 연결해 드릴 수 있습니다. 카카오톡으로 문의해 주세요.',
  },
  {
    q: '국제학교 정보도 알 수 있나요?',
    a: '발리 현지 국제학교 정보와 등록 절차에 대해서도 안내드리고 있습니다. 발리 교육 이민을 준비 중이시라면 카카오톡으로 문의해 주세요.',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
  },
  subtitle: {
    ...typography.bodySmall,
    marginTop: 4,
  },
  mainCard: {
    margin: spacing.md,
    backgroundColor: '#FEE500',
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },
  kakaoIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3A1D1D',
    marginBottom: spacing.sm,
  },
  cardDesc: {
    fontSize: 14,
    color: '#5A3D3D',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  kakaoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.12)',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  kakaoButtonText: {
    color: '#3A1D1D',
    fontWeight: '700',
    fontSize: 15,
  },
  kakaoIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  kakaoIdLabel: {
    fontSize: 12,
    color: '#5A3D3D',
  },
  kakaoId: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3A1D1D',
  },
  section: {
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  faqItem: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQ: {
    ...typography.body,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.sm,
  },
  faqA: {
    ...typography.bodySmall,
    lineHeight: 20,
    marginTop: spacing.sm,
    color: colors.textSecondary,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    margin: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    ...typography.label,
    marginBottom: 4,
  },
  infoText: {
    ...typography.bodySmall,
    lineHeight: 20,
  },
  adminBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  adminBtnText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
});
