import { Fragment } from 'react'
import { useQuery } from 'urql'

import type { HistoryTrack } from '../graphql/fragments.ts'
import { TrackRecommendationsQuery } from '../graphql/queries.ts'
import { Skeleton } from './Skeleton.tsx'
import { TrackImage } from './TrackImage.tsx'

export function Recommendations({ entry }: { entry: HistoryTrack | null }) {
  const [result] = useQuery({
    query: TrackRecommendationsQuery,
    variables: { tracks: [entry?.track?.id ?? '0'], first: 5 },
    pause: !entry?.track?.id,
  })
  const entries = result.data?.playlistEditorTrackSuggestions.edges
  const isLoading = result.fetching || result.stale

  if (isLoading) {
    return <RecommendationsLoader />
  }
  if (!entries) {
    return null
  }
  return (
    <div className="px-4">
      <div className="pb-4">Track Recommendations:</div>
      <div className="grid grid-cols-[minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)] gap-4 overflow-x-auto">
        {entries.map((entry) => (
          <div
            key={entry.node.id}
            className="flex min-w-24 flex-col items-start"
          >
            <TrackImage track={entry.node} className="min-h-16 min-w-16" />
            <div>
              <a
                href={`https://business.soundtrackyourbrand.com/search/${entry.node.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-lg font-semibold hover:underline"
              >
                {entry.node.display?.title}
              </a>
              <div>
                {entry.node.artists?.map((artist, index, arr) => (
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
          </div>
        ))}
      </div>
    </div>
  )
}

function RecommendationsLoader() {
  const quantityArray = Array.from({ length: 5 }).map((_, i) => i + 1)
  return (
    <div className="px-4">
      <div className="pb-4">Track Recommendations:</div>
      <div className="grid grid-cols-[minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)] gap-4 overflow-x-auto">
        {quantityArray.map((entry) => (
          <div key={entry} className="flex min-w-24 flex-col items-start gap-2">
            <Skeleton className="min-h-16 min-w-16" />
            <div>
              <Skeleton className="mb-2 h-2 w-10" />
              <Skeleton className="h-2 w-15" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
