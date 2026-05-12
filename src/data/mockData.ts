import { Platform } from 'react-native';
import { Accommodation, AccommodationCalendar } from '../types';

// Web (Netlify): photos served from /images/ — put bali1.jpg–bali5.jpg in public/images/
// Native (Expo Go): Unsplash fallback until local assets are configured
const housePhotos: (string | number)[] = Platform.OS === 'web'
  ? [
      '/images/bali1.jpg',
      '/images/bali2.jpg',
      '/images/bali3.jpg',
      '/images/bali4.jpg',
      '/images/bali5.jpg',
    ]
  : [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800',
    ];

export const HOUSE_ID = 'bali-cozy-house';

export const initialAccommodation: Accommodation = {
  id: HOUSE_ID,
  name: 'Bali Cozy House',
  location: 'Sanur, Bali',
  shortDescription: '발리 Sanur의 조용한 주택가에 자리한 아늑한 패밀리 하우스',
  notice: '',  // 관리자 화면에서 입력 — 손님 화면 상단에 표시됨
  description:
    'Bali Cozy House는 발리 Sanur의 한적한 골목길에 위치한 따뜻한 가족 숙소입니다.\n\n' +
    '넓은 정원과 개인 수영장을 갖추고 있어 아이들이 안전하게 뛰어놀 수 있으며, ' +
    '완비된 주방 덕분에 발리 로컬 마켓에서 장을 봐 직접 요리하는 즐거움도 누릴 수 있습니다.\n\n' +
    '국제학교, 레스토랑, 편의점 모두 도보 거리에 있어 장기 체류 가족들에게 최적입니다. ' +
    '조용한 주택가 분위기 속에서 발리의 일상을 온전히 경험해 보세요.',
  photos: housePhotos,
  pricePerNight: 0, // 0 = "문의 가격" (price on inquiry)
  maxGuests: 4,
  bedrooms: 2,
  bathrooms: 1,
  amenities: ['개인수영장', '와이파이', '에어컨', '완비된주방', '세탁기', '주차장', '정원', '바베큐'],
  tags: ['가족맞춤', '학교근처', '조용한동네', '장기체류'],
  kakaoId: 'mamibalistay',
};

// Build 90-day calendar with sample statuses
export function buildInitialCalendar(): AccommodationCalendar {
  const dates: AccommodationCalendar['dates'] = {};
  const today = new Date();

  const blocks: Array<{ start: number; end: number; status: AccommodationCalendar['dates'][string]['status'] }> = [
    { start: 3,  end: 6,  status: 'booked' },
    { start: 10, end: 11, status: 'pending' },
    { start: 18, end: 21, status: 'booked' },
    { start: 25, end: 25, status: 'maintenance' },
    { start: 32, end: 37, status: 'booked' },
    { start: 44, end: 45, status: 'pending' },
    { start: 52, end: 57, status: 'booked' },
    { start: 63, end: 63, status: 'cancelled' },
    { start: 70, end: 74, status: 'booked' },
    { start: 82, end: 83, status: 'pending' },
  ];

  for (let i = 0; i < 90; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    let status: AccommodationCalendar['dates'][string]['status'] = 'available';
    for (const b of blocks) {
      if (i >= b.start && i <= b.end) { status = b.status; break; }
    }
    dates[dateStr] = { date: dateStr, status };
  }

  return { accommodationId: HOUSE_ID, dates };
}
