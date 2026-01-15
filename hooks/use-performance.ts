"use client"

import { useEffect, useRef, useState } from "react"

interface PerformanceMetrics {
  fcp?: number // First Contentful Paint
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  ttfb?: number // Time to First Byte
  navigationTime?: number
}

/**
 * Monitor Core Web Vitals and custom performance metrics
 */
export function usePerformanceMonitoring() {
  const metricsRef = useRef<PerformanceMetrics>({})

  useEffect(() => {
    // Measure First Contentful Paint
    if ("PerformanceObserver" in window) {
      try {
        // FCP and LCP
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === "first-contentful-paint") {
              metricsRef.current.fcp = entry.startTime
            }
          }
        })
        paintObserver.observe({ entryTypes: ["paint", "largest-contentful-paint"] })

        // LCP (Largest Contentful Paint)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          metricsRef.current.lcp = lastEntry.startTime
        })
        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] })

        // CLS (Cumulative Layout Shift)
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!("hadRecentInput" in entry) || !(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
              metricsRef.current.cls = clsValue
            }
          }
        })
        clsObserver.observe({ entryTypes: ["layout-shift"] })

        return () => {
          paintObserver.disconnect()
          lcpObserver.disconnect()
          clsObserver.disconnect()
        }
      } catch (e) {
        console.warn("Performance monitoring unavailable:", e)
      }
    }
  }, [])

  // Report metrics in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const reportMetrics = () => {
        console.group("📊 Performance Metrics")
        if (metricsRef.current.fcp)
          console.log(`FCP: ${metricsRef.current.fcp.toFixed(2)}ms`)
        if (metricsRef.current.lcp)
          console.log(`LCP: ${metricsRef.current.lcp.toFixed(2)}ms`)
        if (metricsRef.current.cls !== undefined)
          console.log(`CLS: ${metricsRef.current.cls.toFixed(3)}`)
        console.groupEnd()
      }

      // Report after 5 seconds of interaction
      const timeout = setTimeout(reportMetrics, 5000)
      return () => clearTimeout(timeout)
    }
  }, [])

  return metricsRef.current
}

/**
 * Measure component render time
 */
export function useRenderTime(componentName: string) {
  const startTimeRef = useRef(performance.now())

  useEffect(() => {
    const renderTime = performance.now() - startTimeRef.current
    if (process.env.NODE_ENV === "development") {
      console.log(`⏱️ ${componentName} rendered in ${renderTime.toFixed(2)}ms`)
    }
  }, [componentName])
}

/**
 * Track promise execution time
 */
export async function measureAsync<T>(
  promise: Promise<T>,
  label: string
): Promise<T> {
  const start = performance.now()
  try {
    const result = await promise
    const duration = performance.now() - start
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ ${label} completed in ${duration.toFixed(2)}ms`)
    }
    return result
  } catch (error) {
    const duration = performance.now() - start
    if (process.env.NODE_ENV === "development") {
      console.error(`❌ ${label} failed after ${duration.toFixed(2)}ms`, error)
    }
    throw error
  }
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = {}
) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.unobserve(entry.target)
      }
    }, {
      threshold: 0.1,
      ...options,
    })

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref, options])

  return isVisible
}
