import { useCallback, useRef } from 'react';

export const useDebouncedCallback = <T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number,
) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: T) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay],
  );
};
