'use client';

import { useEffect, useState } from 'react';

/**
 * @description 클라이언트 마운트 완료 여부 반환.
 * 브라우저 전용 API(localStorage, window 등) 사용 시 마운트 후에만
 * 해당 UI를 렌더링하기 위한 커스텀 훅
 * Task Queue보다 실행 우선순위가 높은 Micro Task Queue(queueMicrotask)에서
 * mounted 상태를 우선적으로 변경하여 hydration mismatch 방지
 * @see https://ko.javascript.info/event-loop#ref-1245
 * @returns mounted 상태
 *
 * @example
 * // 예: localStorage/theme를 사용할 때
 * function ThemeToggle() {
 *   const mounted = useMounted();
 *   if (!mounted) return null; // 또는 스켈레톤
 *   return <div>{localStorage.getItem('theme')}</div>;
 * }
 * // 예: Zustand persist store 값을 바로 렌더링할 때
 * function UserPreferences() {
 *   const mounted = useMounted();
 *   const theme = useThemeStore((s) => s.theme);
 *   if (!mounted) return null;
 *   return <span>{theme}</span>;
 * }
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);
  return mounted;
}
