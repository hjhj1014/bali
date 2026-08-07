export type Lang = 'ko' | 'en' | 'id';
export type CalendarStatusKey = 'available' | 'pending' | 'booked' | 'cancelled' | 'maintenance';

const ko = {
  tab: { home: '홈', stays: '숙소', guide: '가이드', contact: '문의' },
  home: {
    tagline: '엄마와 아이의 발리 한달살기',
    viewDetail: '숙소 자세히 보기',
    guests:    (n: number) => `최대 ${n}명`,
    bedrooms:  (n: number) => `침실 ${n}개`,
    bathrooms: (n: number) => `욕실 ${n}개`,
    wifi: '와이파이',
    aboutTitle: '숙소 소개',
    calendarTitle: '예약 가능 날짜 확인',
    calendarSub: '달력에서 날짜별 예약 상황을 확인하세요',
    kakaoTitle: '예약 문의는 카카오톡으로',
    kakaoSub: '빠르고 편하게 상담드립니다 😊',
    kakaoBtn: '카카오톡 상담하기',
  },
  detail: {
    about: '숙소 소개',
    amenities: '편의시설',
    calendarBtn: '예약 가능 달력 보기',
    kakaoBtn: '카카오톡으로 예약 문의',
    whatsappBtn: '💬 왓츠앱으로 문의',
    guests:    (n: number) => `최대 ${n}명`,
    bedrooms:  (n: number) => `침실 ${n}개`,
    bathrooms: (n: number) => `욕실 ${n}개`,
  },
  calendar: {
    title: '예약 가능 달력',
    legendTitle: '상태 안내',
    weekdays: ['일', '월', '화', '수', '목', '금', '토'] as string[],
    months: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] as string[],
    monthLabel: (year: number, month: string) => `${year}년 ${month}`,
    hint: {
      available:   '예약 가능한 날짜입니다. 카카오톡으로 문의해 주세요 😊',
      pending:     '현재 상담 중인 날짜입니다. 카카오톡으로 먼저 연락해 주세요.',
      booked:      '이미 예약이 완료된 날짜입니다.',
      cancelled:   '취소 후 재오픈된 날짜입니다. 카카오톡으로 문의해 보세요.',
      maintenance: '막혀 있는 날짜로 예약이 불가합니다.',
    } as Record<CalendarStatusKey, string>,
  },
  guide: {
    title: '발리 가이드',
    subtitle: '숙소 주변 추천 장소 (바이크 기준)',
    searchPlaceholder: '장소 이름으로 검색하기',
    allCategory: '전체',
    empty: '검색 결과가 없습니다',
    clearSearch: '검색어 지우기',
    mapsBtn: '구글지도에서 보기',
    blogBtn: '블로그 글 보기',
    bikeMin: (n: number) => `바이크 약 ${n}분`,
    categoryNames: {
      '맛집': '맛집', '카페/키즈': '카페/키즈', '키즈': '키즈',
      '학교': '학교', '스포츠': '스포츠', '마트': '마트', '교통': '교통',
    } as Record<string, string>,
    itemDescs: {} as Record<string, string>,
  },
  contact: {
    title: '문의하기',
    subtitle: '궁금한 점은 편하게 물어보세요 😊',
    kakaoCardTitle: '카카오톡으로 바로 상담',
    kakaoCardDesc: '숙소 예약 가능 여부, 가격, 장기 체류 할인 등\n모든 문의를 카카오톡으로 빠르게 답변드려요.',
    kakaoCardBtn: '카카오톡으로 상담하기',
    openchat: '1:1 오픈채팅',
    whatsappCardTitle: '💬 왓츠앱으로 상담',
    whatsappCardDesc: '해외에서 카카오톡이 불편하신 분은\n왓츠앱으로도 편하게 문의하세요.',
    whatsappCardBtn: '왓츠앱으로 상담하기',
    whatsappNumber: '+82-10-4146-5081',
    faqTitle: '자주 묻는 질문',
    hoursTitle: '상담 운영 시간',
    hoursText: '매일 오전 9시 ~ 오후 10시\n(발리 현지 시간 기준 / WITA)',
    faq: [
      { q: '예약은 어떻게 하나요?', a: '카카오톡 채널로 원하는 날짜를 알려주세요. 가용 여부 확인 후 안내드립니다.' },
      { q: '장기 체류 할인이 있나요?', a: '한 달 이상 장기 체류 시 별도 할인이 적용됩니다. 카카오톡으로 문의해 주세요.' },
      { q: '아이와 함께 가기 좋은가요?', a: '저희 숙소는 가족 여행을 기준으로 검증되었습니다. 국제학교, 키즈 센터가 인근에 있습니다.' },
      { q: '공항 픽업은 되나요?', a: '별도 요금으로 공항 픽업 서비스를 연결해 드릴 수 있습니다. 카카오톡으로 문의해 주세요.' },
      { q: '국제학교 정보도 알 수 있나요?', a: '발리 현지 국제학교 정보와 등록 절차에 대해서도 안내드리고 있습니다.' },
    ],
  },
  amenities: {
    '개인수영장': '개인수영장', '와이파이': '와이파이', '에어컨': '에어컨',
    '완비된주방': '완비된주방', '세탁기': '세탁기', '주차장': '주차장',
    '정원': '정원', '바베큐': '바베큐',
  } as Record<string, string>,
};

