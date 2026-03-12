// 1. jest-dom 커스텀 매처
import "@testing-library/jest-dom";

// 2. Next.js 전용 모킹
import { TextDecoder, TextEncoder } from "util";

// Next.js App Router는 Web API(TextEncoder 등)를 사용하는데
// jsdom 환경에 없을 수 있어 폴리필 필요
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// 3. fetch 폴리필 (Next.js 서버 컴포넌트 / API 테스트 시)
// Node 18+ 사용 중이라면 생략 가능
// import "whatwg-fetch";

// 4. next/navigation 모킹 (App Router 필수)
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    refresh: jest.fn(),
  })),
  usePathname: jest.fn(() => "/"),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  useParams: jest.fn(() => ({})),
}));

// 5. IntersectionObserver 모킹 (무한스크롤, lazy loading 등)
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// 6. ResizeObserver 모킹 (반응형 컴포넌트)
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// 7. window.matchMedia 모킹 (미디어 쿼리 의존 컴포넌트)
Object.defineProperty(window, "matchMedia", {
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

// 8. console.error 필터링 (선택적)
// 특정 알려진 경고를 억제해 테스트 출력을 깔끔하게 유지
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    // React의 act() 경고 등 노이즈 필터링
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is no longer supported")
    ) {
      return;
    }
    originalError(...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
