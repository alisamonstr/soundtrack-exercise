import { Fragment } from 'react'
import { useSearchParams } from 'react-router'

import type { HistoryTrack } from '../../graphql/fragments.ts'
import useProgress from '../../hooks/useProgress.ts'
import { TrackImage } from '../TrackImage.tsx'
import { CloseKiosModeButton } from './CloseKioskModeButton.tsx'
import { NowPlayingLoader } from './NowPlayingLoader.tsx'

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
    return <NowPlayingLoader isKioskMode={isKioskMode} />
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