const en: typeof ko = {
  tab: { home: 'Home', stays: 'Stay', guide: 'Guide', contact: 'Contact' },
  home: {
    tagline: 'A Month in Bali with Mom & Kids',
    viewDetail: 'View Details',
    guests:    (n) => `Up to ${n} guests`,
    bedrooms:  (n) => `${n} bedrooms`,
    bathrooms: (n) => `${n} bathrooms`,
    wifi: 'WiFi',
    aboutTitle: 'About',
    calendarTitle: 'Check Availability',
    calendarSub: 'View the calendar to see available dates',
    kakaoTitle: 'Book via KakaoTalk',
    kakaoSub: 'Fast and easy consultation 😊',
    kakaoBtn: 'Chat on KakaoTalk',
  },
  detail: {
    about: 'About This Place',
    amenities: 'Amenities',
    calendarBtn: 'View Availability Calendar',
    kakaoBtn: 'Inquire via KakaoTalk',
    whatsappBtn: '💬 Inquire via WhatsApp',
    guests:    (n) => `Up to ${n} guests`,
    bedrooms:  (n) => `${n} bedrooms`,
    bathrooms: (n) => `${n} bathrooms`,
  },
  calendar: {
    title: 'Availability Calendar',
    legendTitle: 'Status Guide',
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    monthLabel: (year, month) => `${month} ${year}`,
    hint: {
      available:   'This date is available. Contact us via KakaoTalk 😊',
      pending:     'Consultation in progress. Please contact us via KakaoTalk first.',
      booked:      'This date is already booked.',
      cancelled:   'Re-opened after cancellation. Feel free to inquire via KakaoTalk.',
      maintenance: 'This date is blocked and unavailable for booking.',
    },
  },
  guide: {
    title: 'Bali Guide',
    subtitle: 'Nearby places (by motorbike)',
    searchPlaceholder: 'Search by place name',
    allCategory: 'All',
    empty: 'No results found',
    clearSearch: 'Clear search',
    mapsBtn: 'View on Google Maps',
    blogBtn: 'Read Blog',
    bikeMin: (n) => `~${n} min by bike`,
    categoryNames: {
      '맛집': 'Restaurant', '카페/키즈': 'Cafe / Kids', '키즈': 'Kids',
      '학교': 'School', '스포츠': 'Sports', '마트': 'Mart', '교통': 'Transport',
    },
    itemDescs: {
      g1:  'Authentic Korean restaurant loved by locals.',
      g2:  'Great steakhouse close to the accommodation.',
      g3:  'Kids café with play area — parents relax while kids play.',
      g4:  'Sensory development program center for children.',
      g5:  'Indoor climbing & adventure activities for kids.',
      g6:  'Early learning centre for toddlers in Sanur.',
      g7:  'Nearby international school. Ideal for education-migration families.',
      g8:  'Primary school in the Sanur area.',
      g9:  'Padel courts — fun racket sport for all levels.',
      g10: 'Well-equipped gym. Keep your routine while in Bali.',
      g11: 'Pilates studio in the Renon area.',
      g12: 'Large mart with Korean groceries & daily essentials.',
      g13: 'Bali International Airport.',
    },
  },
  contact: {
    title: 'Contact Us',
    subtitle: 'Feel free to ask anything 😊',
    kakaoCardTitle: 'Chat on KakaoTalk',
    kakaoCardDesc: 'Availability, pricing, long-term stay discounts —\nwe reply quickly via KakaoTalk.',
    kakaoCardBtn: 'Chat on KakaoTalk',
    openchat: '1:1 Open Chat',
    whatsappCardTitle: '💬 Chat on WhatsApp',
    whatsappCardDesc: "Prefer WhatsApp? No problem!\nFeel free to reach us there too.",
    whatsappCardBtn: 'Chat on WhatsApp',
    whatsappNumber: '+82-10-4146-5081',
    faqTitle: 'FAQs',
    hoursTitle: 'Hours',
    hoursText: 'Daily 9 AM – 10 PM\n(Bali time / WITA)',
    faq: [
      { q: 'How do I make a reservation?', a: 'Tell us your preferred dates via KakaoTalk. We will confirm availability and guide you through.' },
      { q: 'Is there a long-term stay discount?', a: 'Yes, discounts apply for stays of one month or more. Please inquire via KakaoTalk.' },
      { q: 'Is it good for families with kids?', a: 'Our property is verified for family travel. International schools and kids centers are nearby.' },
      { q: 'Is airport pickup available?', a: 'Yes, we can arrange it for an additional fee. Please inquire via KakaoTalk.' },
      { q: 'Can I get info on international schools?', a: 'Yes, we can share information on local international schools and enrollment processes.' },
    ],
  },
  amenities: {
    '개인수영장': 'Private Pool', '와이파이': 'WiFi', '에어컨': 'Air Conditioning',
    '완비된주방': 'Full Kitchen', '세탁기': 'Washing Machine', '주차장': 'Parking',
    '정원': 'Garden', '바베큐': 'BBQ',
  },
};

