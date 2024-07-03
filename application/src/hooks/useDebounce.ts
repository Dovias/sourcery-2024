import { useRef, useCallback, useEffect } from 'react';

export function useDebounce(timeoutTime: number) {
  // NodeJS.Timeout is not great type for an application ref which doesn't on run on node.js runtime at all
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debounce = useCallback((action: () => void) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(action, timeoutTime);
  }, [timeoutTime]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debounce;
}
