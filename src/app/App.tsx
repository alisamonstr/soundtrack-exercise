import * as React from 'react'
import { client, graphql } from '../graphql'
import './App.css'
import {
  TrackFragment,
  TrackRow,
  type HistoryTrack,
} from './components/TrackRow.tsx'
import { Header } from './components/Header.tsx'
import { NowPlaying } from './components/NowPlaying.tsx'

/**
 * A selection of various sound zones in the Soundtrack Stockholm office.
 * At least one of these zones should be playing music at any given time.
 * The value represents the "short ID" of the zone, which can be used to get
 * playback history without being authenticated.
 */
export const SOUNDTRACK_ZONES = {
  Lounge: 'BRGJFA',
  Listen: 'ODJECD',
  'Glass Room': 'SNLETO',
} as const

export default function App(): React.ReactNode {
  const searchParams = new URLSearchParams(location.search)
  const currentZone = searchParams.get('zone')
  const shortID =
    SOUNDTRACK_ZONES[currentZone as keyof typeof SOUNDTRACK_ZONES] ||
    SOUNDTRACK_ZONES.Lounge
  const isKioskMode = searchParams.get('kioskMode') === 'true'

  const [entries, setEntries] = React.useState<HistoryTrack[]>([])
  const appendEntry = React.useCallback(
    (entry: OptionalKeys<HistoryTrack, 'id' | 'startedAt' | 'finishedAt'>) => {
      if (!entry?.track) {
        console.error('appendEntry: Incomplete entry', entry)
        return
      }
      const startedAt = new Date().toString()
      entry.startedAt ||= startedAt
      entry.id ||= startedAt
      setEntries((prevTracks) => {
        const lastTrack = prevTracks[0]
        if (lastTrack) {
          lastTrack.finishedAt = startedAt
        }
        return [entry as HistoryTrack, ...prevTracks]
      })
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
    <>
      {!isKioskMode && <Header onAddTrack={appendEntry} />}
      <main className="container mx-auto">
        <div className="grid md:grid-cols-2">
          <NowPlaying entry={entries[0]} />

          {!isKioskMode && (
            <div className="p-4">
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
                      <TrackRow
                        key={historyTrack.startedAt}
                        entry={historyTrack}
                      />
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
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
