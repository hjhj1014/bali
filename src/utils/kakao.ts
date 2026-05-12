import { Linking, Alert } from 'react-native';

const KAKAO_OPEN_CHAT_URL = 'https://open.kakao.com/o/sW9hPrui';

/**
 * Opens the KakaoTalk 1:1 open chat link.
 * Works on both native (iOS/Android) and web —
 * the https URL is opened by the system browser,
 * which hands off to the KakaoTalk app if installed.
 */
export function openKakaoChat() {
  Linking.openURL(KAKAO_OPEN_CHAT_URL).catch(() => {
    Alert.alert(
      '카카오톡 상담',
      '링크를 열 수 없습니다.\n아래 주소로 직접 접속해 주세요:\n\n' + KAKAO_OPEN_CHAT_URL,
      [{ text: '확인' }]
    );
  });
}
