import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { EmojiIcon as Ionicons } from '../../components/EmojiIcon';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { RootStackParamList } from '../../types';

type Nav = StackNavigationProp<RootStackParamList>;

const MENU_ITEMS = [
  {
    icon: 'images-outline' as const,
    label: '사진 업로드 관리',
    sub: '사진 올리기 · 삭제 · 대표 설정',
    screen: 'AdminUploadPhotos' as keyof RootStackParamList,
    color: colors.terracotta,
  },
  {
    icon: 'create-outline' as const,
    label: '숙소 정보 편집',
    sub: '이름, 설명, 위치, 인원 수 등',
    screen: 'AdminEditInfo' as keyof RootStackParamList,
    color: colors.olive,
  },
  {
    icon: 'calendar-outline' as const,
    label: '예약 상태 관리',
    sub: '예약가능 · 상담중 · 예약완료 · 막힘',
    screen: 'AdminCalendarEditor' as keyof RootStackParamList,
    color: colors.pending,
  },
  {
    icon: 'map-outline' as const,
    label: '가이드 관리',
    sub: '장소 추가, 편집, 공개 설정',
    screen: 'AdminGuideManager' as keyof RootStackParamList,
    color: colors.olive,
  },
];

export function AdminHomeScreen() {
  const navigation = useNavigation<Nav>();

  const logout = () => {
    Alert.alert('로그아웃', '관리자 화면을 나가시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '나가기', style: 'destructive', onPress: () => navigation.navigate('MainTabs') },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>관리자</Text>
          <Text style={styles.subtitle}>Bali Mom & Kid Stay</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={colors.textMuted} />
          <Text style={styles.logoutText}>나가기</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Badge */}
        <View style={styles.badge}>
          <Ionicons name="shield-checkmark" size={16} color={colors.terracotta} />
          <Text style={styles.badgeText}>관리자 모드 활성화</Text>
        </View>

        {/* Menu cards */}
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.screen}
            style={styles.menuCard}
            onPress={() => navigation.navigate(item.screen as any)}
            activeOpacity={0.85}
          >
            <View style={[styles.menuIcon, { backgroundColor: item.color + '18' }]}>
              <Ionicons name={item.icon} size={24} color={item.color} />
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuSub}>{item.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ))}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {},
  title: { ...typography.h2 },
  subtitle: { ...typography.bodySmall, marginTop: 2 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  logoutText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  content: {
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: colors.terracotta + '14',
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.full,
    marginBottom: spacing.lg,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.terracotta,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    flex: 1,
  },
  menuLabel: {
    ...typography.body,
    fontWeight: '700',
    marginBottom: 2,
  },
  menuSub: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
});
