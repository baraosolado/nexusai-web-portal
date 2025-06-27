
import { useState, useEffect, useRef } from 'react'

export const useLazySpline = (threshold = 0.1) => {
  const [shouldLoad, setShouldLoad] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { shouldLoad, elementRef }
}
