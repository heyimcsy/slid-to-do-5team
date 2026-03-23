import { parseTokenPairFromBackendJson } from '@/lib/auth/parseTokenPairFromBackendJson';

import { API_BASE_URL, AUTH_CONFIG } from '@/constants/api';

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
 * @property onBeforeRequest: 요청 직전 호출 — **서버(Route Handler 등)에서 권장** (전역 `use*` 인터셉터는 브라우저 전용)
 * @property onResponse: 성공 응답 반환 직전 호출 (데이터 변형)
 * @property onError: 에러 throw 직전 호출 (로깅 등)
 */
/** JSON이 아닌 바디(FormData, Blob 등) + 응답 파싱 모드 */
export type ApiClientResponseType = 'json' | 'blob' | 'text' | 'arrayBuffer';

export type ApiClientConfig = Omit<RequestInit, 'body'> & {
  body?: unknown;
  /**
   * 성공 응답 파싱 방식 (기본 `json`).
   * 이미지·파일 다운로드 등은 `blob` 또는 `arrayBuffer`.
   */
  responseType?: ApiClientResponseType;
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
 * 클라이언트 전역 인터셉터 (axios 스타일).
 * 서버(Node·서버리스·Edge)에서는 모듈이 요청 간 재사용되므로 **배열을 두지 않음** — 누적·교차 실행 방지.
 * 서버 측 훅/Route Handler에서는 `ApiClientConfig`의 `onBeforeRequest` / `onResponse` / `onError`만 사용.
 */
const clientRequestInterceptors: RequestInterceptor[] = [];
const clientResponseInterceptors: ResponseInterceptor<unknown>[] = [];
const clientErrorInterceptors: ErrorInterceptor[] = [];

function assertInterceptorClientOnly(apiName: string): void {
  if (typeof window === 'undefined') {
    throw new Error(
      `${apiName}은(는) 클라이언트 전용입니다. 서버에서는 ApiClientConfig의 onBeforeRequest, onResponse, onError를 사용하세요.`,
    );
  }
}

/**
 * @description useRequestInterceptor - 요청 인터셉터 등록 (브라우저 전용)
 * @param fn - 요청 인터셉터 함수
 * @returns - 요청 인터셉터 제거 함수(리턴값을 호출하면 요청 인터셉터 제거)
 */
export function useRequestInterceptor(fn: RequestInterceptor): () => void {
  assertInterceptorClientOnly('useRequestInterceptor');
  clientRequestInterceptors.push(fn);
  return () => {
    const i = clientRequestInterceptors.indexOf(fn);
    if (i >= 0) clientRequestInterceptors.splice(i, 1);
  };
}

/**
 * @description useResponseInterceptor - 응답 인터셉터 등록 (브라우저 전용)
 * @param fn - 응답 인터셉터 함수
 * @returns - 응답 인터셉터 제거 함수(리턴값을 호출하면 응답 인터셉터 제거)
 */
export function useResponseInterceptor<T = unknown>(fn: ResponseInterceptor<T>): () => void {
  assertInterceptorClientOnly('useResponseInterceptor');
  clientResponseInterceptors.push(fn as ResponseInterceptor<unknown>);
  return () => {
    const i = clientResponseInterceptors.indexOf(fn as ResponseInterceptor<unknown>);
    if (i >= 0) clientResponseInterceptors.splice(i, 1);
  };
}

/**
 * @description useErrorInterceptor - 에러 인터셉터 등록 (브라우저 전용)
 * @param fn - 에러 인터셉터 함수
 * @returns - 에러 인터셉터 제거 함수(리턴값을 호출하면 에러 인터셉터 제거)
 */
export function useErrorInterceptor(fn: ErrorInterceptor): () => void {
  assertInterceptorClientOnly('useErrorInterceptor');
  clientErrorInterceptors.push(fn);
  return () => {
    const i = clientErrorInterceptors.indexOf(fn);
    if (i >= 0) clientErrorInterceptors.splice(i, 1);
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
  if (!isServer) {
    for (const fn of clientErrorInterceptors) {
      void Promise.resolve(fn(err));
    }
  }
  if (onError) {
    void Promise.resolve(onError(err));
  }
}

/**
 * JSON API용 stringify vs FormData·Blob·스트림 등 그대로 전달 구분.
 * @internal 테스트에서 동일 규칙을 검증할 수 있도록 export
 */
export function prepareApiClientBody(body: unknown): {
  body: BodyInit | undefined;
  /** true면 `Content-Type: application/json` 설정 */
  setJsonContentType: boolean;
  /** true면 기존 Content-Type 제거 (multipart boundary는 런타임이 붙임) */
  stripContentTypeForFormData: boolean;
} {
  if (body === undefined || body === null) {
    return { body: undefined, setJsonContentType: false, stripContentTypeForFormData: false };
  }
  if (typeof body === 'string') {
    return { body, setJsonContentType: false, stripContentTypeForFormData: false };
  }
  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    return { body, setJsonContentType: false, stripContentTypeForFormData: true };
  }
  if (typeof Blob !== 'undefined' && body instanceof Blob) {
    return { body, setJsonContentType: false, stripContentTypeForFormData: false };
  }
  if (body instanceof ArrayBuffer) {
    return { body, setJsonContentType: false, stripContentTypeForFormData: false };
  }
  /** Node Buffer는 ArrayBufferView이지만 lib.dom `BodyInit`에 Buffer가 없어 단언 */
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(body)) {
    return {
      body: body as BodyInit,
      setJsonContentType: false,
      stripContentTypeForFormData: false,
    };
  }
  if (ArrayBuffer.isView(body)) {
    return {
      body: new Uint8Array(body.buffer, body.byteOffset, body.byteLength) as BodyInit,
      setJsonContentType: false,
      stripContentTypeForFormData: false,
    };
  }
  if (typeof ReadableStream !== 'undefined' && body instanceof ReadableStream) {
    return { body, setJsonContentType: false, stripContentTypeForFormData: false };
  }
  if (typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams) {
    return { body, setJsonContentType: false, stripContentTypeForFormData: false };
  }
  return {
    body: JSON.stringify(body),
    setJsonContentType: true,
    stripContentTypeForFormData: false,
  };
}