const id: typeof ko = {
  tab: { home: 'Beranda', stays: 'Penginapan', guide: 'Panduan', contact: 'Hubungi' },
  home: {
    tagline: 'Sebulan di Bali bersama Ibu & Anak',
    viewDetail: 'Lihat Detail',
    guests:    (n) => `Maks. ${n} tamu`,
    bedrooms:  (n) => `${n} kamar tidur`,
    bathrooms: (n) => `${n} kamar mandi`,
    wifi: 'WiFi',
    aboutTitle: 'Tentang',
    calendarTitle: 'Cek Ketersediaan',
    calendarSub: 'Lihat kalender untuk tanggal yang tersedia',
    kakaoTitle: 'Pesan via KakaoTalk',
    kakaoSub: 'Konsultasi cepat dan mudah 😊',
    kakaoBtn: 'Chat di KakaoTalk',
  },
  detail: {
    about: 'Tentang Tempat Ini',
    amenities: 'Fasilitas',
    calendarBtn: 'Lihat Kalender Ketersediaan',
    kakaoBtn: 'Tanya via KakaoTalk',
    whatsappBtn: '💬 Tanya via WhatsApp',
    guests:    (n) => `Maks. ${n} tamu`,
    bedrooms:  (n) => `${n} kamar tidur`,
    bathrooms: (n) => `${n} kamar mandi`,
  },
  calendar: {
    title: 'Kalender Ketersediaan',
    legendTitle: 'Keterangan Status',
    weekdays: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
    months: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],
    monthLabel: (year, month) => `${month} ${year}`,
    hint: {
      available:   'Tanggal ini tersedia. Hubungi kami via KakaoTalk 😊',
      pending:     'Sedang dalam konsultasi. Hubungi kami via KakaoTalk terlebih dahulu.',
      booked:      'Tanggal ini sudah dipesan.',
      cancelled:   'Dibuka kembali setelah pembatalan. Silakan tanya via KakaoTalk.',
      maintenance: 'Tanggal ini diblokir dan tidak tersedia untuk pemesanan.',
    },
  },
  guide: {
    title: 'Panduan Bali',
    subtitle: 'Tempat-tempat terdekat (naik motor)',
    searchPlaceholder: 'Cari berdasarkan nama tempat',
    allCategory: 'Semua',
    empty: 'Tidak ada hasil',
    clearSearch: 'Hapus pencarian',
    mapsBtn: 'Lihat di Google Maps',
    blogBtn: 'Baca Blog',
    bikeMin: (n) => `~${n} mnt motor`,
    categoryNames: {
      '맛집': 'Restoran', '카페/키즈': 'Kafe / Anak', '키즈': 'Anak-anak',
      '학교': 'Sekolah', '스포츠': 'Olahraga', '마트': 'Supermarket', '교통': 'Transportasi',
    },
    itemDescs: {
      g1:  'Restoran Korea autentik, favorit warga lokal.',
      g2:  'Steakhouse nyaman, dekat dari penginapan.',
      g3:  'Kafe anak dengan area bermain — orang tua santai, anak bermain.',
      g4:  'Pusat program pengembangan sensorik untuk anak.',
      g5:  'Panjat tebing dalam ruangan & aktivitas petualangan untuk anak.',
      g6:  'Pusat belajar dini untuk balita di Sanur.',
      g7:  'Sekolah internasional terdekat. Ideal untuk keluarga yang pindah karena pendidikan.',
      g8:  'Sekolah dasar di area Sanur.',
      g9:  'Lapangan padel — olahraga raket yang menyenangkan.',
      g10: 'Gym lengkap. Tetap aktif selama di Bali.',
      g11: 'Studio pilates di area Renon.',
      g12: 'Supermarket besar dengan bahan makanan Korea & kebutuhan sehari-hari.',
      g13: 'Bandara Internasional Bali.',
    },
  },
  contact: {
    title: 'Hubungi Kami',
    subtitle: 'Jangan ragu untuk bertanya 😊',
    kakaoCardTitle: 'Chat di KakaoTalk',
    kakaoCardDesc: 'Ketersediaan, harga, diskon menginap lama —\nkami balas cepat via KakaoTalk.',
    kakaoCardBtn: 'Chat di KakaoTalk',
    openchat: 'Open Chat 1:1',
    whatsappCardTitle: '💬 Chat di WhatsApp',
    whatsappCardDesc: 'Lebih nyaman pakai WhatsApp?\nHubungi kami di sana juga.',
    whatsappCardBtn: 'Chat di WhatsApp',
    whatsappNumber: '+82-10-4146-5081',
    faqTitle: 'Pertanyaan Umum',
    hoursTitle: 'Jam Operasional',
    hoursText: 'Setiap hari pukul 09.00 – 22.00\n(Waktu Bali / WITA)',
    faq: [
      { q: 'Bagaimana cara memesan?', a: 'Beritahu kami tanggal yang diinginkan via KakaoTalk. Kami akan konfirmasi ketersediaan.' },
      { q: 'Ada diskon menginap lama?', a: 'Ya, ada diskon untuk menginap satu bulan atau lebih. Tanyakan via KakaoTalk.' },
      { q: 'Cocok untuk keluarga dengan anak?', a: 'Properti kami diverifikasi untuk liburan keluarga. Sekolah internasional & pusat anak ada di dekatnya.' },
      { q: 'Apakah tersedia antar-jemput bandara?', a: 'Ya, kami bisa atur dengan biaya tambahan. Tanyakan via KakaoTalk.' },
      { q: 'Bisakah mendapat info sekolah internasional?', a: 'Ya, kami bisa berbagi info sekolah internasional lokal dan proses pendaftarannya.' },
    ],
  },
  amenities: {
    '개인수영장': 'Kolam Renang Pribadi', '와이파이': 'WiFi', '에어컨': 'AC',
    '완비된주방': 'Dapur Lengkap', '세탁기': 'Mesin Cuci', '주차장': 'Parkir',
    '정원': 'Taman', '바베큐': 'BBQ',
  },
};

