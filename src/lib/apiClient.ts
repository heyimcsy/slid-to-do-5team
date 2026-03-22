import { API_BASE_URL, AUTH_CONFIG } from '@/constants/api';
import { parseTokenPairFromBackendJson } from '@/lib/auth/parseTokenPairFromBackendJson';

/**
 * @description NextFetchConfig - Next.js fetch 확장 — cache, revalidate, tags는 서버에서만 유효함
 * @property revalidate: 캐시 만료 시간 (초 단위)
 * @property tags: 캐시 태그 (캐시 무효화 시 사용)
 * @property cache: 캐시 정책 (캐시 무효화 시 사용)
 * @see https://nextjs.org/docs/app/building-your-application/routing/route-handlers#nextfetchconfig
 */
interface NextFetchConfig {
  revalidate?: number | false;
  tags?: string[];
  cache?: RequestCache;
}

/**
 * @description RequestInput - 요청 정보
 * @property url: 요청 URL(API_BASE_URL 또는 /api/proxy)
 * @property method: 요청 메서드(GET, POST, PUT, DELETE, PATCH 등)
 * @property headers: 요청 헤더(Content-Type: application/json, Authorization: Bearer ${accessToken} 등)
 * @property body: 요청 바디(JSON 문자열)
 * @property credentials: 요청 자격 증명(omit, include, same-origin 등) - 서버에서는 omit, 클라이언트에서는 same-origin이나 include
 * @note 지금은 default값인 same-origin이나 include 동작이 같지만 BFF를 별도 도메인으로 분리할 경우에 CORS 이슈 때문에 include를 미리 사용
 * @see https://developer.mozilla.org/ko/docs/Web/API/Request/credentials
 */
export type RequestInput = RequestInit & { url: string };

/**
 * @description RequestInterceptor - 요청 인터셉터(요청 입력을 받아서 요청 정보를 반환)
 */
export type RequestInterceptor = (input: RequestInput) => RequestInput;

/**
 * @description ResponseInterceptor - 응답 인터셉터(응답을 받아서 응답 데이터를 반환)
 * @template T 제네릭으로 unknown 또는 특정 타입
 */
export type ResponseInterceptor<T = unknown> = (response: Response, data: T) => T;

/**
 * @description ApiClientConfig - API 클라이언트 설정
 * @property body: 요청 바디 (어떤 값이 들어올지 모르므로 기본 unknown)
 * @property retry: 401 시 토큰 갱신 후 재시도
 * @property next: Next.js fetch 확장 — cache, revalidate, tags는 서버에서만 유효함
 * @property onBeforeRequest: 요청 직전 호출 (헤더·URL 등 변형)
 * @property onResponse: 성공 응답 반환 직전 호출 (데이터 변형)
 * @property onError: 에러 throw 직전 호출 (로깅 등)
 */
export type ApiClientConfig = Omit<RequestInit, 'body'> & {
  body?: unknown;
  /* 재시도 여부(기본값 true, false 시 갱신 없이 즉시 에러 반환) */
  retry?: boolean;
  /* Next.js fetch 확장 — 서버에서만 유효 (cache, revalidate, tags) */
  next?: NextFetchConfig;
  /* 요청 직전 호출 (헤더·URL 등 변형을 위한 요청 인터셉터) */
  onBeforeRequest?: RequestInterceptor;
  /* 성공 응답 반환 직전 호출 (데이터 변형을 위한 응답 인터셉터) */
  onResponse?: ResponseInterceptor<unknown>;
  /* 에러 throw 직전 호출 (에러 처리를 위한 에러 인터셉터) */
  onError?: ErrorInterceptor;
};

/**
 * @description ApiError - 에러 응답 정보
 * @property status: 에러 상태 코드
 * @property message: 에러 메시지
 * @property code: 에러 코드
 */
interface ApiError {
  status: number;
  message: string;
  code?: string;
}

