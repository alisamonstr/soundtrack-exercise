import { useEffect, useState } from 'react'

const formatDuration = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const useProgress = (startTime: number, totalDurationMs: number) => {
  const totalTime = formatDuration(totalDurationMs)

  const [state, setState] = useState(() => {
    // Clamp initial progress time to never exceed totalDurationMs and to never be negative
    const initialProgressTime = Math.min(
      Math.max(Date.now() - startTime, 0),
      totalDurationMs,
    )
    const initialProgress = (initialProgressTime / totalDurationMs) * 100

    return {
      progress: initialProgress,
      progressTime: formatDuration(initialProgressTime),
    }
  })

  useEffect(() => {
    if (startTime <= 0 || totalDurationMs <= 0) return

    const updateProgress = () => {
      const now = Date.now()
      const rawProgressTime = now - startTime

      const progressTime = Math.min(rawProgressTime, totalDurationMs)
      const progress = (progressTime / totalDurationMs) * 100

      setState({
        progress,
        progressTime: formatDuration(progressTime),
      })
    }

    updateProgress()
    const intervalId = setInterval(updateProgress, 1000)

    return () => clearInterval(intervalId)
  }, [startTime, totalDurationMs])

  return { ...state, totalTime }
}

export default useProgress
