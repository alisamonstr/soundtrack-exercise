import * as React from 'react'
import { client, graphql } from '../graphql'
import './App.css'
import { TrackFragment, TrackRow, type HistoryTrack } from './TrackRow'
import { DebugToolbar } from './DebugToolbar'

/**
 * A selection of various sound zones in the Soundtrack Stockholm office.
 * At least one of these zones should be playing music at any given time.
 * The value represents the "short ID" of the zone, which can be used to get
 * playback history without being authenticated.
 */
const SOUNDTRACK_ZONES = {
  Lounge: 'BRGJFA',
  Listen: 'ODJECD',
  'Glass Room': 'SNLETO',
} as const

export default function App(): React.ReactNode {
  const shortID = location.hash?.slice(1) || SOUNDTRACK_ZONES.Lounge

  const [entries, setEntries] = React.useState<HistoryTrack[]>([])
  const appendEntry = React.useCallback(
    (entry: OptionalKeys<HistoryTrack, 'id' | 'startedAt'>) => {
      if (!entry?.track) {
        console.error('appendEntry: Incomplete entry', entry)
        return
      }
      const startedAt = new Date().toString()
      entry.startedAt ||= startedAt
      entry.id ||= startedAt
      setEntries((prevTracks) => [entry as HistoryTrack, ...prevTracks])
    },
    [],
  )

  React.useEffect(() => {
    let isActive = true
    const subscriptions: Array<() => void> = []
    setEntries((entries) => (entries.length ? [] : entries))
    client
      .query(ZoneNowPlayingQuery, { shortID })
      .toPromise()
      .then((result) => {
        if (!isActive) return
        appendEntry(result.data?.nowPlaying!)
        const subscription = client
          .subscription(ZoneSubscription, { shortID })
          .subscribe((result) => {
            appendEntry(result.data?.nowPlayingUpdate?.nowPlaying!)
          })
        subscriptions.push(subscription.unsubscribe)
      })
    return () => {
      isActive = false
      subscriptions.forEach((unsubscribe) => unsubscribe())
    }
  }, [shortID])

  return (
    <main>
      <DebugToolbar onAddTrack={appendEntry} />
      <table className="history">
        <thead>
          <tr>
            <th className="cover"></th>
            <th>Title</th>
            <th>Artists</th>
            <th>Played</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((historyTrack) => {
            return (
              <TrackRow key={historyTrack.startedAt} entry={historyTrack} />
            )
          })}
        </tbody>
      </table>
    </main>
  )
}

const ZoneNowPlayingQuery = graphql(
  /* GraphQL */ `
    query ZoneNowPlayingQuery($shortID: ID!) {
      nowPlaying(soundZone: $shortID) {
        soundZone
        startedAt
        track {
          ...TrackFragment
        }
      }
    }
  `,
  [TrackFragment],
)

const ZoneSubscription = graphql(
  /* GraphQL */ `
    subscription ZoneSubscription($shortID: ID!) {
      nowPlayingUpdate(input: { soundZone: $shortID }) {
        nowPlaying {
          startedAt
          track {
            ...TrackFragment
          }
        }
      }
    }
  `,
  [TrackFragment],
)

/** Marks specific keys of an object as optional/nullable. */
type OptionalKeys<T, K extends PropertyKey = PropertyKey> = Omit<T, K> & {
  [P in keyof T]?: T[P] | null
}
