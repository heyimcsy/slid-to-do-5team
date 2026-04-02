import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { clearOAuthUserFlashCookie } from '@/lib/auth/cookies';
import { COOKIE_OAUTH_USER_FLASH } from '@/lib/auth/oauth-urls';
import { userSchema } from '@/lib/auth/schemas/user';

/**
 * OAuth 콜백에서 설정한 일회용 `oauth_user_flash` 쿠키를 읽어 `user`를 반환하고 쿠키는 삭제한다.
 * HttpOnly + path 등은 콜백과 동일한 Set-Cookie로 만료해야 브라우저가 키를 제거함 (`cookies().delete`만으로는 불충분할 수 있음).
 */
export async function POST() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_OAUTH_USER_FLASH)?.value;

  if (!raw) {
    return NextResponse.json(
      { success: false as const, message: '동기화할 사용자 정보가 없습니다.' },
      { status: 404 },
    );
  }

  const withFlashCleared = <T>(body: T, init?: ResponseInit) => {
    const res = NextResponse.json(body, init);
    clearOAuthUserFlashCookie(res);
    return res;
  };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return withFlashCleared(
      { success: false as const, message: '사용자 정보 형식 오류' },
      { status: 400 },
    );
  }

  const parsedUser = userSchema.safeParse(parsed);
  if (!parsedUser.success) {
    return withFlashCleared(
      { success: false as const, message: '사용자 정보 형식 오류' },
      { status: 400 },
    );
  }

  return withFlashCleared({ success: true as const, user: parsedUser.data });
}
