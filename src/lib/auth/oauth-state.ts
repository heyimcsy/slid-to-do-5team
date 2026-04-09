;
/**
 * Node.js Runtime 전용.
 *
 * OAuth state 서명/검증에 `node:crypto` 등 Node.js 전용 API를 사용합니다.
 * Edge Runtime 또는 Edge에서 번들되는 경로에서 이 모듈을 import 하지 마세요.
 */
import 'server-only';



import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';



import { getSafeCallbackPath } from '@/lib/navigation/safeCallbackPath';



import { NO_GOOGLE_CLIENT_SECRET_MESSAGE_KO, NO_KAKAO_CLIENT_SECRET_MESSAGE_KO } from '@/constants/error-message';





/**
 * OAuth `state` 유효 시간(10분).
 * - 너무 길면 탈취/재사용 윈도우가 늘어나고
 * - 너무 짧으면 사용자 인증 과정에서 만료될 수 있어 UX가 나빠질 수 있음.
 */
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;

/**
 * 메모리 nonce 저장소 상한.
 * - 비정상 트래픽/공격으로 nonce가 무한 적재되는 상황을 완화하기 위한 안전장치.
 * - 상한 도달 시 만료 시각이 가장 이른 엔트리를 제거해 메모리 폭주를 방지.
 */
const NONCE_STORE_MAX_SIZE = 20_000;

/**
 * OAuth 공급자 (현재는 구글, 카카오만 지원)
 */
type OAuthProvider = 'google' | 'kakao';

/**
 * state payload를 짧게 유지하기 위해 축약 키 사용.
 * - p: provider (`google` | `kakao`) - 교차 provider 재사용 방지
 * - r: returnPath - 로그인 후 내부 리다이렉트 경로
 * - e: expiresAt(ms) - 만료 시각
 * - n: nonce - 동일 요청 구분용 랜덤 값
 */
type OAuthStatePayload = {
  p: OAuthProvider;
  r: string;
  e: number;
  n: string;
};

/**
 * nonce 재사용(replay) 방지를 위한 프로세스 메모리 저장소.
 *
 * 주의:
 * - 단일 인스턴스/프로세스 기준 방어.
 * - 멀티 인스턴스 환경에서는 인스턴스 간 nonce 상태가 공유되지 않으므로
 *   완전한 전역 replay 방어를 위해 Redis/KV 같은 공유 저장소가 필요함.
 */
const usedNonceStore = new Map<string, number>();

/**
 * 만료된 nonce 엔트리 정리.
 * verify 시점마다 호출해 저장소를 TTL 기준으로 청소한다.
 */
function pruneNonceStore(now: number): void {
  for (const [nonceKey, expiresAt] of usedNonceStore.entries()) {
    if (expiresAt < now) usedNonceStore.delete(nonceKey);
  }
}

/** 상한 초과 시 `expiresAt`이 최소인 엔트리(가장 먼저 만료되는 nonce)를 제거 */
function evictEarliestExpiringNonce(): void {
  let victimKey: string | undefined;
  let minExpiresAt = Infinity;
  for (const [key, expiresAt] of usedNonceStore) {
    if (expiresAt < minExpiresAt) {
      minExpiresAt = expiresAt;
      victimKey = key;
    }
  }
  if (victimKey !== undefined) usedNonceStore.delete(victimKey);
}

/**
 * nonce를 "1회 소비" 처리한다.
 * - 이미 사용된 nonce면 false (replay 차단)
 * - 최초 사용이면 저장 후 true
 *
 * 서버리스 주의:
 * - 이 로직은 "현재 인스턴스" 기준으로만 replay를 차단한다.
 * - 인스턴스가 달라지면 저장소가 공유되지 않으므로 전역 replay 차단은 보장하지 않는다.
 * - 본 프로젝트는 Vercel(서버리스) 전제를 고려해, 전역 방어 대신 비용/복잡도 균형으로 이 수준을 채택.
 */
function consumeNonce(provider: OAuthProvider, nonce: string, expiresAt: number): boolean {
  const now = Date.now();
  pruneNonceStore(now);
  const nonceKey = `${provider}:${nonce}`;
  if (usedNonceStore.has(nonceKey)) return false;

  if (usedNonceStore.size >= NONCE_STORE_MAX_SIZE) {
    // prune 후에도 꽉 차면 만료 시각이 가장 이른 엔트리를 제거(Map 삽입 순서와 무관)
    evictEarliestExpiringNonce();
  }

  usedNonceStore.set(nonceKey, expiresAt);
  return true;
}

/**
 * URL query에 안전하게 넣기 위해 base64url 인코딩 사용.
 * (`+`, `/`, `=` 제거되어 URL 인코딩 부담이 줄어듦)
 */
function base64UrlEncode(input: string): string {
  return Buffer.from(input, 'utf8').toString('base64url');
}

function base64UrlDecode(input: string): string {
  return Buffer.from(input, 'base64url').toString('utf8');
}

