import { Fragment, ReactNode } from 'react'

import { formatDuration } from '../hooks/useProgress.ts'
import useRelativeTime from '../hooks/useRelativeTime.ts'
import { TrackImage } from './TrackImage.tsx'
import { HistoryTrack } from '../graphql/fragments.ts'

export function TrackRow(props: { entry: HistoryTrack }): ReactNode {
  const { entry } = props
  const { track } = entry
  if (!entry || !track) return null

  const relativeTime = useRelativeTime(new Date(entry.finishedAt).getTime())
  return (
    <>
      <div className="flex gap-2">
        <TrackImage track={track} className="min-h-16 min-w-16" />
        <div className="flex w-full flex-col">
          <a
            href={`https://business.soundtrackyourbrand.com/search/${track.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer hover:underline"
          >
            <strong> {track.display?.title}</strong>
          </a>
          <p>
            {track.artists?.map((artist, index, arr) => (
              <Fragment key={artist.name}>
                <a
                  href={`https://business.soundtrackyourbrand.com/search/${artist.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer hover:underline"
                >
                  {artist.name}
                </a>
                {index < arr.length - 1 && ', '}
              </Fragment>
            ))}
          </p>
        </div>
      </div>
      <div>{entry.finishedAt ? relativeTime : 'Now Playing'}</div>
      <div className="hidden md:block">
        {track.durationMs ? formatDuration(track.durationMs) : ''}
      </div>
    </>
  )
}
