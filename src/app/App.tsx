import { ReactNode, useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { client } from '../graphql'
import { Header } from './components/Header/Header.tsx'
import { NowPlaying } from './components/NowPlaying/NowPlaying.tsx'
import { Recommendations } from './components/Recommendations.tsx'
import { TracksHistory } from './components/TrackHistory/TracksHistory.tsx'
import { SOUNDTRACK_ZONES } from './constants.ts'
import type { HistoryTrack } from './graphql/fragments.ts'
import { ZoneNowPlayingQuery } from './graphql/queries.ts'
import { ZoneSubscription } from './graphql/subscriptions.ts'

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
      <main className="flex h-auto min-h-dvh flex-col md:h-dvh">
        {!isKioskMode && <Header onAddTrack={appendEntry} />}
        <div className="flex-1 md:overflow-hidden">
          <div className="container mx-auto h-full">
            <div className="block h-full md:grid md:grid-cols-2">
              <div
                className={`relative flex h-[370px] flex-col items-center justify-around gap-4 bg-gray-800 p-4 text-white md:h-full md:p-8 ${isKioskMode ? '!fixed inset-0 z-10 h-screen w-screen' : ''}`}
              >
                <NowPlaying entry={entries[0]} isLoading={isLoading} />
              </div>
              {!isKioskMode && (
                <TracksHistory entries={entries} isLoading={isLoading} />
              )}
            </div>
          </div>
        </div>
      </main>
      {!isKioskMode && (
        <div className="container mx-auto py-4">
          <Recommendations entry={entries[0]} />
        </div>
      )}
    </>
  )
}

/** Marks specific keys of an object as optional/nullable. */
type OptionalKeys<T, K extends PropertyKey = PropertyKey> = Omit<T, K> & {
  [P in keyof T]?: T[P] | null
}
