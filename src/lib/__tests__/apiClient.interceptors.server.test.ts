/**
 * jsdom이 아닌 Node에서만 `window`가 없어 서버 전용 가드가 동작함.
 * @jest-environment node
 */
import {
  useErrorInterceptor,
  useRequestInterceptor,
  useResponseInterceptor,
} from '@/lib/apiClient';

describe('전역 인터셉터 등록 API (서버에서 호출 시)', () => {
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
