import { Linking, Alert } from 'react-native';

const KAKAO_OPEN_CHAT_URL = 'https://open.kakao.com/o/sW9hPrui';
const WHATSAPP_NUMBER = '821041465081';

export function openKakaoChat() {
  Linking.openURL(KAKAO_OPEN_CHAT_URL).catch(() => {
    Alert.alert(
      '카카오톡 상담',
      '링크를 열 수 없습니다.\n아래 주소로 직접 접속해 주세요:\n\n' + KAKAO_OPEN_CHAT_URL,
      [{ text: '확인' }]
    );
  });
}

export function openWhatsApp() {
  Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}`).catch(() => {
    Alert.alert(
      '왓츠앱 상담',
      '링크를 열 수 없습니다.\n아래 번호로 직접 연락해 주세요:\n\n+82-10-4146-5081',
      [{ text: '확인' }]
    );
  });
}
