import { useEffect } from 'react';

declare const window: any;

export function useFrameworkReady() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window?.frameworkReady) {
      window.frameworkReady();
    }
  });
}