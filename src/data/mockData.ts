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
  name: 'Sanur Mom & Kids House',
  location: 'Sanur, Bali',
  shortDescription: '아이와 엄마를 위해 직접 만든 사누르의 2베드룸 정원 하우스',
  notice: '',  // 관리자 화면에서 입력 — 손님 화면 상단에 표시됨
  description:
    '사누르의 조용한 동네에 자리한 2베드룸 독채 정원 하우스입니다.\n\n' +
    '아이와 함께 발리에서 여행보다 조금 더 오래 살아보고 싶은 가족을 위해, ' +
    '실제로 아이와 생활하면서 하나씩 만들어 온 집입니다. ' +
    '완비된 주방, 영어·한국어 어린이 책, 미술·창작 공간, 프라이빗 정원이 갖춰져 있습니다.\n\n' +
    '바이크로 10분 이내에 국제학교와 키즈 센터가 있고, ' +
    '한국 식재료를 구할 수 있는 롯데마트도 가깝습니다.',
  photos: housePhotos,
  pricePerNight: 0, // 0 = "문의 가격" (price on inquiry)
  maxGuests: 4,
  bedrooms: 2,
  bathrooms: 2,
  amenities: [
    '와이파이', '에어컨', '완비된주방', '세탁기', '주차장',
    '정원', '바베큐', '거실', '영어한국어책', '미술창작공간', '키즈식기',
  ],
  tags: ['가족맞춤', '학교근처', '조용한동네', '장기체류'],
  kakaoId: 'mamibalistay',
};

// Build 90-day calendar: booked before 2026-08-28, available from 2026-08-28
export function buildInitialCalendar(): AccommodationCalendar {
  const dates: AccommodationCalendar['dates'] = {};
  const today = new Date();
  const openDate = new Date('2026-08-28');

  for (let i = 0; i < 90; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const status: AccommodationCalendar['dates'][string]['status'] =
      d < openDate ? 'booked' : 'available';
    dates[dateStr] = { date: dateStr, status };
  }

  return { accommodationId: HOUSE_ID, dates };
}
