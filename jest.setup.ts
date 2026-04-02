// 1. jest-dom 커스텀 매처
import '@testing-library/jest-dom';

// 2. Next.js 전용 모킹
import { TextDecoder, TextEncoder } from 'util';

// Route Handler 테스트용 env (constants 로드 전에 설정)
// 앱 origin과 공격자 origin을 분리(동일하면 isAllowedOrigin이 동일 출처로 통과함)
process.env.APP_URL = process.env.APP_URL ?? 'https://app.example.com';
process.env.API_URL = process.env.API_URL ?? 'https://api.example.com';
process.env.TEAM_ID = process.env.TEAM_ID ?? 'team5';

// Next.js App Router는 Web API(TextEncoder 등)를 사용하는데
// jsdom 환경에 없을 수 있어 폴리필 필요
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// 3. fetch 폴리필 (jsdom / Node 17 이하)
// Client Component 테스트(useTokenRefreshOnMount 등)에서 fetch 호출 시 필요
// globalThis 사용: jsdom에서는 global ≠ window, fetch는 globalThis에서 조회
if (typeof globalThis.fetch === 'undefined') {
  (globalThis as typeof globalThis & { fetch: typeof fetch }).fetch = jest.fn(() =>
    Promise.resolve({ ok: true } as Response),
  );
}

// 4. next/headers 모킹 (cookies, headers - Route Handler / Server Component)
const mockCookieStore = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  getAll: jest.fn(() => []),
  has: jest.fn(() => false),
};

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve(mockCookieStore)),
  headers: jest.fn(() => Promise.resolve(new Headers())),
  draftMode: jest.fn(() => ({ enable: jest.fn(), disable: jest.fn(), isEnabled: false })),
}));

// 5. next/navigation 모킹 (App Router 필수)
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    refresh: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  useParams: jest.fn(() => ({})),
}));

// 6. IntersectionObserver 모킹 (무한스크롤, lazy loading 등)
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// 7. ResizeObserver 모킹 (반응형 컴포넌트)
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// 8. window.matchMedia 모킹 (미디어 쿼리 의존 컴포넌트) - jsdom 환경에서만
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

// 9. console.error 필터링 (선택적)
// 특정 알려진 경고를 억제해 테스트 출력을 깔끔하게 유지
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    // React의 act() 경고 등 노이즈 필터링
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError(...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
