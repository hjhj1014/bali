import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../constants/theme';

const items = [
  { color: colors.available, label: '예약가능' },
  { color: colors.pending, label: '문의중' },
  { color: colors.booked, label: '예약완료' },
  { color: colors.cancelled, label: '취소/재오픈' },
  { color: colors.maintenance, label: '점검중' },
];

export function CalendarLegend() {
  return (
    <View style={styles.container}>
      {items.map((item) => (
        <View key={item.label} style={styles.item}>
          <View style={[styles.dot, { backgroundColor: item.color }]} />
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
