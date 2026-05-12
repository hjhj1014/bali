import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { EmojiIcon as Ionicons } from '../../components/EmojiIcon';
import { getAccommodation, getCalendar } from '../../data/store';
import { saveDateRange, syncCalendar } from '../../data/supabaseStore';
import { CalendarStatus } from '../../types';
import { colors, spacing, radius, typography } from '../../constants/theme';

const CONTAINER_WIDTH = Math.min(Dimensions.get('window').width, 430);
const DAY_SIZE = Math.floor((CONTAINER_WIDTH - spacing.md * 2 - spacing.sm * 6) / 7);

const STATUS_OPTIONS: { value: CalendarStatus; label: string; color: string }[] = [
  { value: 'available',   label: '예약가능', color: colors.available },
  { value: 'pending',     label: '상담중',   color: colors.pending },
  { value: 'booked',      label: '예약완료', color: colors.booked },
  { value: 'maintenance', label: '막힘',     color: colors.maintenance },
  { value: 'cancelled',   label: '취소',     color: colors.cancelled },
];

const STATUS_COLOR: Record<CalendarStatus, string> = {
  available:   colors.available,
  pending:     colors.pending,
  booked:      colors.booked,
  cancelled:   colors.cancelled,
  maintenance: colors.maintenance,
};

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTHS   = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

