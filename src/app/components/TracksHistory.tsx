import { Skeleton } from './Skeleton.tsx'
import { HistoryTrack, TrackRow } from './TrackRow.tsx'

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
    <div className="p-4">
      <table className="history">
        <thead>
          <tr>
            <th className="cover p-4"></th>
            <th>Title</th>
            <th>Artists</th>
            <th>Played</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <TrackRowLoader />
          ) : (
            entries.map((historyTrack) => {
              return (
                <TrackRow key={historyTrack.startedAt} entry={historyTrack} />
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

function TrackRowLoader() {
  return (
    <tr>
      <td className="px-2">
        <Skeleton className="size-16" />
      </td>
      <td>
        <Skeleton className="h-2 w-30" />
      </td>
      <td>
        <Skeleton className="h-2 w-30" />
      </td>
      <td>
        <Skeleton className="h-2 w-20" />
      </td>
    </tr>
  )
}
