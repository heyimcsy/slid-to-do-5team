import { buildLoginRedirectUrlAfterUnauthorized } from '@/lib/navigation/loginRedirectOnUnauthorized';

describe('buildLoginRedirectUrlAfterUnauthorized', () => {
  it('/login (쿼리 없음) → /login 단독 — callbackUrl=/login 자기참조 방지', () => {
    expect(buildLoginRedirectUrlAfterUnauthorized({ pathname: '/login', search: '' })).toBe(
      '/login',
    );
  });

  it('/login?callbackUrl=... → 기존 쿼리 유지', () => {
    expect(
      buildLoginRedirectUrlAfterUnauthorized({
        pathname: '/login',
        search: '?callbackUrl=%2Fdashboard',
      }),
    ).toBe('/login?callbackUrl=%2Fdashboard');
  });

  it('보호 경로 → callbackUrl 포함', () => {
    expect(
      buildLoginRedirectUrlAfterUnauthorized({ pathname: '/dashboard', search: '?tab=1' }),
    ).toBe('/login?callbackUrl=%2Fdashboard%3Ftab%3D1');
  });

  it('/signup (쿼리 없음) → /login — callbackUrl=/signup 중복 방지', () => {
    expect(buildLoginRedirectUrlAfterUnauthorized({ pathname: '/signup', search: '' })).toBe(
      '/login',
    );
  });

  it('/signup?callbackUrl=... → 로그인 URL에 쿼리 전달', () => {
    expect(
      buildLoginRedirectUrlAfterUnauthorized({
        pathname: '/signup',
        search: '?callbackUrl=%2Fprofile',
      }),
    ).toBe('/login?callbackUrl=%2Fprofile');
  });
});
