import { useState } from 'react'
import { Displayable, Track } from './TrackRow.tsx'

/** Generates a valid URL for a displayable image utilizing the `placeholder` field. */
export function displayImageUrl(
  display: Displayable['display'],
  width: number,
  height = width,
) {
  return display?.image?.placeholder
    ?.replace('%w', width.toString())
    .replace('%h', height.toString())
}

interface TrackImageProps {
  track: Track
}

export function TrackImage({ track }: TrackImageProps) {
  const [loaded, setLoaded] = useState(false)

  const primaryHex = track.display?.colors?.primary?.hex ?? '#666666'
  const secondaryHex = track.display?.colors?.secondary?.hex ?? '#999999'

  const imageUrl = displayImageUrl(track.display, 300)
  const title = track.display?.title ?? ''
  const artists = track.artists?.map((artist) => artist.name).join(', ') || ''

  return (
    <div className="relative h-16 w-16">
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background: `linear-gradient(to bottom right, ${primaryHex}, ${secondaryHex})`,
        }}
      />

      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`Album cover for ${title} by ${artists}`}
          className="cover h-16 w-16 object-contain"
          onLoad={() => {
            setLoaded(true)
          }}
        />
      ) : (
        <div
          className="cover h-16 w-16 object-contain"
          style={{
            background: `linear-gradient(to bottom right, ${primaryHex}, ${secondaryHex})`,
          }}
        />
      )}
    </div>
  )
}
