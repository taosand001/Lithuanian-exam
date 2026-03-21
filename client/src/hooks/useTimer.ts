import { useEffect, useRef, useState } from 'react'

export function useTimer(initialSeconds: number, onExpire?: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire
  // Only fire onExpire after the timer has actually counted down (not on initial 0)
  const hasStartedRef = useRef(false)

  // Reset timer when exam loads (initialSeconds changes from 0 to positive)
  useEffect(() => {
    if (initialSeconds > 0) {
      setTimeLeft(initialSeconds)
      hasStartedRef.current = false
    }
  }, [initialSeconds])

  useEffect(() => {
    if (timeLeft <= 0) {
      if (hasStartedRef.current) onExpireRef.current?.()
      return
    }
    hasStartedRef.current = true
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval)
          onExpireRef.current?.()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timeLeft])

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  return { timeLeft, formatted: formatTime(timeLeft) }
}
