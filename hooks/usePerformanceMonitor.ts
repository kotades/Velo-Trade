import { useEffect } from 'react';

/**
 * usePerformanceMonitor
 * Industrial-grade performance monitoring hook for Kota Skillz.
 * Tracks Core Web Vitals and logs bottlenecks during development.
 */
export function usePerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Monitor Layout Shifts (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          if (clsValue > 0.1) {
            console.warn('[PERF] Cumulative Layout Shift detected:', clsValue);
          }
        }
      }
    });

    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // 2. Monitor Long Tasks (FID/INP proxy)
    const longTaskObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.duration > 50) {
          console.warn(`[PERF] Long Task detected (${entry.duration.toFixed(2)}ms):`, entry.name);
        }
      }
    });

    longTaskObserver.observe({ type: 'longtask', buffered: true });

    // 3. Monitor LCP
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log(`[PERF] Largest Contentful Paint: ${lastEntry.startTime.toFixed(2)}ms`);
    });

    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    return () => {
      clsObserver.disconnect();
      longTaskObserver.disconnect();
      lcpObserver.disconnect();
    };
  }, []);
}
