import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { EmojiIcon as Ionicons } from '../../components/EmojiIcon';
import { supabase } from '../../lib/supabase';           // ← 직접 호출
import { getAccommodation } from '../../data/store';     // 숙소명 표시용만
import { CalendarLegend } from '../../components/CalendarLegend';
import { StatusBadge } from '../../components/StatusBadge';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { CalendarStatus } from '../../types';

const CONTAINER_WIDTH = Math.min(Dimensions.get('window').width, 430);
const DAY_SIZE = Math.floor((CONTAINER_WIDTH - spacing.md * 2 - spacing.sm * 6) / 7);

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

const HINT: Record<CalendarStatus, string> = {
  available:   '예약 가능한 날짜입니다. 카카오톡으로 문의해 주세요 😊',
  pending:     '현재 상담 중인 날짜입니다. 카카오톡으로 먼저 연락해 주세요.',
  booked:      '이미 예약이 완료된 날짜입니다.',
  cancelled:   '취소 후 재오픈된 날짜입니다. 카카오톡으로 문의해 보세요.',
  maintenance: '막혀 있는 날짜로 예약이 불가합니다.',
};

export function CalendarViewScreen() {
  const navigation = useNavigation();
  const today      = new Date();
  const todayStr   = today.toISOString().split('T')[0];
  const acc        = getAccommodation(); // 숙소명 헤더 표시용

  const [year,     setYear]   = useState(today.getFullYear());
  const [month,    setMonth]  = useState(today.getMonth());
  const [selected, setSel]    = useState<string | null>(null);

  // ─── Supabase에서 직접 받아온 날짜→상태 맵 ─────────────────────────────────
  const [dates, setDates] = useState<Record<string, CalendarStatus>>({});

  // ── 화면 진입 시 calendar_dates 테이블에서 fetch ───────────────────────────
  useFocusEffect(useCallback(() => {
    let cancelled = false;

    (async () => {
      console.log('[CalendarView] Supabase fetch 시작...');

      const { data, error } = await supabase
        .from('calendar_dates')
        .select('date, status');

      if (cancelled) return;

      if (error) {
        console.error('[CalendarView] fetch 실패:', error.message);
        return; // 실패해도 빈 달력으로 표시 (손님 화면이므로 alert 생략)
      }

      const map: Record<string, CalendarStatus> = {};
      (data ?? []).forEach((row) => {
        map[row.date] = row.status as CalendarStatus;
      });

      console.log('[CalendarView] fetch 성공 ✅', Object.keys(map).length, '개 날짜');
      setDates(map);
    })();

    return () => { cancelled = true; };
  }, []));

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const days   = daysIn(year, month);
  const offset = firstDay(year, month);

  const selectedStatus = selected ? (dates[selected] ?? null) : null;

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{acc.name}</Text>
          <Text style={styles.headerSub}>예약 가능 달력</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 월 네비게이션 */}
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.monthLabel}>{year}년 {MONTHS[month]}</Text>
          <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* 요일 헤더 */}
        <View style={styles.weekRow}>
          {WEEKDAYS.map((d, i) => (
            <Text
              key={d}
              style={[
                styles.weekday,
                i === 0 && { color: '#E53935' },
                i === 6 && { color: '#1E88E5' },
              ]}
            >
              {d}
            </Text>
          ))}
        </View>

        {/* 달력 그리드 */}
        <View style={styles.grid}>
          {Array.from({ length: offset }).map((_, i) => (
            <View key={`e${i}`} style={styles.dayCell} />
          ))}
          {Array.from({ length: days }).map((_, i) => {
            const day     = i + 1;
            const dateStr = fmt(year, month, day);
            const status  = dates[dateStr] ?? null;   // ← Supabase 데이터 기준
            const isPast  = dateStr < todayStr;
            const isSel   = dateStr === selected;
            const isToday = dateStr === todayStr;

            return (
              <TouchableOpacity
                key={day}
                style={[styles.dayCell, isSel && styles.dayCellSelected]}
                onPress={() => !isPast && setSel(isSel ? null : dateStr)}
                disabled={isPast}
              >
                <View style={[
                  styles.dayInner,
                  isToday && styles.dayToday,
                  status && !isPast && { backgroundColor: STATUS_COLOR[status] + '28' },
                ]}>
                  <Text style={[
                    styles.dayText,
                    isPast && styles.dayPast,
                    isToday && styles.dayTodayText,
                  ]}>
                    {day}
                  </Text>
                  {status && !isPast && (
                    <View style={[styles.dot, { backgroundColor: STATUS_COLOR[status] }]} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 범례 */}
        <View style={styles.legendWrap}>
          <Text style={styles.legendTitle}>상태 안내</Text>
          <CalendarLegend />
        </View>

        {/* 선택한 날짜 정보 */}
        {selected && selectedStatus && (
          <View style={styles.selectedCard}>
            <Text style={styles.selectedDate}>{selected}</Text>
            <StatusBadge status={selectedStatus} />
            <Text style={styles.selectedHint}>{HINT[selectedStatus]}</Text>
          </View>
        )}

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
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { ...typography.h3, fontSize: 16 },
  headerSub: { ...typography.caption, marginTop: 1 },
  monthNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
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
  dayCell: { width: DAY_SIZE, height: DAY_SIZE, alignItems: 'center', justifyContent: 'center' },
  dayCellSelected: { borderRadius: radius.sm, borderWidth: 2, borderColor: colors.terracotta },
  dayInner: { width: DAY_SIZE - 4, height: DAY_SIZE - 4, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', gap: 2 },
  dayToday: { backgroundColor: colors.creamDark },
  dayText: { fontSize: 13, fontWeight: '500', color: colors.text },
  dayPast: { color: colors.textMuted, opacity: 0.4 },
  dayTodayText: { fontWeight: '800', color: colors.terracotta },
  dot: { width: 5, height: 5, borderRadius: 3 },
  legendWrap: { marginTop: spacing.lg, paddingHorizontal: spacing.md },
  legendTitle: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs },
  selectedCard: {
    margin: spacing.md, marginTop: spacing.lg, backgroundColor: colors.card,
    borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  selectedDate: { ...typography.h3, fontSize: 15 },
  selectedHint: { ...typography.bodySmall, lineHeight: 20, marginTop: 4 },
});
