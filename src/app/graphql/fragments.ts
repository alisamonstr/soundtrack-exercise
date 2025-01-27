import { FragmentOf, graphql } from '../../graphql.ts'

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