// ── Accommodation descriptions (translated) ────────────────────────────────
export const accTranslations = {
  ko: {
    name: 'Bali Mom & Kid Stay',
    shortDesc: '발리 현지 주택가의 침실 2개·욕실 2개 독채 패밀리 하우스',
    desc:
      '발리 Denpasar Selatan의 조용한 현지 주택가에 자리한 독채 패밀리 하우스입니다.\n\n' +
      '발리 전통 인테리어와 현대적 편의시설이 어우러진 침실 2개·욕실 2개 구성으로, ' +
      '가족이 여유롭게 지내기에 딱 맞는 크기입니다. ' +
      '완비된 주방에서 로컬 마켓 식재료로 직접 요리하는 발리 일상을 즐겨보세요.\n\n' +
      '바이크로 5분 거리에 국제학교와 키즈 센터가 있고, ' +
      '한국 식재료를 구할 수 있는 롯데마트도 10분이면 닿습니다. ' +
      '아이와 함께하는 중·장기 체류 가족에게 최적의 환경입니다.',
  },
  en: {
    name: 'Bali Mom & Kid Stay',
    shortDesc: 'Standalone family house in Denpasar Selatan, Bali — 2 bedrooms & 2 bathrooms',
    desc:
      'A standalone family house nestled in a quiet local neighborhood of Denpasar Selatan, Bali.\n\n' +
      'Featuring 2 bedrooms and 2 bathrooms with a blend of Balinese traditional decor and modern amenities — ' +
      'just the right size for a family to stay comfortably. ' +
      'Enjoy the Bali lifestyle by cooking fresh local market ingredients in the fully equipped kitchen.\n\n' +
      'An international school and kids center are just 5 minutes away by motorbike, ' +
      'and LOTTE Mart (Korean groceries & daily essentials) is only 10 minutes away. ' +
      'The perfect base for families on a mid to long-term stay with children.',
  },
  id: {
    name: 'Bali Mom & Kid Stay',
    shortDesc: 'Rumah keluarga mandiri di Denpasar Selatan, Bali — 2 kamar tidur & 2 kamar mandi',
    desc:
      'Rumah keluarga mandiri di lingkungan lokal yang tenang di Denpasar Selatan, Bali.\n\n' +
      'Dilengkapi 2 kamar tidur dan 2 kamar mandi dengan perpaduan dekorasi Bali tradisional dan fasilitas modern — ' +
      'ukuran yang pas untuk keluarga tinggal dengan nyaman. ' +
      'Nikmati gaya hidup Bali dengan memasak bahan-bahan segar dari pasar lokal di dapur yang lengkap.\n\n' +
      'Sekolah internasional dan pusat anak hanya 5 menit naik motor, ' +
      'dan LOTTE Mart (bahan makanan Korea & kebutuhan sehari-hari) hanya 10 menit. ' +
      'Pilihan sempurna untuk keluarga yang menginap jangka menengah hingga panjang bersama anak-anak.',
  },
};

export const translations = { ko, en, id };
export type Translations = typeof ko;
