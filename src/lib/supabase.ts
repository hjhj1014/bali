import { createClient } from '@supabase/supabase-js';

// sb_publishable_ 로 시작하는 키 = 클라이언트용 공개 키 (노출 OK)
// sb_secret_ 로 시작하는 키는 절대 여기에 넣으면 안 됨
export const supabase = createClient(
  'https://ztlbffofpwxashokhnuj.supabase.co',
  'sb_publishable_키를_여기에_붙여넣기'  // ← 본인 키로 교체
);
