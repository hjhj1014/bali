import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CalendarStatus } from '../types';
import { colors, radius, spacing } from '../constants/theme';

const statusConfig: Record<
  CalendarStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  available: { label: '예약가능', bg: colors.availableLight, text: colors.available, dot: colors.available },
  pending: { label: '문의중', bg: colors.pendingLight, text: '#F57F17', dot: colors.pending },
  booked: { label: '예약완료', bg: colors.bookedLight, text: colors.booked, dot: colors.booked },
  cancelled: { label: '취소/재오픈', bg: colors.cancelledLight, text: colors.cancelled, dot: colors.cancelled },
  maintenance: { label: '점검중', bg: colors.maintenanceLight, text: colors.maintenance, dot: colors.maintenance },
};

interface Props {
  status: CalendarStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: Props) {
  const config = statusConfig[status];
  const isSmall = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, isSmall && styles.badgeSm]}>
      <View style={[styles.dot, { backgroundColor: config.dot }, isSmall && styles.dotSm]} />
      <Text style={[styles.text, { color: config.text }, isSmall && styles.textSm]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    gap: 4,
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  dotSm: {
    width: 5,
    height: 5,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
  textSm: {
    fontSize: 11,
  },
});
