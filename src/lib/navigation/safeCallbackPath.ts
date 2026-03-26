/**
 * 로그인 후 이동할 내부 경로만 허용 (오픈 리다이렉트 방지).
 * 동일 출처 상대 경로(`/`로 시작, `//` 금지)만 통과.
 */
export function getSafeCallbackPath(raw: string | null): string | null {
  if (raw == null) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  let decoded: string;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    return null;
  }
  if (!decoded.startsWith('/') || decoded.startsWith('//')) return null;
  if (decoded.includes('://')) return null;
  return decoded;
}
