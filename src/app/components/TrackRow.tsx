import { Fragment, ReactNode } from 'react'

import { FragmentOf, graphql } from '../../graphql.ts'
import { formatDuration } from '../hooks/useProgress.ts'
import useRelativeTime from '../hooks/useRelativeTime.ts'
import { TrackImage } from './TrackImage.tsx'

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

export const ColorsFragment = graphql(/* GraphQL */ `
  fragment ColorsFragment on Display {
    colors {
      primary {
        hex
      }
      secondary {
        hex
      }
    }
  }
`)

/**
 * Fields used to display a given entity.
 * Most of the types available in the Soundtrack API implements this interface.
 */
export const DisplayableFragment = graphql(
  /* GraphQL */ `
    fragment DisplayableFragment on Displayable {
      display {
        title
        image {
          placeholder
        }
        ...ColorsFragment
      }
    }
  `,
  [ColorsFragment],
)

export type Displayable = FragmentOf<typeof DisplayableFragment>

export const TrackFragment = graphql(
  /* GraphQL */ `
    fragment TrackFragment on Track {
      id
      durationMs
      artists {
        id
        name
      }
      ...DisplayableFragment
    }
  `,
  [DisplayableFragment],
)

export type Track = FragmentOf<typeof TrackFragment>

export const HistoryTrackFragment = graphql(
  /* GraphQL */ `
    fragment HistoryTrackFragment on HistoryTrack {
      id
      startedAt
      finishedAt
      track {
        ...TrackFragment
      }
    }
  `,
  [TrackFragment],
)

export type HistoryTrack = FragmentOf<typeof HistoryTrackFragment>
