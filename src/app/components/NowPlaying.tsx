import { Fragment } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'

import useProgress from '../hooks/useProgress.ts'
import { Skeleton } from './Skeleton.tsx'
import { TrackImage } from './TrackImage.tsx'
import { HistoryTrack } from '../graphql/fragments.ts'

export function NowPlaying({
  entry,
  isLoading,
}: {
  entry: HistoryTrack | null
  isLoading: boolean
}) {
  const [searchParams] = useSearchParams()
  const isKioskMode = searchParams.get('kioskMode') === 'true'

  const { track, startedAt } = entry || {}

  const startTime = new Date(startedAt || 0).getTime()
  const { progress, totalTime, progressTime } = useProgress(
    startTime,
    track?.durationMs || 0,
  )

  if (isLoading) {
    return <TrackLoader isKioskMode={isKioskMode} />
  }

  if (!entry || !track) {
    return (
      <>
        <p>No track is currently playing.</p>
        {isKioskMode && <CloseKiosModeButton />}
      </>
    )
  }

  return (
    <>
      <TrackImage track={track} className="w-full flex-1" imageSize={800} />
      <div className="w-full">
        <div className="flex w-full items-center gap-4">
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

        <div className="relative mt-4 w-full">
          <div className="h-1 flex-1 bg-gray-400" />
          <div
            className="absolute top-0 h-1 flex-1 bg-white"
            style={{ width: progress + '%' }}
          />
        </div>
      </div>
      {isKioskMode && <CloseKiosModeButton />}
    </>
  )
}

function TrackLoader({ isKioskMode }: { isKioskMode: boolean }) {
  return (
    <>
      <div className="relative w-full flex-1">
        <div className="[container-type:size] absolute flex h-full w-full items-center justify-center">
          <Skeleton
            className={`h-[min(100cqw,100cqh)] w-[min(100cqw,100cqh)] rounded-none`}
          />
        </div>
      </div>

      <div className="w-full">
        <div className="flex w-full items-center gap-4">
          <div className="mt-1 flex flex-1 flex-col gap-4">
            <Skeleton className="h-4 w-30" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div>
            <Skeleton className="h-2 w-10" />
          </div>
        </div>

        <div className="relative mt-4 w-full">
          <Skeleton className="h-1 w-full" />
        </div>
      </div>

      {isKioskMode && <Skeleton className="absolute top-2 right-4 h-6 w-10" />}
    </>
  )
}

function CloseKiosModeButton() {
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const newParams = new URLSearchParams(searchParams.toString())
  newParams.delete('kioskMode')
  const newSearch = newParams.toString()

  return (
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
  )
}
