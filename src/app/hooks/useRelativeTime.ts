import { useEffect, useState } from 'react'

const getRelativeTime = (timestamp: number) => {
  const now = Date.now()
  const secondsAgo = Math.floor((now - timestamp) / 1000)

  if (!timestamp) {
    return ''
  }

  if (secondsAgo < 60) {
    return `${secondsAgo} second${secondsAgo === 1 ? '' : 's'} ago`
  }

  const minutesAgo = Math.floor(secondsAgo / 60)
  if (minutesAgo < 60) {
    return `${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`
  }

  const hoursAgo = Math.floor(minutesAgo / 60)
  return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`
}

const useRelativeTime = (timestamp: number) => {
  const [relativeTime, setRelativeTime] = useState(getRelativeTime(timestamp))

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeTime(getRelativeTime(timestamp))
    }, 1000)

    return () => clearInterval(interval)
  }, [timestamp])

  return relativeTime
}

export default useRelativeTime