function pad(n: number) { return String(n).padStart(2, '0'); }
function fmt(y: number, m: number, d: number) { return `${y}-${pad(m + 1)}-${pad(d)}`; }
function daysIn(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstDay(y: number, m: number) { return new Date(y, m, 1).getDay(); }

export function AdminCalendarEditorScreen() {
  const navigation = useNavigation();
  const acc = getAccommodation();

  const today = new Date();
  const [year, setYear]                   = useState(today.getFullYear());
  const [month, setMonth]                 = useState(today.getMonth());
  const [selectedStatus, setSelectedStatus] = useState<CalendarStatus>('booked');
  const [rangeStart, setRangeStart]       = useState<string | null>(null);
  const [rangeEnd, setRangeEnd]           = useState<string | null>(null);
  const [tick, setTick]   = useState(0);
  const [saving, setSaving] = useState(false);

  const calendarData = getCalendar();

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const days   = daysIn(year, month);
  const offset = firstDay(year, month);

  const getStatus = useCallback(
    (day: number): CalendarStatus | null => {
      const dateStr = fmt(year, month, day);
      return calendarData.dates[dateStr]?.status ?? null;
    },
    [year, month, calendarData, tick] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const isInRange = (day: number): boolean => {
    if (!rangeStart) return false;
    const dateStr = fmt(year, month, day);
    const lo = rangeStart <= (rangeEnd ?? rangeStart) ? rangeStart : (rangeEnd ?? rangeStart);
    const hi = rangeStart <= (rangeEnd ?? rangeStart) ? (rangeEnd ?? rangeStart) : rangeStart;
    return dateStr >= lo && dateStr <= hi;
  };

  const handleDayPress = (day: number) => {
    const dateStr = fmt(year, month, day);
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(dateStr);
      setRangeEnd(null);
    } else {
      if (dateStr < rangeStart) {
        setRangeEnd(rangeStart);
        setRangeStart(dateStr);
      } else {
        setRangeEnd(dateStr);
      }
    }
  };

  const applyStatus = () => {
    if (!rangeStart) {
      Alert.alert('날짜를 선택해주세요', '시작 날짜를 먼저 선택해주세요.');
      return;
    }
    const start = rangeStart;
    const end   = rangeEnd ?? rangeStart;
    const label = STATUS_OPTIONS.find(s => s.value === selectedStatus)?.label ?? '';

    Alert.alert(
      '상태 변경 확인',
      `${start} ~ ${end}\n상태: ${label}\n\n변경하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '변경',
          onPress: async () => {
            setSaving(true);
            try {
              await saveDateRange(start, end, selectedStatus);
              setRangeStart(null);
              setRangeEnd(null);
              setTick(n => n + 1);
              Alert.alert('저장 완료', 'Supabase에 저장되었습니다.');
            } catch (err: any) {
              Alert.alert('저장 실패', `오류: ${err?.message ?? '알 수 없는 오류'}`);
            } finally {
              setSaving(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{acc.name}</Text>
          <Text style={styles.headerSub}>달력 상태 편집</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Status selector */}
        <View style={styles.statusSection}>
          <Text style={styles.statusLabel}>적용할 상태 선택</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusRow}>
            {STATUS_OPTIONS.map(s => (
              <TouchableOpacity
                key={s.value}
                style={[
                  styles.statusChip,
                  selectedStatus === s.value && { backgroundColor: s.color, borderColor: s.color },
                ]}
                onPress={() => setSelectedStatus(s.value)}
              >
                <View style={[styles.statusDot, { backgroundColor: s.color }]} />
                <Text style={[styles.statusChipText, selectedStatus === s.value && { color: colors.white }]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Range display */}
        <View style={styles.rangeInfo}>
          <View style={styles.rangeBox}>
            <Text style={styles.rangeBoxLabel}>시작일</Text>
            <Text style={styles.rangeBoxDate}>{rangeStart ?? '—'}</Text>
          </View>
          <Ionicons name="arrow-forward" size={16} color={colors.textMuted} />
          <View style={styles.rangeBox}>
            <Text style={styles.rangeBoxLabel}>종료일</Text>
            <Text style={styles.rangeBoxDate}>{rangeEnd ?? (rangeStart ? '(단일)' : '—')}</Text>
          </View>
        </View>

        {/* Month nav */}
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.monthLabel}>{year}년 {MONTHS[month]}</Text>
          <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Weekday headers */}
        <View style={styles.weekRow}>
          {WEEKDAYS.map(d => (
            <Text key={d} style={styles.weekday}>{d}</Text>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={styles.grid}>
          {Array.from({ length: offset }).map((_, i) => <View key={`e${i}`} style={styles.dayCell} />)}
          {Array.from({ length: days }).map((_, i) => {
            const day    = i + 1;
            const dateStr = fmt(year, month, day);
            const status  = getStatus(day);
            const inRange = isInRange(day);
            const isStart = dateStr === rangeStart;
            const isEnd   = dateStr === rangeEnd;

            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayCell,
                  inRange && styles.dayCellInRange,
                  (isStart || isEnd) && styles.dayCellEdge,
                ]}
                onPress={() => handleDayPress(day)}
              >
                <Text style={[styles.dayText, (isStart || isEnd) && styles.dayTextEdge]}>
                  {day}
                </Text>
                {status && (
                  <View style={[styles.statusDotSmall, { backgroundColor: STATUS_COLOR[status] }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Apply */}
        <TouchableOpacity
          style={[styles.applyButton, saving && { opacity: 0.7 }]}
          onPress={applyStatus}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color={colors.white} />
              <Text style={styles.applyButtonText}>선택 범위에 상태 적용</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => { setRangeStart(null); setRangeEnd(null); }}
        >
          <Text style={styles.resetButtonText}>선택 초기화</Text>
        </TouchableOpacity>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 52, paddingBottom: spacing.md, paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { ...typography.h3, fontSize: 16 },
  headerSub: { ...typography.caption, color: colors.terracotta, marginTop: 1 },

  statusSection: { paddingTop: spacing.md },
  statusLabel: {
    ...typography.label,
    paddingHorizontal: spacing.md, marginBottom: spacing.sm, color: colors.textSecondary,
  },
  statusRow: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingBottom: spacing.sm },
  statusChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2,
    borderRadius: radius.full, borderWidth: 1.5,
    borderColor: colors.border, backgroundColor: colors.card,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusChipText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },

  rangeInfo: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.md, paddingVertical: spacing.md, paddingHorizontal: spacing.md,
    marginHorizontal: spacing.md, backgroundColor: colors.card,
    borderRadius: radius.md, marginTop: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  rangeBox: { alignItems: 'center', flex: 1 },
  rangeBoxLabel: { ...typography.caption, marginBottom: 2 },
  rangeBoxDate: { ...typography.body, fontWeight: '600', color: colors.terracotta, fontSize: 14 },

  monthNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md, marginTop: spacing.sm,
  },
  navBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  monthLabel: { ...typography.h3, fontSize: 17 },

  weekRow: { flexDirection: 'row', paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  weekday: { width: DAY_SIZE, textAlign: 'center', fontSize: 12, fontWeight: '600', color: colors.textMuted },

  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.md, gap: spacing.sm, rowGap: spacing.sm },
  dayCell: { width: DAY_SIZE, height: DAY_SIZE, alignItems: 'center', justifyContent: 'center', borderRadius: radius.sm, gap: 2 },
  dayCellInRange: { backgroundColor: colors.terracotta + '20' },
  dayCellEdge: { backgroundColor: colors.terracotta },
  dayText: { fontSize: 13, fontWeight: '500', color: colors.text },
  dayTextEdge: { color: colors.white, fontWeight: '700' },
  statusDotSmall: { width: 5, height: 5, borderRadius: 3 },

  applyButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, margin: spacing.md, marginTop: spacing.lg,
    backgroundColor: colors.terracotta, paddingVertical: spacing.md, borderRadius: radius.md,
  },
  applyButtonText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  resetButton: { alignItems: 'center', paddingVertical: spacing.sm },
  resetButtonText: { color: colors.textMuted, fontSize: 13, fontWeight: '500' },
});
