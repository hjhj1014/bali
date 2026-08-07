import { Linking, Alert, Platform } from 'react-native';

const KAKAO_OPEN_CHAT_URL = 'https://open.kakao.com/o/sW9hPrui';
const WHATSAPP_NUMBER = '821041465081';

function openUrl(url: string, errorMsg: string) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.open(url, '_blank');
  } else {
    Linking.openURL(url).catch(() => Alert.alert('오류', errorMsg, [{ text: '확인' }]));
  }
}

export function openKakaoChat() {
  openUrl(KAKAO_OPEN_CHAT_URL, '링크를 열 수 없습니다.\n' + KAKAO_OPEN_CHAT_URL);
}

export function openWhatsApp() {
  openUrl(`https://wa.me/${WHATSAPP_NUMBER}`, '링크를 열 수 없습니다.\n+82-10-4146-5081');
}