/**
 * provider별 OAuth client secret 조회.
 * 별도 state 전용 secret을 두지 않고 기존 OAuth 공급자의 client secret을 재사용
 */
function getProviderSecret(provider: OAuthProvider): string {
  if (provider === 'google') {
    const secret = process.env.GOOGLE_CLIENT_SECRET?.trim();
    if (!secret) throw new Error(NO_GOOGLE_CLIENT_SECRET_MESSAGE_KO);
    return secret;
  }

  const secret = process.env.KAKAO_CLIENT_SECRET?.trim();
  if (!secret) throw new Error(NO_KAKAO_CLIENT_SECRET_MESSAGE_KO);
  return secret;
}

/**
 * payload(base64url)에 대해 HMAC-SHA256 서명 생성.
 * 반환값은 base64url 문자열이며 state의 두 번째 파트로 사용.
 */
function signPayload(provider: OAuthProvider, encodedPayload: string): string {
  const secret = getProviderSecret(provider);
  return createHmac('sha256', secret).update(encodedPayload).digest('base64url');
}

/**
 * 서명 비교 시 timing attack 가능성을 줄이기 위해 상수 시간 비교 사용.
 * - 길이가 다르면 즉시 false
 * - 길이가 같을 때만 timingSafeEqual 수행
 */
function isSameSignature(expected: string, provided: string): boolean {
  const expectedBuffer = Buffer.from(expected, 'utf8');
  const providedBuffer = Buffer.from(provided, 'utf8');
  if (expectedBuffer.length !== providedBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, providedBuffer);
}

/**
 * OAuth 시작 시 state 생성.
 *
 * 형식: `<base64url(payload)>.<base64url(hmac)>`
 * - payload는 provider/returnPath/expiry/nonce를 포함
 * - returnPath는 생성 시점에 먼저 sanitize해서 내부 경로만 허용
 * - 서버 저장소(DB/Redis/cookie) 없이 stateless 검증 가능
 */
export function createOAuthState(provider: OAuthProvider, callbackPath: string): string {
  const safePath = getSafeCallbackPath(callbackPath) ?? '/dashboard';
  const payload: OAuthStatePayload = {
    p: provider,
    r: safePath,
    e: Date.now() + OAUTH_STATE_TTL_MS,
    n: randomUUID(),
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(provider, encodedPayload);
  return `${encodedPayload}.${signature}`;
}

/**
 * OAuth 콜백에서 state 검증.
 *
 * 검증 순서:
 * 1) 포맷 검증 (`payload.signature`)
 * 2) 서명 검증 (위변조 여부)
 * 3) payload JSON 파싱
 * 4) provider 일치 검증 (google state를 kakao에 재사용 방지)
 * 5) 만료 검증
 * 6) nonce 1회성 소비 검증 (현재 인스턴스 기준 replay 방지)
 * 7) returnPath 재검증 (오픈 리다이렉트 방지)
 *
 * 하나라도 실패하면 `{ ok: false }` 반환.
 */
export function verifyOAuthState(
  provider: OAuthProvider,
  state: string,
): { ok: true; returnPath: string } | { ok: false } {
  /**
   * state는 `<base64url(payload)>.<base64url(hmac)>` 형식으로 구성되어 있음.
   * 따라서 `.`을 기준으로 분리하여 파싱.
   */
  const parts = state.split('.');
  if (parts.length !== 2) return { ok: false };

  /**
   * 분리된 두 부분(payload, hmac)이 모두 존재하는지 확인.
   */
  const [encodedPayload, providedSignature] = parts;
  if (!encodedPayload || !providedSignature) return { ok: false };

  /**
   * 서명 검증.
   */
  const expectedSignature = signPayload(provider, encodedPayload);
  if (!isSameSignature(expectedSignature, providedSignature)) return { ok: false };

  /**
   * payload JSON 파싱.
   */
  let payload: OAuthStatePayload;
  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload)) as OAuthStatePayload;
  } catch {
    return { ok: false };
  }

  /**
   * provider 일치 검증.
   */
  if (payload.p !== provider) return { ok: false };

  /**
   * 만료 검증.
   */
  if (typeof payload.e !== 'number' || payload.e < Date.now()) return { ok: false };

  /**
   * nonce 형식/1회성 소비 검증.
   */
  if (typeof payload.n !== 'string' || payload.n.length < 8) return { ok: false };

  /**
   * JSON.parse + 단언만으로는 `r`이 string이 아닐 수 있음.
   * (예: 조작된 state에서 `r`이 number/object면 `getSafeCallbackPath`의 trim에서 예외)
   */
  if (typeof payload.r !== 'string') return { ok: false };
  if (!consumeNonce(provider, payload.n, payload.e)) return { ok: false };

  /**
   * returnPath 재검증.
   */
  const safePath = getSafeCallbackPath(payload.r);
  if (!safePath) return { ok: false };

  /**
   * 검증 성공.
   */
  return { ok: true, returnPath: safePath };
}
