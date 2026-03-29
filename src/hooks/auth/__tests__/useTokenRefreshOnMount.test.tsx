/**
 * @jest-environment jsdom
 */
import { useTokenRefreshOnMount } from '@/hooks/auth/useTokenRefreshOnMount';
import { act, renderHook, waitFor } from '@testing-library/react';

/** jsdom은 `location.href` 할당 시 "Not implemented: navigation" — 리다이렉트만 스텁 */
jest.mock('@/lib/auth/logoutAndRedirect', () => ({
  logoutAndRedirect: jest.fn(),
}));

/**
 * @description `useTokenRefreshOnMount` 훅 테스트
 * @note 마운트 시 1회 + visibilitychange(탭 복귀) 시 `/api/auth/refresh`를 호출하여 세션을 검증한다.
 * @note 주기적 polling 대신 탭 복귀 이벤트 기반으로 동작하며, 60초 디바운스로 스팸을 방지한다.
 */
describe('useTokenRefreshOnMount', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    jest.useFakeTimers();
    /** 비 auth-flow 경로 — `/login`·`/signup`이 아닌 곳에서 마운트 refresh가 돈다 */
    window.history.pushState({}, '', '/dashboard');
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    globalThis.fetch = originalFetch;
  });

  /** visibilitychange 이벤트를 발생시키며 visibilityState를 설정 */
  function simulateVisibilityChange(state: 'visible' | 'hidden') {
    Object.defineProperty(document, 'visibilityState', {
      value: state,
      writable: true,
      configurable: true,
    });
    document.dispatchEvent(new Event('visibilitychange'));
  }

  it('/login 에서는 마운트 시 refresh를 호출하지 않음', async () => {
    window.history.pushState({}, '', '/login');
    renderHook(() => useTokenRefreshOnMount());
    await act(async () => {});
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('홈(/)에서는 마운트 시 refresh를 호출하지 않음', async () => {
    window.history.pushState({}, '', '/');
    renderHook(() => useTokenRefreshOnMount());
    await act(async () => {});
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('/signup 에서는 마운트 시 refresh를 호출하지 않음', async () => {
    window.history.pushState({}, '', '/signup');
    renderHook(() => useTokenRefreshOnMount());
    await act(async () => {});
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('마운트 시 즉시 1회 fetch 호출', async () => {
    renderHook(() => useTokenRefreshOnMount());

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));
    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/auth/refresh',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
      }),
    );
  });

  it('탭 복귀(visibilitychange → visible) 시 디바운스 간격(60초) 이후에만 재호출', async () => {
    renderHook(() => useTokenRefreshOnMount());

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));

    // 탭 복귀 — 아직 60초 미경과 → fetch 안 됨
    await act(async () => {
      simulateVisibilityChange('hidden');
      simulateVisibilityChange('visible');
    });
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    // 60초 경과 후 탭 복귀 → fetch 호출
    jest.advanceTimersByTime(60_000);
    await act(async () => {
      simulateVisibilityChange('hidden');
      simulateVisibilityChange('visible');
    });

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(2));
  });

  it('401(세션 없음)이면 탭 복귀해도 fetch를 반복하지 않음', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
    });

    renderHook(() => useTokenRefreshOnMount());

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));

    // 60초 경과 후 탭 복귀해도 sessionPaused라 호출 안 됨
    jest.advanceTimersByTime(60_000);
    await act(async () => {
      simulateVisibilityChange('hidden');
      simulateVisibilityChange('visible');
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('첫 요청이 진행 중일 때 visibilitychange가 발생해도 중복 fetch하지 않음', async () => {
    let resolveFirst!: (v: unknown) => void;
    const firstPromise = new Promise((r) => {
      resolveFirst = r;
    });
    (globalThis.fetch as jest.Mock).mockImplementationOnce(() => firstPromise);

    renderHook(() => useTokenRefreshOnMount());

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    // 첫 요청 pending 중 탭 복귀 → in-flight guard로 중복 방지
    jest.advanceTimersByTime(60_000);
    await act(async () => {
      simulateVisibilityChange('hidden');
      simulateVisibilityChange('visible');
    });
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    // 첫 요청 완료
    await act(async () => {
      resolveFirst({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });
    });

    // 이제 탭 복귀 시 호출 가능
    jest.advanceTimersByTime(60_000);
    await act(async () => {
      simulateVisibilityChange('hidden');
      simulateVisibilityChange('visible');
    });

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(2));
  });

  it('언마운트 시 visibilitychange 리스너가 제거됨', async () => {
    const { unmount } = renderHook(() => useTokenRefreshOnMount());

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));

    unmount();

    jest.advanceTimersByTime(60_000);
    await act(async () => {
      simulateVisibilityChange('hidden');
      simulateVisibilityChange('visible');
    });

    // 언마운트 후에는 추가 호출 없음
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });
});
