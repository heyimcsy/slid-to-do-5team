/**
 * AbortController + 상한 시간 — 무응답 fetch로 인한 서버 리소스 대기 방지.
 * BFF·apiClient 등 서버/Edge에서 공통 사용.
 */
export function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(input, { ...init, signal: controller.signal }).finally(() => {
    clearTimeout(id);
  });
}
