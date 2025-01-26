import { useState } from 'react'
import { SOUNDTRACK_ZONES } from '../App.tsx'
import { DebugToolbar } from './DebugToolbar.tsx'
import type { Track } from './TrackRow.tsx'
import { Link, useSearchParams } from 'react-router'

export function Header(props: {
  onAddTrack: (entry: { track: Track }) => void
}): React.ReactNode {
  const hash = location.hash

  return (
    <header className="h-16 bg-red-50 p-4 md:h-20">
      <div className="container mx-auto flex w-full flex-row justify-between">
        <LoungeSelect />
        {hash.includes('debug') && (
          <DebugToolbar onAddTrack={props.onAddTrack} />
        )}
        <KioskModeButton />
      </div>
    </header>
  )
}

function LoungeSelect() {
  const zones = Object.entries(SOUNDTRACK_ZONES)
  const [searchParams] = useSearchParams()
  const currentZone = searchParams.get('zone')

  const [isOpen, setIsOpen] = useState(false)
  const toggleDropdown = () => setIsOpen((prev) => !prev)

  return (
    <div className="relative w-40 md:w-64">
      <button
        type="button"
        className="flex h-full w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-gray-500"
        onClick={toggleDropdown}
      >
        {/*>zones[0][0] is Lounge, that is used as a default value*/}
        <span>{currentZone ? currentZone : zones[0][0]}</span>
        <div
          className={`h-4 w-4 transition-transform ${isOpen ? '-translate-x-1 rotate-270' : 'translate-x-1 rotate-90'}`}
        >
          ❯
        </div>
      </button>
      {isOpen && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
          {zones.map(([key, value]) => (
            <Link to={`/?zone=${key}`} key={value}>
              <li
                className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${currentZone === key ? 'bg-blue-100' : null}`}
                onClick={() => setIsOpen(false)}
              >
                {key}
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  )
}

function KioskModeButton() {
  return (
    <Link
      to="/?kioskMode=true"
      type="button"
      className="flex items-center rounded-lg bg-gray-700 px-4 text-base text-white shadow-sm hover:bg-gray-500 active:bg-gray-700 active:outline-none"
    >
      Kiosk Mode
    </Link>
  )
}