/**
 * @class ApiClientError - API 클라이언트 에러
 * @property status: 에러 상태 코드(401, 403, 404, 500 등 HTTP 상태 코드)
 * @property code: 에러 코드(INVALID_CREDENTIALS 등 API 에러 코드)
 * @property message: 에러 메시지(Invalid email or password 등 API 에러 메시지, 없으면 ApiClientError로 표기됨)
 */
export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string | undefined,
    message: string,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

/**
 * @description ErrorInterceptor - 에러 인터셉터(에러를 받아서 처리)
 * @returns void | Promise<void> - API 클라이언트 에러 발생 시 void 또는 Promise<void> 반환
 */
export type ErrorInterceptor = (error: ApiClientError) => void | Promise<void>;

/**
 * @description 전역 인터셉터 (axios 스타일)
 * @property requestInterceptors: 요청 인터셉터
 * @property responseInterceptors: 응답 인터셉터
 * @property errorInterceptors: 에러 인터셉터
 */
const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor<unknown>[] = [];
const errorInterceptors: ErrorInterceptor[] = [];

/**
 * @description useRequestInterceptor - 요청 인터셉터 등록
 * @param fn - 요청 인터셉터 함수
 * @returns - 요청 인터셉터 제거 함수(리턴값을 호출하면 요청 인터셉터 제거)
 */
export function useRequestInterceptor(fn: RequestInterceptor): () => void {
  requestInterceptors.push(fn);
  return () => {
    const i = requestInterceptors.indexOf(fn);
    if (i >= 0) requestInterceptors.splice(i, 1);
  };
}

/**
 * @description useResponseInterceptor - 응답 인터셉터 등록
 * @param fn - 응답 인터셉터 함수
 * @returns - 응답 인터셉터 제거 함수(리턴값을 호출하면 응답 인터셉터 제거)
 */
export function useResponseInterceptor<T = unknown>(fn: ResponseInterceptor<T>): () => void {
  responseInterceptors.push(fn as ResponseInterceptor<unknown>);
  return () => {
    const i = responseInterceptors.indexOf(fn as ResponseInterceptor<unknown>);
    if (i >= 0) responseInterceptors.splice(i, 1);
  };
}

/**
 * @description useErrorInterceptor - 에러 인터셉터 등록
 * @param fn - 에러 인터셉터 함수
 * @returns - 에러 인터셉터 제거 함수(리턴값을 호출하면 에러 인터셉터 제거)
 */
export function useErrorInterceptor(fn: ErrorInterceptor): () => void {
  errorInterceptors.push(fn);
  return () => {
    const i = errorInterceptors.indexOf(fn);
    if (i >= 0) errorInterceptors.splice(i, 1);
  };
}

/**
 * @description isServer - 서버 환경 감지
 * @returns - 서버 환경 여부 (true: 서버(Node.js), false: 클라이언트(Browser))
 */
const isServer = typeof window === 'undefined';

/**
 * @description runErrorInterceptors - 에러 인터셉터 실행
 * @param err - 에러 인터셉터 실행 에러
 * @param onError - 에러 인터셉터 실행 에러 함수(ApiClientError를 받아서 처리)
 */
function runErrorInterceptors(err: ApiClientError, onError?: ErrorInterceptor): void {
  for (const fn of errorInterceptors) {
    void Promise.resolve(fn(err));
  }
  if (onError) {
    void Promise.resolve(onError(err));
  }
}

