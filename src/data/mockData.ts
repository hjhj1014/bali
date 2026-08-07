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
  name: 'Bali Mom & Kid Stay',
  location: 'Denpasar Selatan, Bali',
  shortDescription: '발리 현지 주택가의 침실 2개·욕실 2개 독채 패밀리 하우스',
  notice: '',  // 관리자 화면에서 입력 — 손님 화면 상단에 표시됨
  description:
    '발리 Denpasar Selatan의 조용한 현지 주택가에 자리한 독채 패밀리 하우스입니다.\n\n' +
    '발리 전통 인테리어와 현대적 편의시설이 어우러진 침실 2개·욕실 2개 구성으로, ' +
    '가족이 여유롭게 지내기에 딱 맞는 크기입니다. ' +
    '완비된 주방에서 로컬 마켓 식재료로 직접 요리하는 발리 일상을 즐겨보세요.\n\n' +
    '바이크로 5분 거리에 국제학교와 키즈 센터가 있고, ' +
    '한국 식재료를 구할 수 있는 롯데마트도 10분이면 닿습니다. ' +
    '아이와 함께하는 중·장기 체류 가족에게 최적의 환경입니다.',
  photos: housePhotos,
  pricePerNight: 0, // 0 = "문의 가격" (price on inquiry)
  maxGuests: 4,
  bedrooms: 2,
  bathrooms: 2,
  amenities: ['와이파이', '에어컨', '완비된주방', '세탁기', '주차장', '정원', '바베큐'],
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
