import { useEffect, useRef, useState } from 'react';

/**
 * Returns the latest value after `delayMs` ms of inactivity.
 * Pure React hook (no external libs).
 */
export function useDebouncedValue<T>(value: T, delayMs: number = 400): T {
  const [debounced, setDebounced] = useState<T>(value);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setDebounced(value), delayMs);
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [value, delayMs]);

  return debounced;
}