/**
 * @description apiClient - 서버/클라이언트 양쪽에서 사용 가능한 Fetch Wrapper
 * @param endpoint - 요청 URL
 * @param config - API 클라이언트 설정
 * @returns - Promise<T> - 요청 결과(타입 제네릭)
 *
 * [Server Component / Route Handler]
 *   - `cookies()`로 accessToken을 읽어 Authorization 헤더에 주입
 *   - API_BASE_URL 사용 (내부 네트워크 통신)
 *
 * [Client Component]
 *   - 브라우저가 HttpOnly 쿠키를 자동 전송 → Next.js Route Handler(BFF, /api/proxy)로 요청
 *   - Route Handler가 쿠키 → Bearer 변환 후 API_BASE_URL(백엔드)로 프록시
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  config: ApiClientConfig = {},
): Promise<T> {
  const {
    body,
    retry = true,
    headers: customHeaders,
    next: nextConfig,
    onBeforeRequest,
    onResponse,
    onError,
    ...restConfig
  } = config;

  // 서버에서는 내부 URL, 클라이언트에서는 BFF 경유
  const baseUrl = isServer ? API_BASE_URL : '/api/proxy';
  const url = `${baseUrl}${endpoint}`;

  // 헤더 구성
  const headers = new Headers(customHeaders);
  headers.set('Content-Type', 'application/json');

  // 서버 환경: 쿠키에서 직접 토큰 추출
  if (isServer) {
    const { getAccessToken, isAccessTokenExpiringSoon } = await import('@/lib/auth/cookies');
    // accessToken이 토큰 만료 시간(REFRESH_BUFFER_SECONDS) 이내에 들어오면 토큰 갱신 시도
    if (await isAccessTokenExpiringSoon()) {
      const refreshed = await attemptTokenRefresh();
      if (refreshed) {
        // 새 리프레시 토큰을 받았으므로 다시 요청 시도
        return apiClient<T>(endpoint, { ...config, retry: false });
      }
    }
    const accessToken = await getAccessToken();
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
  }

  let requestInput: RequestInput = {
    url,
    ...restConfig,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: isServer ? 'omit' : 'include',
  };

  for (const fn of requestInterceptors) {
    requestInput = fn(requestInput);
  }
  if (onBeforeRequest) {
    requestInput = onBeforeRequest(requestInput);
  }

  const { url: finalUrl, ...fetchOpts } = requestInput;

  const response = await fetch(finalUrl, {
    ...fetchOpts,
    ...(isServer &&
      nextConfig && {
        next: nextConfig,
        ...(nextConfig.cache !== undefined && { cache: nextConfig.cache }),
      }),
  });

  // 401 처리: 토큰 갱신 후 재시도
  if (response.status === 401 && retry) {
    const refreshed = await attemptTokenRefresh();
    if (refreshed) {
      return apiClient<T>(endpoint, { ...config, retry: false });
    }

    const err = new ApiClientError(401, 'UNAUTHORIZED', '인증이 만료되었습니다.');
    runErrorInterceptors(err, onError);
    if (!isServer) {
      window.location.href = '/login';
    }
    throw err;
  }

  // 에러 응답 처리
  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      status: response.status,
      message: response.statusText,
    }));
    const err = new ApiClientError(response.status, error.code, error.message);
    runErrorInterceptors(err, onError);
    throw err;
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  let data = (await response.json()) as T;
  for (const fn of responseInterceptors) {
    data = fn(response, data) as T;
  }
  if (onResponse) {
    data = onResponse(response, data) as T;
  }
  return data;
}

// === 토큰 갱신 (Race Condition 방지) ===
let refreshPromise: Promise<boolean> | null = null;

async function attemptTokenRefresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = executeRefresh();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

async function executeRefresh(): Promise<boolean> {
  try {
    if (isServer) {
      const { getRefreshToken, setAuthCookies } = await import('@/lib/auth/cookies');
      const refreshToken = await getRefreshToken();
      if (!refreshToken) return false;

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [AUTH_CONFIG.REFRESH_TOKEN_KEY]: refreshToken }),
      });

      if (!response.ok) return false;

      const data = (await response.json()) as Record<string, unknown>;
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        parseTokenPairFromBackendJson(data);
      if (!newAccessToken || !newRefreshToken) return false;
      await setAuthCookies(newAccessToken, newRefreshToken);
      return true;
    } else {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });
      return response.ok;
    }
  } catch {
    return false;
  }
}
