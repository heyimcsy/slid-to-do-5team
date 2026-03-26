/**
 * @jest-environment jsdom
 */
import { useTokenRefreshOnMount } from '@/hooks/auth/useTokenRefreshOnMount';
import { act, renderHook, waitFor } from '@testing-library/react';

jest.mock('@/constants/auth-config', () => ({
  AUTH_CONFIG: { REFRESH_CHECK_INTERVAL_MS: 5_000 },
}));

/**
 * @description `useTokenRefreshOnMount` 훅 테스트
 * @note `useTokenRefreshOnMount` 훅은 마운트 시 + 일정 간격으로 `/api/auth/refresh` 호출하여 access_token 만료 직전 자동 갱신을 담당합니다.
 * @note 이 훅은 클라이언트에서 명시적으로 `/api/auth/refresh`를 호출하여 갱신을 트리거합니다.
 * @note SPA 장시간 사용 시 마운트 1회만으로는 부족하므로 주기적 호출 추가합니다.
 * @note `setInterval` 대신 **이전 요청 완료 후** 다음 간격을 잡습니다. refresh 토큰 회전 시 POST가 겹치며
 *       쿠키가 꼬이거나 이미 소진된 refresh로 두 번째 요청이 나가는 것을 방지 (BFF 쿠키 세션과 정합).
 */
describe('useTokenRefreshOnMount', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    jest.useFakeTimers();
    globalThis.fetch = jest.fn().mockResolvedValue({ ok: true, status: 200 });
  });

  afterEach(() => {
    jest.useRealTimers();
    globalThis.fetch = originalFetch;
  });

  it('첫 요청이 끝나기 전에 interval만 경과해도 두 번째 fetch는 나가지 않음', async () => {
    // Arrange: 첫 fetch만 지연되도록 Promise 수동 resolve
    let resolveFirst!: (v: unknown) => void;
    const firstPromise = new Promise((r) => {
      resolveFirst = r;
    });
    (globalThis.fetch as jest.Mock).mockImplementationOnce(() => firstPromise);

    // Act: 훅 마운트 → 즉시 첫 /api/auth/refresh
    renderHook(() => useTokenRefreshOnMount());

    // Assert: 첫 fetch 호출 확인
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    // Act: interval 시간만 경과(첫 요청은 아직 pending)
    jest.advanceTimersByTime(5_000);

    // Assert: 직렬화로 두 번째 fetch는 아직 없음
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    // Act: 첫 fetch 완료 → finally에서 다음 주기 setTimeout만 예약
    await act(async () => {
      resolveFirst(undefined);
      await Promise.resolve();
    });

    // Assert: 아직 interval 전이라 두 번째 호출 없음
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    // Act: 다음 주기 타이머 호출
    await act(async () => {
      jest.advanceTimersByTime(5_000);
    });

    // Assert: 두 번째 fetch 실행
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it('첫 요청 완료 후 interval 경과 시에만 다음 fetch', async () => {
    // Arrange: beforeEach의 즉시 resolve fetch 사용(추가 설정 없음)

    // Act: 훅 마운트
    renderHook(() => useTokenRefreshOnMount());

    // Assert: 마운트 직후 1회 호출
    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));

    // Act: interval 경과
    await act(async () => {
      jest.advanceTimersByTime(5_000);
    });

    // Assert: 두 번째 주기에서 2회째 호출
    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(2));
  });

  it('401(세션 없음)이면 이후 주기에서 fetch를 반복하지 않음', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 401 });

    renderHook(() => useTokenRefreshOnMount());

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));

    await act(async () => {
      jest.advanceTimersByTime(5_000);
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });
});
