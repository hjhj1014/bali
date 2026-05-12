import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions, Alert, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { EmojiIcon as Ionicons } from '../../components/EmojiIcon';
import { supabase } from '../../lib/supabase';
import { getAccommodation } from '../../data/store';
import { CalendarStatus } from '../../types';
import { colors, spacing, radius, typography } from '../../constants/theme';

// ─── 달력 크기 계산 ──────────────────────────────────────────────────────────
const WIN_W    = Math.min(Dimensions.get('window').width, 430);
const H_PAD    = spacing.md * 2;
const CELL_GAP = 4;
const DAY_SIZE = Math.floor((WIN_W - H_PAD - CELL_GAP * 6) / 7);

const STATUS_OPTIONS: { value: CalendarStatus; label: string; color: string }[] = [
  { value: 'available',   label: '예약가능', color: '#4CAF50' },
  { value: 'pending',     label: '상담중',   color: '#FFC107' },
  { value: 'booked',      label: '예약완료', color: '#E53935' },
  { value: 'maintenance', label: '막힘',     color: '#757575' },
  { value: 'cancelled',   label: '취소',     color: '#1E88E5' },
];

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTHS   = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

function pad(n: number) { return String(n).padStart(2, '0'); }
function toDateStr(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}
function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstDayOfMonth(y: number, m: number) { return new Date(y, m, 1).getDay(); }

