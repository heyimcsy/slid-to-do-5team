/**
 * @jest-environment node
 */
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';

describe('fetchWithTimeout', () => {
  const origFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = origFetch;
    jest.useRealTimers();
  });

  it('호출자 signal abort 시 fetch가 거부된다', async () => {
    // Arrange: fetch 모킹
    globalThis.fetch = jest.fn((_input: RequestInfo | URL, init?: RequestInit) => {
      const sig = init?.signal;
      if (!sig) return Promise.reject(new Error('no signal'));
      return new Promise<Response>((_resolve, reject) => {
        const onAbort = () => reject(new DOMException('Aborted', 'AbortError'));
        if (sig.aborted) {
          onAbort();
          return;
        }
        sig.addEventListener('abort', onAbort, { once: true });
      });
    });
    const user = new AbortController();

    // Act: fetchWithTimeout 호출
    const p = fetchWithTimeout('http://example.test', { signal: user.signal }, 60_000);
    user.abort();

    // Assert: fetch가 거부되었음을 확인
    await expect(p).rejects.toMatchObject({ name: 'AbortError' });
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('타임아웃 시 fetch가 거부된다', async () => {
    // Arrange: fetch 모킹
    jest.useFakeTimers();
    globalThis.fetch = jest.fn((_input: RequestInfo | URL, init?: RequestInit) => {
      const sig = init?.signal;
      if (!sig) return Promise.reject(new Error('no signal'));
      return new Promise<Response>((_resolve, reject) => {
        const onAbort = () => reject(new DOMException('Aborted', 'AbortError'));
        if (sig.aborted) {
          onAbort();
          return;
        }
        sig.addEventListener('abort', onAbort, { once: true });
      });
    });

    // Act: fetchWithTimeout 호출
    const p = fetchWithTimeout('http://example.test', undefined, 1000);
    jest.advanceTimersByTime(1000);

    // Assert: fetch가 거부되었음을 확인
    await expect(p).rejects.toMatchObject({ name: 'AbortError' });
  });
});
