import { useSearchParams } from 'react-router'

import type { Track } from '../../graphql/fragments.ts'
import { DebugToolbar } from './DebugToolbar.tsx'
import { OpenKioskModeButton } from './OpenKioskModeButton.tsx'
import { ZoneSelect } from './ZoneSelect.tsx'

export function Header(props: {
  onAddTrack: (entry: { track: Track }) => void
}): React.ReactNode {
  const [searchParams] = useSearchParams()

  return (
    <header className="min-h-16 flex-none bg-amber-100 p-4 md:h-20">
      <div className="container mx-auto flex w-full flex-row flex-wrap justify-between gap-4">
        <ZoneSelect />
        <div className="order-4 md:order-1">
          {searchParams.get('debug') === 'true' && (
            <DebugToolbar onAddTrack={props.onAddTrack} />
          )}
        </div>
        <OpenKioskModeButton />
      </div>
    </header>
  )
}