export function AdminCalendarEditorScreen() {
  const navigation = useNavigation();
  const acc        = getAccommodation();
  const today      = new Date();

  const [year,    setYear]   = useState(today.getFullYear());
  const [month,   setMonth]  = useState(today.getMonth());

  const [selectedStatus, setSelectedStatus] = useState<CalendarStatus>('booked');
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangeEnd,   setRangeEnd]   = useState<string | null>(null);

  const [dateMap, setDateMap] = useState<Record<string, CalendarStatus>>({});
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  // ── 화면 진입 시 Supabase fetch ─────────────────────────────────────────
  useFocusEffect(useCallback(() => {
    let cancelled = false;
    setLoading(true);

    supabase
      .from('calendar_dates')
      .select('date, status')
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error('[AdminCalendar] fetch 실패:', error.message);
          Alert.alert('달력 로드 실패', error.message);
          setLoading(false);
          return;
        }
        const map: Record<string, CalendarStatus> = {};
        (data ?? []).forEach(row => {
          map[row.date] = row.status as CalendarStatus;
        });
        console.log('[AdminCalendar] fetch 완료:', Object.keys(map).length, '개');
        setDateMap(map);
        setLoading(false);
      });

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

  const handleDayPress = (day: number) => {
    const d = toDateStr(year, month, day);
    console.log('날짜 선택:', d);

    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(d);
      setRangeEnd(null);
    } else {
      if (d < rangeStart) {
        setRangeEnd(rangeStart);
        setRangeStart(d);
      } else {
        setRangeEnd(d);
      }
    }
  };

  const handleStatusPress = (s: CalendarStatus) => {
    console.log('상태 변경:', s);
    setSelectedStatus(s);
  };

  const isInRange = (dateStr: string): boolean => {
    if (!rangeStart) return false;
    const lo = rangeStart < (rangeEnd ?? rangeStart) ? rangeStart : (rangeEnd ?? rangeStart);
    const hi = rangeStart < (rangeEnd ?? rangeStart) ? (rangeEnd ?? rangeStart) : rangeStart;
    return dateStr > lo && dateStr < hi;
  };

  // ── 달력 저장 ─────────────────────────────────────────────────────────────
  const handleSave = async () => {
    console.log('달력 저장 버튼 클릭');

    if (!rangeStart) {
      Alert.alert('날짜를 선택해주세요', '달력에서 시작 날짜를 먼저 선택하세요.');
      return;
    }

    const start = rangeStart;
    const end   = rangeEnd ?? rangeStart;
    const label = STATUS_OPTIONS.find(s => s.value === selectedStatus)?.label ?? '';

    setSaving(true);

    // upsert할 행 목록
    const rows: { date: string; status: string; updated_at: string }[] = [];
    const cur = new Date(start);
    const fin = new Date(end);
    while (cur <= fin) {
      rows.push({
        date:       cur.toISOString().split('T')[0],
        status:     selectedStatus,
        updated_at: new Date().toISOString(),
      });
      cur.setDate(cur.getDate() + 1);
    }

    console.log('[AdminCalendar] upsert 시작:', rows.length, '개 행');

    const { error } = await supabase
      .from('calendar_dates')
      .upsert(rows, { onConflict: 'date' });

    if (error) {
      setSaving(false);
      console.error('[AdminCalendar] upsert 실패:', error.message);
      Alert.alert('달력 저장 실패', error.message);
      return;
    }

    // 검증 SELECT
    const { data: verified } = await supabase
      .from('calendar_dates')
      .select('date, status')
      .in('date', rows.map(r => r.date));

    console.log('[AdminCalendar] 저장 완료 ✅ DB 검증:', JSON.stringify(verified));

    // 로컬 state 즉시 갱신
    setDateMap(prev => {
      const next = { ...prev };
      rows.forEach(r => { next[r.date] = selectedStatus; });
      return next;
    });
    setRangeStart(null);
    setRangeEnd(null);
    setSaving(false);

    Alert.alert('달력 저장 완료', `${rows.length}개 날짜 → ${label}`);
  };

  // ── 렌더 ──────────────────────────────────────────────────────────────────
  const days   = daysInMonth(year, month);
  const offset = firstDayOfMonth(year, month);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.terracotta} />
        <Text style={styles.loadingText}>달력 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 헤더 */}
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

      {/* 스크롤 영역 */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ① 상태 선택 */}
        <View style={styles.statusSection}>
          <Text style={styles.sectionLabel}>① 적용할 상태 선택</Text>
          <View style={styles.statusRow}>
            {STATUS_OPTIONS.map(s => {
              const isSelected = selectedStatus === s.value;
              return (
                <TouchableOpacity
                  key={s.value}
                  activeOpacity={0.7}
                  style={[
                    styles.statusChip,
                    { borderColor: s.color },
                    isSelected && { backgroundColor: s.color },
                  ]}
                  onPress={() => handleStatusPress(s.value)}
                >
                  <View style={[styles.dot, { backgroundColor: isSelected ? '#fff' : s.color }]} />
                  <Text style={[styles.chipText, { color: isSelected ? '#fff' : s.color }]}>
                    {s.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ② 날짜 범위 표시 */}
        <View style={styles.rangeBox}>
          <Text style={styles.sectionLabel}>② 날짜 범위 선택</Text>
          <View style={styles.rangeRow}>
            <View style={styles.rangeItem}>
              <Text style={styles.rangeLabel}>시작일</Text>
              <Text style={styles.rangeValue}>{rangeStart ?? '—'}</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
            <View style={styles.rangeItem}>
              <Text style={styles.rangeLabel}>종료일</Text>
              <Text style={styles.rangeValue}>
                {rangeEnd ?? (rangeStart ? '(하루)' : '—')}
              </Text>
            </View>
          </View>
        </View>

        {/* 월 네비게이션 */}
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={prevMonth} style={styles.navBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.monthLabel}>{year}년 {MONTHS[month]}</Text>
          <TouchableOpacity onPress={nextMonth} style={styles.navBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* 요일 헤더 */}
        <View style={styles.weekRow}>
          {WEEKDAYS.map(d => (
            <Text key={d} style={styles.weekday}>{d}</Text>
          ))}
        </View>

        {/* 달력 그리드 — gap 대신 margin 적용 (웹 호환) */}
        <View style={styles.grid}>
          {Array.from({ length: offset }).map((_, i) => (
            <View key={`e${i}`} style={styles.cell} />
          ))}
          {Array.from({ length: days }).map((_, i) => {
            const day     = i + 1;
            const dateStr = toDateStr(year, month, day);
            const status  = dateMap[dateStr] ?? null;
            const isStart = dateStr === rangeStart;
            const isEnd   = dateStr === rangeEnd;
            const inRange = isInRange(dateStr);

            let cellBg = 'transparent';
            if (isStart || isEnd) cellBg = colors.terracotta;
            else if (inRange)     cellBg = colors.terracotta + '30';

            return (
              <TouchableOpacity
                key={dateStr}
                activeOpacity={0.6}
                style={[styles.cell, { backgroundColor: cellBg, borderRadius: radius.sm }]}
                onPress={() => handleDayPress(day)}
              >
                <Text style={[
                  styles.dayNum,
                  (isStart || isEnd) && { color: '#fff', fontWeight: '800' },
                ]}>
                  {day}
                </Text>
                {status && (
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: STATUS_OPTIONS.find(s => s.value === status)?.color ?? '#ccc' },
                  ]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 선택 초기화 */}
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => { setRangeStart(null); setRangeEnd(null); }}
          activeOpacity={0.7}
        >
          <Text style={styles.resetBtnText}>선택 초기화</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── 하단 고정 저장 버튼 ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>달력 저장</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: colors.background },
  center:      { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { ...typography.bodySmall, color: colors.textMuted },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 52, paddingBottom: spacing.md, paddingHorizontal: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  backBtn:      { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle:  { ...typography.h3, fontSize: 16 },
  headerSub:    { ...typography.caption, color: colors.terracotta, marginTop: 1 },

  sectionLabel: {
    ...typography.label, color: colors.textSecondary,
    paddingHorizontal: spacing.md, marginBottom: 8,
  },

  statusSection: { paddingTop: spacing.md },
  statusRow: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: spacing.md, gap: 8, paddingBottom: spacing.sm,
  },
  statusChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 999, borderWidth: 2,
    backgroundColor: colors.card,
  },
  dot:      { width: 8, height: 8, borderRadius: 4 },
  chipText: { fontSize: 13, fontWeight: '700' },

  rangeBox: { marginHorizontal: spacing.md, marginTop: 8, marginBottom: 4 },
  rangeRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, borderRadius: radius.md,
    paddingVertical: 12, paddingHorizontal: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  rangeItem:  { flex: 1, alignItems: 'center' },
  rangeLabel: { ...typography.caption, marginBottom: 2 },
  rangeValue: { ...typography.body, fontWeight: '700', color: colors.terracotta, fontSize: 14 },
  arrow:      { fontSize: 18, color: colors.textMuted, marginHorizontal: 8 },

  monthNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md, marginTop: 4,
  },
  navBtn: {
    width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
  },
  monthLabel: { ...typography.h3, fontSize: 17 },

  weekRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: 4,
  },
  weekday: {
    width: DAY_SIZE,
    marginHorizontal: CELL_GAP / 2,
    textAlign: 'center',
    fontSize: 11, fontWeight: '600', color: colors.textMuted,
  },

  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  cell: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    marginHorizontal: CELL_GAP / 2,
    marginVertical: CELL_GAP / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNum:    { fontSize: 13, fontWeight: '500', color: colors.text },
  statusDot: { width: 5, height: 5, borderRadius: 3, marginTop: 2 },

  resetBtn:     { alignItems: 'center', paddingVertical: spacing.sm, marginBottom: spacing.md },
  resetBtnText: { color: colors.textMuted, fontSize: 13 },

  // 하단 고정 저장 버튼
  footer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingBottom: 28,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveBtn: {
    backgroundColor: colors.terracotta,
    paddingVertical: 16,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
