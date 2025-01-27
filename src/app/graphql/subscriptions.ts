import { graphql } from '../../graphql.ts'
import { TrackFragment } from './fragments.ts'

export const ZoneSubscription = graphql(
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
