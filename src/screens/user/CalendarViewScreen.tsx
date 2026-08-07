import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { EmojiIcon as Ionicons } from '../../components/EmojiIcon';
import { supabase } from '../../lib/supabase';
import { getAccommodation } from '../../data/store';
import { CalendarLegend } from '../../components/CalendarLegend';
import { StatusBadge } from '../../components/StatusBadge';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { CalendarStatus } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

const OPEN_DATE = '2026-08-28';
const CONTAINER_WIDTH = Math.min(Dimensions.get('window').width, 430);
const DAY_SIZE = Math.floor((CONTAINER_WIDTH - spacing.md * 2 - spacing.sm * 6) / 7);

const STATUS_COLOR: Record<CalendarStatus, string> = {
  available:   colors.available,
  pending:     colors.pending,
  booked:      colors.booked,
  cancelled:   colors.cancelled,
  maintenance: colors.maintenance,
};

// Use local date to avoid UTC timezone off-by-one (Bali = UTC+8)
function localStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysIn(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstDay(y: number, m: number) { return new Date(y, m, 1).getDay(); }
function cellDate(y: number, m: number, day: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Pre-fill synchronously so calendar shows correct status immediately on mount
function buildInitialDates(): Record<string, CalendarStatus> {
  const map: Record<string, CalendarStatus> = {};
  const today = new Date();
  for (let i = 0; i < 180; i++) {
    // Use Date constructor with y/m/d to avoid timezone issues
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    const ds = localStr(d);
    if (ds < OPEN_DATE) map[ds] = 'booked';
  }
  return map;
}

export function CalendarViewScreen() {
  const navigation = useNavigation();
  const acc = getAccommodation();
  const { t } = useLanguage();

  const todayStr = localStr(new Date());
  const today = new Date();

  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSel] = useState<string | null>(null);

  // Initialize with pre-filled booked dates — no blank flash
  const [dates, setDates] = useState<Record<string, CalendarStatus>>(buildInitialDates);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('calendar_dates').select('date, status');
      if (!data) return;
      setDates(prev => {
        const merged = { ...prev }; // keep all pre-filled booked dates
        data.forEach(row => {
          // Supabase data only affects dates from OPEN_DATE onwards
          if (row.date >= OPEN_DATE) {
            merged[row.date] = row.status as CalendarStatus;
          }
        });
        return merged;
      });
    })();
  }, []);

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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{acc.name}</Text>
          <Text style={styles.headerSub}>{t.calendar.title}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.monthLabel}>
            {t.calendar.monthLabel(year, t.calendar.months[month])}
          </Text>
          <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.weekRow}>
          {t.calendar.weekdays.map((d, i) => (
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

        <View style={styles.grid}>
          {Array.from({ length: offset }).map((_, i) => (
            <View key={`e${i}`} style={styles.dayCell} />
          ))}
          {Array.from({ length: days }).map((_, i) => {
            const day     = i + 1;
            const dateStr = cellDate(year, month, day);
            const status  = dates[dateStr] ?? null;
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
                  status && { backgroundColor: STATUS_COLOR[status] + '30' },
                ]}>
                  <Text style={[
                    styles.dayText,
                    isPast && styles.dayPast,
                    isToday && styles.dayTodayText,
                  ]}>
                    {day}
                  </Text>
                  {status && (
                    <View style={[styles.dot, { backgroundColor: STATUS_COLOR[status] }]} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.legendWrap}>
          <Text style={styles.legendTitle}>{t.calendar.legendTitle}</Text>
          <CalendarLegend />
        </View>

        {selected && selectedStatus && (
          <View style={styles.selectedCard}>
            <Text style={styles.selectedDate}>{selected}</Text>
            <StatusBadge status={selectedStatus} />
            <Text style={styles.selectedHint}>
              {t.calendar.hint[selectedStatus as keyof typeof t.calendar.hint] ?? ''}
            </Text>
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
