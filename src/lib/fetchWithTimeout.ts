/**
 * 타임아웃용 signal과 호출자 `signal`을 하나로 합친다.
 * `AbortSignal.any` 미지원 런타임에서는 양쪽 abort 이벤트를 전달용 `AbortController`로 묶는다.
 */
function mergeAbortSignals(
  timeoutSignal: AbortSignal,
  userSignal: AbortSignal | undefined | null,
): AbortSignal {
  if (userSignal == null) {
    return timeoutSignal;
  }
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.any === 'function') {
    return AbortSignal.any([timeoutSignal, userSignal]);
  }
  const merged = new AbortController();
  const forward = () => {
    if (!merged.signal.aborted) merged.abort();
  };
  if (timeoutSignal.aborted || userSignal.aborted) {
    merged.abort();
    return merged.signal;
  }
  timeoutSignal.addEventListener('abort', forward, { once: true });
  userSignal.addEventListener('abort', forward, { once: true });
  return merged.signal;
}

/**
 * AbortController + 상한 시간 — 무응답 fetch로 인한 서버 리소스 대기 방지.
 * BFF·apiClient 등 서버/Edge에서 공통 사용.
 *
 * `init.signal`이 있으면 타임아웃과 **병합**되어, 호출자 취소와 시간 초과 어느 쪽이든 fetch가 중단된다.
 */
export function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  const { signal: userSignal, ...rest } = init ?? {};
  const signal = mergeAbortSignals(controller.signal, userSignal);

  return fetch(input, { ...rest, signal }).finally(() => {
    clearTimeout(id);
  });
}
