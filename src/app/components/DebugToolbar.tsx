import * as React from 'react'

import { client, graphql } from '../../graphql.ts'
import { type Track, TrackFragment } from './TrackRow.tsx'

/**
 * A debug toolbar used to artificially add tracks to the history.
 */
export function DebugToolbar(props: {
  onAddTrack: (entry: { track: Track }) => void
}): React.ReactNode {
  const [state, setState] = React.useState<'idle' | 'loading' | 'error'>('idle')
  return (
    <form
      className="flex gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        if (state === 'loading') return
        const form = event.currentTarget as HTMLFormElement
        const input = form.elements.namedItem('query') as HTMLInputElement
        const query = input.value.trim()
        if (!query) return
        setState('loading')
        client
          .query(TrackSearchQuery, { query })
          .toPromise()
          .then((result) => {
            const track = result.data?.search?.edges[0].node
            if (track?.__typename !== 'Track') {
              throw new Error('DebugToolbar: No track found')
            }
            props.onAddTrack({ track })
            setState('idle')
          })
          .catch((error) => {
            setState('error')
            throw error
          })
      }}
    >
      <input
        name="query"
        type="text"
        size={30}
        placeholder="Search for track via name/artist"
        onFocus={(e) => e.currentTarget.select()}
        className="rounded-lg border border-gray-100 bg-white p-2 shadow-sm outline-gray-500"
      />
      <button
        type="submit"
        disabled={state === 'loading'}
        children="Add"
        className="flex items-center rounded-lg bg-gray-700 px-4 text-base text-white shadow-sm hover:bg-gray-500 active:bg-gray-700 active:outline-none"
      />
    </form>
  )
}

const TrackSearchQuery = graphql(
  /* GraphQL */ `
    query TrackSearchQuery($query: String!) {
      search(query: $query, type: track, market: SE, first: 1) {
        edges {
          node {
            __typename
            ...TrackFragment
          }
        }
      }
    }
  `,
  [TrackFragment],
)
