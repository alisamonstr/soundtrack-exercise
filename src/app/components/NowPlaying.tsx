import { HistoryTrack } from './TrackRow'
import { TrackImage } from './TrackImage.tsx'
import useProgress from '../hooks/useProgress.ts'

interface NowPlayingBarProps {
  entry: HistoryTrack | null
}

export function NowPlaying({ entry }: NowPlayingBarProps) {
  const searchParams = new URLSearchParams(location.search)
  const isKioskMode = searchParams.get('kioskMode') === 'true'

  const { track, startedAt } = entry || {}

  const startTime = new Date(startedAt || 0).getTime()
  const { progress, totalTime, progressTime } = useProgress(
    startTime,
    track?.durationMs || 0,
  )

  const switchOffKioskMode = () => {
    const currentUrl = new URL(location.href)
    currentUrl.searchParams.delete('kioskMode')
    location.href = currentUrl.toString()
  }

  if (!entry || !track) {
    return (
      <div
        className={`bg-gray-800 p-4 text-white ${isKioskMode ? 'col-span-2 h-screen' : ''}`}
      >
        <p>No track is currently playing.</p>
      </div>
    )
  }

  return (
    <div
      className={`relative bg-gray-800 p-4 text-white ${isKioskMode ? 'col-span-2 h-screen' : ''}`}
    >
      <div className="flex items-center gap-4">
        <TrackImage track={track} />

        <div className="flex-1">
          <p className="text-lg font-semibold">{track.display?.title}</p>
          <p className="text-sm text-gray-400">
            {track.artists?.map((artist) => artist.name).join(', ')}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-400">
            {progressTime} / {totalTime}
          </p>
        </div>
      </div>

      <div className="relative mt-4">
        <div className="h-1 flex-1 bg-gray-400" />
        <div
          className="absolute top-0 h-1 flex-1 bg-white"
          style={{ width: progress + '%' }}
        />
      </div>

      {isKioskMode && (
        <button
          type="button"
          aria-label="Exit kiosk mode"
          className="absolute top-2 right-4 rounded-lg bg-gray-700 px-4 text-white shadow-sm hover:bg-gray-500 active:bg-gray-700 active:outline-none"
          onClick={switchOffKioskMode}
        >
          X
        </button>
      )}
    </div>
  )
}
