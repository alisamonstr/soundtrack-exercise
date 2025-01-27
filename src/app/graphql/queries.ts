import { graphql } from '../../graphql.ts'
import { TrackFragment } from './fragments.ts'

export const ZoneNowPlayingQuery = graphql(
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

export const TrackSearchQuery = graphql(
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

export const TrackRecommendationsQuery = graphql(
  /* GraphQL */ `
    query TrackRecommendationsQuery($tracks: [ID!]!, $first: Int) {
      playlistEditorTrackSuggestions(tracks: $tracks, first: $first) {
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
