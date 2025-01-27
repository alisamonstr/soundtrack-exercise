import { useState } from 'react'
import { Displayable, Track } from '../graphql/fragments.ts'

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

export function TrackImage({
  track,
  className = '',
  imageSize = 300,
}: {
  track: Track
  imageSize?: number
  className?: string
}) {
  const [loaded, setLoaded] = useState(false)
  const primaryHex = track.display?.colors?.primary?.hex ?? '#666666'
  const secondaryHex = track.display?.colors?.secondary?.hex ?? '#999999'

  const imageUrl = displayImageUrl(track.display, imageSize)
  const title = track.display?.title ?? ''
  const artists = track.artists?.map((artist) => artist.name).join(', ') || ''

  return (
    <div className={`relative ${className}`}>
      <div className="[container-type:size] absolute inset-0 flex h-full w-full items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Album cover for ${title} by ${artists}`}
            className={`h-[min(100cqw,100cqh)] w-[min(100cqw,100cqh)] object-contain`}
            onLoad={async () => {
              setLoaded(true)
            }}
          />
        ) : (
          <div
            className={`h-[min(100cqw,100cqh)] w-[min(100cqw,100cqh)]`}
            style={{
              background: `linear-gradient(to bottom right, ${primaryHex}, ${secondaryHex})`,
            }}
          />
        )}
      </div>

      <div className="[container-type:size] absolute inset-0 flex h-full w-full items-center justify-center">
        <div
          className={`h-[min(100cqw,100cqh)] w-[min(100cqw,100cqh)] transition-opacity duration-500 ${
            loaded ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            background: `linear-gradient(to bottom right, ${primaryHex}, ${secondaryHex})`,
          }}
        />
      </div>
    </div>
  )
}
