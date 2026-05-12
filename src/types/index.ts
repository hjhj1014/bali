export type CalendarStatus =
  | 'available'
  | 'pending'
  | 'booked'
  | 'cancelled'
  | 'maintenance';

export interface Accommodation {
  id: string;
  name: string;
  location: string;
  shortDescription: string;
  description: string;
  photos: (string | number)[];  // string = URL, number = require() asset
  pricePerNight: number;   // 0 = 문의 가격
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  tags: string[];
  kakaoId: string;
}

export interface DateStatus {
  date: string; // YYYY-MM-DD
  status: CalendarStatus;
  note?: string;
}

export interface AccommodationCalendar {
  accommodationId: string;
  dates: Record<string, DateStatus>;
}

export interface GuideItem {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  whyRecommended: string;
  distanceFromHouse: string;
  note: string;
  imageUrl: string;
  googleMapsUrl: string;
  blogUrl: string;        // empty string = no blog link
  visible: boolean;
}

// One accommodation → no IDs needed in nav params
export type RootStackParamList = {
  MainTabs: undefined;
  StayDetail: undefined;
  CalendarView: undefined;
  AdminLogin: undefined;
  AdminHome: undefined;
  AdminEditInfo: undefined;
  AdminEditPhotos: undefined;
  AdminUploadPhotos: undefined;
  AdminCalendarEditor: undefined;
  AdminGuideManager: undefined;
};
