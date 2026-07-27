import { useCallback, useEffect, useRef, useState } from 'react'

export function useResendTimer() {
  const [secondsLeft, setSecondsLeft] = useState<number>(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = useCallback((seconds: number) => {
    setSecondsLeft(seconds)
  }, [])

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = null
      return
    }

    if (intervalRef.current) return

    intervalRef.current = setInterval(() => {
      setSecondsLeft((p) => (p > 0 ? p - 1 : 0))
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [secondsLeft])

  return {
    secondsLeft,
    isRunning: secondsLeft > 0,
    start,
  }
}
