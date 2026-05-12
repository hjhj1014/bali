import { Accommodation, AccommodationCalendar, CalendarStatus, GuideItem } from '../types';
import { initialAccommodation, buildInitialCalendar } from './mockData';
import { initialGuideItems } from './guideData';

// ─── Admin Photo Storage (localStorage, 웹 전용) ────────────────────────────
//
// ⚠️  현재 방식: 업로드한 사진은 이 브라우저(기기)의 localStorage에만 저장됩니다.
//     같은 브라우저에서 관리자가 올린 사진은 손님 화면에 즉시 반영됩니다.
//
// ❗  다른 사람 휴대폰에도 바로 보이게 하려면 Supabase Storage로 교체해야 합니다.
//     (향후: addAdminPhoto → Supabase bucket upload 으로 대체)
//
const PHOTOS_STORAGE_KEY = 'bali_admin_photos_v1';

function readStoragePhotos(): string[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = localStorage.getItem(PHOTOS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeStoragePhotos(photos: string[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(photos));
  } catch {
    // localStorage 용량(보통 5MB) 초과 시 — 화면에서 Alert로 안내
    console.warn('[Admin] localStorage 저장 실패 — 용량 초과일 수 있음');
  }
}

export function getAdminPhotos(): string[] {
  return readStoragePhotos();
}

export function addAdminPhoto(dataUrl: string): void {
  const photos = readStoragePhotos();
  photos.push(dataUrl);
  writeStoragePhotos(photos);
}

export function removeAdminPhoto(index: number): void {
  const photos = readStoragePhotos();
  if (index < 0 || index >= photos.length) return;
  photos.splice(index, 1);
  writeStoragePhotos(photos);
}

export function reorderAdminPhotos(photos: string[]): void {
  writeStoragePhotos(photos);
}

// ─── Accommodation state ────────────────────────────────────────────────────
let accommodationStore: Accommodation = { ...initialAccommodation };

export function getAccommodation(): Accommodation {
  // 웹에서 관리자가 올린 사진이 있으면 그것을 우선 사용
  const adminPhotos = readStoragePhotos();
  if (adminPhotos.length > 0) {
    return { ...accommodationStore, photos: adminPhotos };
  }
  return accommodationStore;
}

export function updateAccommodation(updates: Partial<Accommodation>): void {
  accommodationStore = { ...accommodationStore, ...updates };
}

// ─── Calendar state ─────────────────────────────────────────────────────────
let calendarStore: AccommodationCalendar = buildInitialCalendar();

export function getCalendar(): AccommodationCalendar {
  return calendarStore;
}

// ─── Guide state ────────────────────────────────────────────────────────────
let guideStore: GuideItem[] = initialGuideItems.map(item => ({ ...item }));

export function getGuide(): GuideItem[] {
  return guideStore;
}

export function addGuideItem(item: GuideItem): void {
  guideStore = [...guideStore, item];
}

export function updateGuideItem(id: string, updates: Partial<GuideItem>): void {
  guideStore = guideStore.map(item =>
    item.id === id ? { ...item, ...updates } : item
  );
}

export function deleteGuideItem(id: string): void {
  guideStore = guideStore.filter(item => item.id !== id);
}

// ─── Calendar state ──────────────────────────────────────────────────────────
export function updateDateRangeStatus(
  startDate: string,
  endDate: string,
  status: CalendarStatus,
  note?: string
): void {
  const start = new Date(startDate);
  const end   = new Date(endDate);
  const cur   = new Date(start);

  while (cur <= end) {
    const dateStr = cur.toISOString().split('T')[0];
    calendarStore = {
      ...calendarStore,
      dates: {
        ...calendarStore.dates,
        [dateStr]: { date: dateStr, status, note },
      },
    };
    cur.setDate(cur.getDate() + 1);
  }
}
