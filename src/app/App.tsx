import { ReactNode, useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { client, graphql } from '../graphql'
import { Header } from './components/Header.tsx'
import { NowPlaying } from './components/NowPlaying.tsx'
import { type HistoryTrack, TrackFragment } from './components/TrackRow.tsx'
import { TracksHistory } from './components/TracksHistory.tsx'

import './App.css'

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

export default function App(): ReactNode {
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)

  const currentZone = searchParams.get('zone')
  const shortID =
    SOUNDTRACK_ZONES[currentZone as keyof typeof SOUNDTRACK_ZONES] ||
    SOUNDTRACK_ZONES.Lounge
  const isKioskMode = searchParams.get('kioskMode') === 'true'

  const [entries, setEntries] = useState<HistoryTrack[]>([])
  const appendEntry = useCallback(
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

  useEffect(() => {
    setIsLoading(true)
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
      .finally(() => {
        setIsLoading(false)
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
          <NowPlaying entry={entries[0]} isLoading={isLoading} />

          {!isKioskMode && (
            <TracksHistory entries={entries} isLoading={isLoading} />
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
