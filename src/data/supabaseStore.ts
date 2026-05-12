/**
 * Supabase 연동 비동기 저장소
 *
 * 동작 원리:
 *  - sync*  : Supabase DB 조회 → in-memory 갱신 → 최신 데이터 반환
 *  - save*  : in-memory 즉시 반영 → Supabase DB 저장
 */

import { supabase } from '../lib/supabase';
import { Accommodation, AccommodationCalendar, CalendarStatus } from '../types';
import {
  getAccommodation,
  getCalendar,
  updateAccommodation,
  updateDateRangeStatus,
} from './store';

const HOUSE_ID = 'bali-cozy-house';

// ─── 숙소 정보 ────────────────────────────────────────────────────────────────

/** Supabase에서 숙소 정보를 불러와 in-memory store를 갱신하고 반환 */
export async function syncAccommodation(): Promise<Accommodation> {
  console.log('[Supabase] 숙소 정보 로드 시작...');

  const { data, error } = await supabase
    .from('accommodation')
    .select('*')
    .eq('id', HOUSE_ID)
    .single();

  if (error) {
    console.error('[Supabase] 숙소 정보 로드 실패:', error.message, error.code);
    return getAccommodation();
  }

  if (!data) {
    console.warn('[Supabase] 숙소 정보 없음 — DB에 초기 데이터를 넣어주세요');
    return getAccommodation();
  }

  console.log('[Supabase] 숙소 정보 로드 성공:', data.name);

  updateAccommodation({
    name:             data.name,
    location:         data.location,
    shortDescription: data.short_description,
    description:      data.description,
    notice:           data.notice ?? '',
    pricePerNight:    data.price_per_night ?? 0,
    maxGuests:        data.max_guests ?? 4,
    bedrooms:         data.bedrooms ?? 2,
    bathrooms:        data.bathrooms ?? 1,
    amenities:        Array.isArray(data.amenities) ? data.amenities : [],
    kakaoId:          data.kakao_id ?? '',
  });

  return getAccommodation();
}

/** 숙소 정보를 in-memory에 즉시 반영하고 Supabase에도 저장 */
export async function saveAccommodation(
  updates: Partial<Accommodation>
): Promise<void> {
  // 1) 즉시 in-memory 갱신 → UI가 바로 바뀜
  updateAccommodation(updates);

  const acc = getAccommodation();

  console.log('[Supabase] 숙소 정보 저장 시작:', acc.name);

  // 2) onConflict: 'id' → id가 이미 있으면 UPDATE, 없으면 INSERT
  const { error } = await supabase
    .from('accommodation')
    .upsert(
      {
        id:                HOUSE_ID,
        name:              acc.name,
        location:          acc.location,
        short_description: acc.shortDescription,
        description:       acc.description,
        notice:            acc.notice ?? '',
        price_per_night:   acc.pricePerNight ?? 0,
        max_guests:        acc.maxGuests,
        bedrooms:          acc.bedrooms,
        bathrooms:         acc.bathrooms,
        amenities:         acc.amenities,
        kakao_id:          acc.kakaoId,
        updated_at:        new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

  if (error) {
    console.error('[Supabase] 숙소 정보 저장 실패:', error.message, error.code);
    throw new Error(error.message);
  }

  console.log('[Supabase] 숙소 정보 저장 완료 ✅');
}

// ─── 캘린더 상태 ──────────────────────────────────────────────────────────────

/** Supabase에서 캘린더 날짜 상태를 불러와 in-memory store를 갱신 */
export async function syncCalendar(): Promise<AccommodationCalendar> {
  console.log('[Supabase] 캘린더 로드 시작...');

  const { data, error } = await supabase
    .from('calendar_dates')
    .select('*');

  if (error) {
    console.error('[Supabase] 캘린더 로드 실패:', error.message);
    return getCalendar();
  }

  if (!data || data.length === 0) {
    console.log('[Supabase] 캘린더 데이터 없음 — 기본값 사용');
    return getCalendar();
  }

  console.log('[Supabase] 캘린더 로드 성공:', data.length, '개 날짜');

  data.forEach((row: { date: string; status: CalendarStatus; note?: string }) => {
    updateDateRangeStatus(row.date, row.date, row.status, row.note);
  });

  return getCalendar();
}

/** 날짜 범위 상태를 in-memory에 즉시 반영하고 Supabase에도 저장 */
export async function saveDateRange(
  startDate: string,
  endDate:   string,
  status:    CalendarStatus,
  note?:     string
): Promise<void> {
  // 1) 즉시 in-memory 갱신
  updateDateRangeStatus(startDate, endDate, status, note);

  // 2) upsert할 행 목록 생성
  const rows: { date: string; status: CalendarStatus; note?: string; updated_at: string }[] = [];
  const cur = new Date(startDate);
  const end = new Date(endDate);

  while (cur <= end) {
    rows.push({
      date:       cur.toISOString().split('T')[0],
      status,
      note,
      updated_at: new Date().toISOString(),
    });
    cur.setDate(cur.getDate() + 1);
  }

  console.log('[Supabase] 캘린더 저장 시작:', startDate, '~', endDate, status);

  const { error } = await supabase
    .from('calendar_dates')
    .upsert(rows, { onConflict: 'date' });

  if (error) {
    console.error('[Supabase] 캘린더 저장 실패:', error.message);
    throw new Error(error.message);
  }

  console.log('[Supabase] 캘린더 저장 완료 ✅');
}
