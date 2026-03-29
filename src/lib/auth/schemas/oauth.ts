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
