/**
 * 환경 무관 `createApiClient` 팩토리 — `cookies` / `server-only` import 금지.
 */

/**
 * @description NextFetchConfig - Next.js fetch 확장 — cache, revalidate, tags는 서버에서만 유효함
 */
export interface NextFetchConfig {
  revalidate?: number | false;
  tags?: string[];
  cache?: RequestCache;
}

/**
 * @description RequestInput - 요청 정보
 */
export type RequestInput = RequestInit & { url: string };

export type RequestInterceptor = (input: RequestInput) => RequestInput;

export type ResponseInterceptor<T = unknown> = (response: Response, data: T) => T;

/** JSON이 아닌 바디(FormData, Blob 등) + 응답 파싱 모드 */
export type ApiClientResponseType = 'json' | 'blob' | 'text' | 'arrayBuffer';

/** 브라우저에서만 사용. `endpoint` 앞에 붙는 공개 BFF 베이스(기본 `/api/proxy`). */
export type ClientPublicApiBase = '/api/proxy' | '/api/auth';

export type ApiClientConfig = Omit<RequestInit, 'body'> & {
  body?: unknown;
  responseType?: ApiClientResponseType;
  retry?: boolean;
  next?: NextFetchConfig;
  clientPublicBase?: ClientPublicApiBase;
  onBeforeRequest?: RequestInterceptor;
  onResponse?: ResponseInterceptor<unknown>;
  onError?: ErrorInterceptor;
};

interface ApiError {
  status: number;
  message: string;
  code?: string;
}

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

export type ErrorInterceptor = (error: ApiClientError) => void | Promise<void>;