async function parseSuccessBody<T>(
  response: Response,
  responseType: ApiClientResponseType,
): Promise<T> {
  switch (responseType) {
    case 'blob':
      return (await response.blob()) as T;
    case 'text':
      return (await response.text()) as T;
    case 'arrayBuffer':
      return (await response.arrayBuffer()) as T;
    default:
      return (await response.json()) as T;
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
 *   - 인터셉터는 `config`의 onBeforeRequest/onResponse/onError만 적용 (모듈 전역 `use*`는 서버에서 미실행)
 *
 * [Client Component]
 *   - 브라우저가 HttpOnly 쿠키를 자동 전송 → Next.js Route Handler(BFF, /api/proxy)로 요청
 *   - Route Handler가 쿠키 → Bearer 변환 후 API_BASE_URL(백엔드)로 프록시
 *   - 전역 `useRequestInterceptor` 등은 이 환경에서만 안전하게 공유됨
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  config: ApiClientConfig = {},
): Promise<T> {
  const {
    body,
    responseType = 'json',
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

  const prepared = prepareApiClientBody(body);

  // 헤더 구성 — FormData/multipart 시 Content-Type 제거(경계 문자열은 UA가 설정)
  const headers = new Headers(customHeaders);
  if (prepared.stripContentTypeForFormData) {
    headers.delete('Content-Type');
  }
  if (prepared.setJsonContentType) {
    headers.set('Content-Type', 'application/json');
  }

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
    body: prepared.body,
    credentials: isServer ? 'omit' : 'include',
  };

  if (!isServer) {
    for (const fn of clientRequestInterceptors) {
      requestInput = fn(requestInput);
    }
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

  let data: T = (await parseSuccessBody<T>(response, responseType)) as T;
  if (!isServer) {
    for (const fn of clientResponseInterceptors) {
      data = fn(response, data as unknown) as T;
    }
  }
  if (onResponse) {
    data = onResponse(response, data as unknown) as T;
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
