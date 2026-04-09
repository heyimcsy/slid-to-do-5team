import { z } from 'zod';

/** Google OAuth — GSI Token Client로 받은 액세스 토큰을 BFF로 넘길 때 */
export const googleOAuthBodySchema = z.object({
  accessToken: z.string().min(1, 'accessToken이 비어 있습니다.'),
});

export type GoogleOAuthBody = z.infer<typeof googleOAuthBodySchema>;

/** Kakao — REST API SDK `Auth.login` 성공 시 받은 액세스 토큰 */
export const kakaoOAuthBodySchema = z.object({
  accessToken: z.string().min(1, 'accessToken이 비어 있습니다.'),
});

export type KakaoOAuthBody = z.infer<typeof kakaoOAuthBodySchema>;

/** `OAUTH_PROVIDER_COOKIE_KEY` 쿠키 값 — setter는 리터럴만, reader는 safeParse */
export const oauthProviderCookieSchema = z.enum(['google', 'kakao']);

export type OauthProviderCookieValue = z.infer<typeof oauthProviderCookieSchema>;
