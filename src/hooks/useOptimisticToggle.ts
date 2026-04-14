import { useEffect, useRef, useState } from 'react';

import { useDebouncedCallback } from './useDebounceCallback';

interface UseOptimisticToggleProps {
  serverValue: boolean;
  serverCount?: number;
  onToggle: (serverValue: boolean, options: { onError: () => void }) => void;
  delay?: number;
}

export const useOptimisticToggle = ({
  serverValue,
  serverCount,
  onToggle,
  delay = 300,
}: UseOptimisticToggleProps) => {
  const [value, setValue] = useState(serverValue);
  const [count, setCount] = useState(serverCount);
  const valueRef = useRef(serverValue);

  useEffect(() => {
    if (valueRef.current === serverValue) {
      setValue(serverValue);
      setCount(serverCount);
    }
  }, [serverValue, serverCount]);

  const debouncedCall = useDebouncedCallback(
    (currentServerValue: boolean, currentServerCount?: number) => {
      if (valueRef.current === currentServerValue) return;

      onToggle(currentServerValue, {
        onError: () => {
          valueRef.current = currentServerValue;
          setValue(currentServerValue);
          setCount(currentServerCount);
        },
      });
    },
    delay,
  );

  const toggle = () => {
    const next = !valueRef.current;
    valueRef.current = next;

    if (count !== undefined) {
      setCount((prev) => Math.max(0, (prev ?? 0) + (next ? 1 : -1)));
    }
    setValue(next);
    debouncedCall(serverValue, serverCount);
  };

  return { value, count, toggle };
};
