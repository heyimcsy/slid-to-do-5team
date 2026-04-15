/**
 * `ALLOWED_ORIGINS` 항목이 `Origin` 헤더 값과 맞는지(Origin이 ALLOWED_ORIGINS에 속한 값인지) 확인.
 * - 리터럴: `===` 또는 `startsWith(entry + '/')` (기존 동작)
 * - `*` 포함(예: `https://*.ngrok-free.app`): `*` 는 호스트 내 **한 라벨**(점 없음)에 대응
 *
 */
export function originMatchesAllowedEntry(allowed: string, candidateOrigin: string): boolean {
  if (!allowed.includes('*')) {
    return candidateOrigin === allowed || candidateOrigin.startsWith(allowed + '/');
  }
  try {
    const parts = allowed.split('*');
    const escaped = parts.map((p) => p.replace(/[.+?^${}()|[\]\\]/g, '\\$&'));
    return new RegExp(`^${escaped.join('[^.]+')}$`).test(candidateOrigin);
  } catch {
    return false;
  }
}
