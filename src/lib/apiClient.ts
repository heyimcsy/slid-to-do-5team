/**
 * 클라이언트 번들: `apiClient` / `use*` 는 [`apiClient.browser`](./apiClient.browser.ts) 인스턴스.
 * 서버 전용(쿠키·`API_BASE_URL` 직통): [`apiClient.server`](./apiClient.server.ts)의 `apiClientServer`.
 */
export * from './apiClient.core';
export {
  apiClient,
  useRequestInterceptor,
  useResponseInterceptor,
  useErrorInterceptor,
} from './apiClient.browser';
