import * as React from 'react'
import { client, graphql } from '../graphql'
import { TrackFragment, type Track } from './TrackRow'

/**
 * A debug toolbar used to artificially add tracks to the history.
 */
export function DebugToolbar(props: {
  onAddTrack: (entry: { track: Track }) => void
}): React.ReactNode {
  const [state, setState] = React.useState<'idle' | 'loading' | 'error'>('idle')
  return (
    <form
      className="DebugToolbar"
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
      />
      <button type="submit" disabled={state === 'loading'} children="Add" />
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
