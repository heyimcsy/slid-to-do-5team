/**
 * percent-encoding 된 `callbackUrl` 쿼리 파라미터 원시값 상한.
 *
 * [근거]
 * - OAuth state 페이로드에 포함되므로 Google(2,048) 등 공급자 한계를 고려.
 * - 실제 내부 경로가 이 길이를 넘길 일은 없으므로 512로 충분.
 */
export const SAFE_CALLBACK_RAW_MAX_LENGTH = 512;

/**
 * 디코딩된 내부 경로 최대 길이.
 *
 * [근거]
 * - 쿼리스트링 포함 복잡한 경로도 300자 이하가 현실적 상한.
 * - 공격 표면 최소화를 위해 500으로 제한.
 */
export const SAFE_CALLBACK_PATH_MAX_LENGTH = 500;

/**
 * @param raw - URL에서 추출한 원시 문자열.
 *   - `searchParams.get()`처럼 이미 1회 디코딩된 값이면 isAlreadyDecoded: true 전달.
 *   - raw query string에서 직접 추출한 경우 false (기본값).
 */
export function getSafeCallbackPath(
  raw: string | null,
  { isAlreadyDecoded = false } = {},
): string | null {
  if (raw == null) return null;

  const trimmed = raw.trim();
  if (!trimmed) return null;

  // [1] 원시 길이 체크 (encoded 기준)
  if (trimmed.length > SAFE_CALLBACK_RAW_MAX_LENGTH) return null;

  // [2] 이중 인코딩 차단 — %25 자체가 포함된 경우 우회 시도로 간주
  //     decoded 후 %2F → // 가 되는 패턴을 원천 차단
  if (trimmed.includes('%25')) return null;

  // [3] 디코딩
  let decoded: string;
  try {
    decoded = isAlreadyDecoded ? trimmed : decodeURIComponent(trimmed);
  } catch {
    return null;
  }

  // [4] 디코딩된 경로 길이 체크
  if (decoded.length > SAFE_CALLBACK_PATH_MAX_LENGTH) return null;

  // [5] CRLF Injection 방지
  if (/[\r\n]/.test(decoded)) return null;

  // [6] Null byte 방지
  if (decoded.includes('\0')) return null;

  // [7] 오픈 리다이렉트 방지 — 동일 출처 상대 경로만 허용
  if (!decoded.startsWith('/')) return null; // 절대 URL 차단
  if (decoded.startsWith('//')) return null; // protocol-relative URL 차단
  if (decoded.includes('://')) return null; // 경로 중간의 절대 URL 차단

  return decoded;
}
