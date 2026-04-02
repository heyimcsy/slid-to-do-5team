/**
 * Node 환경(`window` 없음)에서 `@/lib/apiClient`의 `use*` 동작.
 *
 * - **실제 Server Component**에서는 이 모듈을 CC에 넣지 않는 한 `cookies` 번들 이슈 없음.
 * - 여기서 검증하는 것은 **브라우저 바렐**의 `use*`가 `assertInterceptorClientOnly`로
 *   `window` 없을 때 등록을 막는지(SSR/테스트·Node와 동일).
 * - `apiClient.server`의 서버 인스턴스는 `allowGlobalInterceptorRegistration: false`로
 *   별도 즉시 throw — 그건 `apiClient.test.ts`의 `createApiClient` 테스트 참고.
 *
 * @jest-environment node
 */
import {
  useErrorInterceptor,
  useRequestInterceptor,
  useResponseInterceptor,
} from '@/lib/apiClient';

describe('전역 인터셉터 — Node에서 window 없을 때 (브라우저 바렐 use*)', () => {
  it('useRequestInterceptor → 클라이언트 전용 에러', () => {
    expect(() => useRequestInterceptor((i) => i)).toThrow(/클라이언트 전용/);
  });

  it('useResponseInterceptor → 클라이언트 전용 에러', () => {
    expect(() => useResponseInterceptor((_r, d) => d)).toThrow(/클라이언트 전용/);
  });

  it('useErrorInterceptor → 클라이언트 전용 에러', () => {
    expect(() => useErrorInterceptor(() => {})).toThrow(/클라이언트 전용/);
  });
});