export function prepareApiClientBody(body: unknown): {
  body: BodyInit | undefined;
  setJsonContentType: boolean;
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

export interface CreateApiClientDeps {
  resolveUrl: (endpoint: string, config: ApiClientConfig) => string;
  credentials: RequestCredentials;
  /**
   * 서버: 만료 임박 시 refresh 후 `request` 재귀, 또는 Authorization 주입.
   * `T | undefined` — 값이 있으면 해당 값으로 요청이 종료(재귀 결과).
   */
  onBeforeAuth?: <T>(
    headers: Headers,
    endpoint: string,
    config: ApiClientConfig,
    request: <R>(endpoint: string, config?: ApiClientConfig) => Promise<R>,
  ) => Promise<T | undefined>;
  refreshTokens: () => Promise<boolean>;
  onUnauthorized?: () => void;
  shouldRunGlobalInterceptors: () => boolean;
  /** false면 use* 인터셉터 등록 API가 즉시 throw */
  allowGlobalInterceptorRegistration: boolean;
  buildFetchNext?: (nextConfig?: NextFetchConfig) => Record<string, unknown> | undefined;
}

export interface ApiClientInstance {
  request: <T = unknown>(endpoint: string, config?: ApiClientConfig) => Promise<T>;
  useRequestInterceptor: (fn: RequestInterceptor) => () => void;
  useResponseInterceptor: <T = unknown>(fn: ResponseInterceptor<T>) => () => void;
  useErrorInterceptor: (fn: ErrorInterceptor) => () => void;
}

function assertInterceptorClientOnly(apiName: string): void {
  if (typeof window === 'undefined') {
    throw new Error(
      `${apiName}은(는) 클라이언트 전용입니다. 서버에서는 ApiClientConfig의 onBeforeRequest, onResponse, onError를 사용하세요.`,
    );
  }
}

function throwInterceptorNotAllowed(apiName: string): never {
  throw new Error(
    `${apiName}은(는) 클라이언트 전용입니다. 서버에서는 ApiClientConfig의 onBeforeRequest, onResponse, onError를 사용하세요.`,
  );
}

export function createApiClient(deps: CreateApiClientDeps): ApiClientInstance {
  const requestInterceptors: RequestInterceptor[] = [];
  const responseInterceptors: ResponseInterceptor<unknown>[] = [];
  const errorInterceptors: ErrorInterceptor[] = [];

  async function attemptRefresh(): Promise<boolean> {
    return deps.refreshTokens();
  }

  function runErrorInterceptors(err: ApiClientError, onError?: ErrorInterceptor): void {
    if (deps.shouldRunGlobalInterceptors()) {
      for (const fn of errorInterceptors) {
        void Promise.resolve(fn(err));
      }
    }
    if (onError) {
      void Promise.resolve(onError(err));
    }
  }

  async function request<T = unknown>(endpoint: string, config: ApiClientConfig = {}): Promise<T> {
    const {
      body,
      responseType = 'json',
      retry = true,
      headers: customHeaders,
      next: nextConfig,
      onBeforeRequest,
      onResponse,
      onError,
      clientPublicBase: _clientPublicBase,
      ...restConfig
    } = config;

    const url = deps.resolveUrl(endpoint, config);

    const prepared = prepareApiClientBody(body);

    const headers = new Headers(customHeaders);
    if (prepared.stripContentTypeForFormData) {
      headers.delete('Content-Type');
    }
    if (prepared.setJsonContentType) {
      headers.set('Content-Type', 'application/json');
    }

    if (deps.onBeforeAuth) {
      const early = await deps.onBeforeAuth<T>(headers, endpoint, config, request);
      if (early !== undefined) {
        return early;
      }
    }

    let requestInput: RequestInput = {
      url,
      ...restConfig,
      headers,
      body: prepared.body,
      credentials: deps.credentials,
    };

    if (deps.shouldRunGlobalInterceptors()) {
      for (const fn of requestInterceptors) {
        requestInput = fn(requestInput);
      }
    }
    if (onBeforeRequest) {
      requestInput = onBeforeRequest(requestInput);
    }

    const { url: finalUrl, ...fetchOpts } = requestInput;

    const fetchExtra = deps.buildFetchNext?.(nextConfig);
    const response = await fetch(finalUrl, {
      ...fetchOpts,
      ...fetchExtra,
    });

    if (response.status === 401 && retry) {
      const refreshed = await attemptRefresh();
      if (refreshed) {
        return request<T>(endpoint, { ...config, retry: false });
      }

      const err = new ApiClientError(401, 'UNAUTHORIZED', '인증이 만료되었습니다.');
      runErrorInterceptors(err, onError);
      deps.onUnauthorized?.();
      throw err;
    }

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        status: response.status,
        message: response.statusText,
      }));
      const err = new ApiClientError(response.status, error.code, error.message);
      runErrorInterceptors(err, onError);
      throw err;
    }

    if (response.status === 204) {
      return undefined as T;
    }

    let data: T = (await parseSuccessBody<T>(response, responseType)) as T;
    if (deps.shouldRunGlobalInterceptors()) {
      for (const fn of responseInterceptors) {
        data = fn(response, data as unknown) as T;
      }
    }
    if (onResponse) {
      data = onResponse(response, data as unknown) as T;
    }
    return data;
  }

  const allow = deps.allowGlobalInterceptorRegistration;

  return {
    request,
    useRequestInterceptor(fn: RequestInterceptor): () => void {
      if (!allow) throwInterceptorNotAllowed('useRequestInterceptor');
      assertInterceptorClientOnly('useRequestInterceptor');
      requestInterceptors.push(fn);
      return () => {
        const i = requestInterceptors.indexOf(fn);
        if (i >= 0) requestInterceptors.splice(i, 1);
      };
    },
    useResponseInterceptor<T = unknown>(fn: ResponseInterceptor<T>): () => void {
      if (!allow) throwInterceptorNotAllowed('useResponseInterceptor');
      assertInterceptorClientOnly('useResponseInterceptor');
      responseInterceptors.push(fn as ResponseInterceptor<unknown>);
      return () => {
        const i = responseInterceptors.indexOf(fn as ResponseInterceptor<unknown>);
        if (i >= 0) responseInterceptors.splice(i, 1);
      };
    },
    useErrorInterceptor(fn: ErrorInterceptor): () => void {
      if (!allow) throwInterceptorNotAllowed('useErrorInterceptor');
      assertInterceptorClientOnly('useErrorInterceptor');
      errorInterceptors.push(fn);
      return () => {
        const i = errorInterceptors.indexOf(fn);
        if (i >= 0) errorInterceptors.splice(i, 1);
      };
    },
  };
}
