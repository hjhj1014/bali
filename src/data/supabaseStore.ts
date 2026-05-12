/**
 * Supabase 연동 비동기 저장소
 *
 * 동작 원리:
 *  - 저장(save*): in-memory 즉시 반영 → Supabase DB 저장
 *  - 불러오기(sync*): Supabase DB 조회 → in-memory 갱신 → 최신 데이터 반환
 *
 * 화면에서 사용법:
 *  useFocusEffect(useCallback(() => {
 *    syncAccommodation().then(setAcc);
 *    syncCalendar().then(setCal);
 *  }, []));
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

/** Supabase에서 숙소 정보를 불러와 in-memory store를 갱신합니다 */
export async function syncAccommodation(): Promise<Accommodation> {
  const { data, error } = await supabase
    .from('accommodation')
    .select('*')
    .eq('id', HOUSE_ID)
    .single();

  if (error || !data) {
    // DB에 아직 데이터가 없거나 네트워크 오류 → 기존 in-memory 유지
    console.warn('[Supabase] 숙소 정보 로드 실패:', error?.message);
    return getAccommodation();
  }

  updateAccommodation({
    name:             data.name,
    location:         data.location,
    shortDescription: data.short_description,
    description:      data.description,
    notice:           data.notice ?? '',
    pricePerNight:    data.price_per_night,
    maxGuests:        data.max_guests,
    bedrooms:         data.bedrooms,
    bathrooms:        data.bathrooms,
    amenities:        data.amenities ?? [],
    kakaoId:          data.kakao_id,
  });

  return getAccommodation();
}

/** 숙소 정보를 in-memory에 즉시 반영하고 Supabase에도 저장합니다 */
export async function saveAccommodation(
  updates: Partial<Accommodation>
): Promise<void> {
  // 1) 즉시 in-memory 갱신 → UI가 바로 바뀜
  updateAccommodation(updates);

  // 2) Supabase upsert (없으면 insert, 있으면 update)
  const acc = getAccommodation();
  const { error } = await supabase.from('accommodation').upsert({
    id:                HOUSE_ID,
    name:              acc.name,
    location:          acc.location,
    short_description: acc.shortDescription,
    description:       acc.description,
    notice:            acc.notice ?? '',
    price_per_night:   acc.pricePerNight,
    max_guests:        acc.maxGuests,
    bedrooms:          acc.bedrooms,
    bathrooms:         acc.bathrooms,
    amenities:         acc.amenities,
    kakao_id:          acc.kakaoId,
    updated_at:        new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
}

// ─── 캘린더 상태 ──────────────────────────────────────────────────────────────

/** Supabase에서 캘린더 날짜 상태를 불러와 in-memory store를 갱신합니다 */
export async function syncCalendar(): Promise<AccommodationCalendar> {
  const { data, error } = await supabase
    .from('calendar_dates')
    .select('*');

  if (error || !data) {
    console.warn('[Supabase] 캘린더 로드 실패:', error?.message);
    return getCalendar();
  }

  data.forEach((row: { date: string; status: CalendarStatus; note?: string }) => {
    updateDateRangeStatus(row.date, row.date, row.status, row.note);
  });

  return getCalendar();
}

/** 날짜 범위 상태를 in-memory에 즉시 반영하고 Supabase에도 저장합니다 */
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

  const { error } = await supabase.from('calendar_dates').upsert(rows);
  if (error) throw new Error(error.message);
}
