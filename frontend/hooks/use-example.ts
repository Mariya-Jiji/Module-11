import { useMemo } from 'react';

export function useExample() {
  return useMemo(() => ({ ready: true }), []);
}
