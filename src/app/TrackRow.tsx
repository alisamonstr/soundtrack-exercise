import { FragmentOf, graphql } from '../graphql'

export function TrackRow(props: { entry: HistoryTrack }): React.ReactNode {
  const { entry } = props
  const { track } = entry
  if (!entry || !track) return null

  return (
    <tr>
      <td>
        {track.display?.image?.placeholder ? (
          <img
            src={displayImageUrl(track.display, 300)}
            alt={`Album cover for ${track.display.title} by ${track.artists?.map((artist) => artist.name).join(', ')}`}
            className="cover"
          />
        ) : (
          <div className="cover" />
        )}
      </td>
      <td>{track.display?.title}</td>
      <td>{track.artists?.map((artist) => artist.name).join(', ')}</td>
      <td>{new Date(entry.startedAt).toLocaleTimeString()}</td>
    </tr>
  )
}

/** Generates a valid URL for a displayable image utilizing the `placeholder` field. */
export function displayImageUrl(
  display:
    | { image?: { placeholder?: string | null } | null }
    | null
    | undefined,
  width: number,
  height = width,
) {
  return display?.image?.placeholder
    ?.replace('%w', width.toString())
    .replace('%h', height.toString())
}

/**
 * Fields used to display a given entity.
 * Most of the types available in the Soundtrack API implements this interface.
 */
export const DisplayableFragment = graphql(/* GraphQL */ `
  fragment DisplayableFragment on Displayable {
    display {
      title
      image {
        placeholder
      }
    }
  }
`)

export const TrackFragment = graphql(
  /* GraphQL */ `
    fragment TrackFragment on Track {
      id
      ...DisplayableFragment
      artists {
        id
        name
      }
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
      track {
        ...TrackFragment
      }
    }
  `,
  [TrackFragment],
)

export type HistoryTrack = FragmentOf<typeof HistoryTrackFragment>
