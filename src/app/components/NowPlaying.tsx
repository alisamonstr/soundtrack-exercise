import { Fragment } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'

import useProgress from '../hooks/useProgress.ts'
import { Skeleton } from './Skeleton.tsx'
import { TrackImage } from './TrackImage.tsx'
import { HistoryTrack } from './TrackRow'

export function NowPlaying({
  entry,
  isLoading,
}: {
  entry: HistoryTrack | null
  isLoading: boolean
}) {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const isKioskMode = searchParams.get('kioskMode') === 'true'

  const { track, startedAt } = entry || {}

  const startTime = new Date(startedAt || 0).getTime()
  const { progress, totalTime, progressTime } = useProgress(
    startTime,
    track?.durationMs || 0,
  )
  const newParams = new URLSearchParams(searchParams.toString())
  newParams.delete('kioskMode')
  const newSearch = newParams.toString()

  if (isLoading) {
    return <TrackLoader isKioskMode={isKioskMode} />
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
      className={`relative h-full bg-gray-800 p-4 text-white transition-all duration-500 ${isKioskMode ? 'col-span-2 h-screen' : ''}`}
    >
      <div className="flex items-center gap-4">
        <TrackImage track={track} />

        <div className="flex-1">
          <a
            href={`https://business.soundtrackyourbrand.com/search/${track.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer text-lg font-semibold hover:underline"
          >
            {track.display?.title}
          </a>
          <div>
            {track.artists?.map((artist, index, arr) => (
              <Fragment key={artist.name}>
                <a
                  href={`https://business.soundtrackyourbrand.com/search/${artist.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer text-sm text-gray-400 hover:underline"
                >
                  {artist.name}
                </a>
                {index < arr.length - 1 && ', '}
              </Fragment>
            ))}
          </div>
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
        <Link
          type="button"
          aria-label="Exit kiosk mode"
          className="absolute top-2 right-4 rounded-lg bg-gray-700 px-4 text-white shadow-sm hover:bg-gray-500 active:bg-gray-700 active:outline-none"
          to={{
            pathname: location.pathname,
            search: newSearch,
          }}
        >
          X
        </Link>
      )}
    </div>
  )
}

function TrackLoader({ isKioskMode }: { isKioskMode: boolean }) {
  return (
    <div
      className={`relative h-full bg-gray-800 p-4 text-white transition-all duration-500 ${isKioskMode ? 'col-span-2 h-screen' : ''}`}
    >
      <div className="flex items-center gap-4">
        <Skeleton className="size-16" />

        <div className="flex flex-1 flex-col gap-4">
          <Skeleton className="h-2 w-30" />

          <div>
            <Skeleton className="h-2 w-20" />
          </div>
        </div>
      </div>

      <div className="relative mt-4">
        <Skeleton className="h-1 w-full" />
      </div>
      {isKioskMode && <Skeleton className="absolute top-2 right-4 h-6 w-8" />}
    </div>
  )
}
