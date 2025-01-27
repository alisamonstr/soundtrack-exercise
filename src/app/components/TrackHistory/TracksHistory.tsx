import type { HistoryTrack } from '../../graphql/fragments.ts'
import { TrackRow } from './TrackRow.tsx'
import { TrackRowLoader } from './TrackRowLoader.tsx'

export function TracksHistory({
  entries,
  isLoading,
}: {
  entries: HistoryTrack[]
  isLoading: boolean
}) {
  if (!isLoading && !entries) {
    return 'No tracks are playing'
  }
  return (
    <div className="max-h-full overflow-y-auto p-4">
      <div className="mb-4 grid w-full grid-cols-[minmax(auto,auto)_100px] gap-4 md:grid-cols-[minmax(auto,auto)_100px_50px]">
        <div>Title</div>
        <div>Last played</div>
        <div className="hidden md:block">Time</div>
        <div className="col-span-3 border border-gray-400" />

        {isLoading ? (
          <TrackRowLoader />
        ) : (
          entries.map((historyTrack) => {
            return (
              <TrackRow key={historyTrack.startedAt} entry={historyTrack} />
            )
          })
        )}
      </div>
    </div>
  )
}
