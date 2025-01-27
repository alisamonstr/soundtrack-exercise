import { useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'

import { SOUNDTRACK_ZONES } from '../App.tsx'
import { DebugToolbar } from './DebugToolbar.tsx'
import { Track } from '../graphql/fragments.ts'

export function Header(props: {
  onAddTrack: (entry: { track: Track }) => void
}): React.ReactNode {
  const [searchParams] = useSearchParams()

  return (
    <header className="min-h-16 flex-none bg-red-50 p-4 md:h-20">
      <div className="container mx-auto flex w-full flex-row flex-wrap justify-between gap-4">
        <LoungeSelect />
        <div className="order-4 md:order-1">
          {searchParams.get('debug') === 'true' && (
            <DebugToolbar onAddTrack={props.onAddTrack} />
          )}
        </div>
        <KioskModeButton />
      </div>
    </header>
  )
}

function LoungeSelect() {
  const zones = Object.entries(SOUNDTRACK_ZONES)
  const [searchParams] = useSearchParams()
  const location = useLocation()

  const currentZone = searchParams.get('zone')

  const getNewParams = (value: string) => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('zone', value)
    return newParams.toString()
  }

  const [isOpen, setIsOpen] = useState(false)
  const toggleDropdown = () => setIsOpen((prev) => !prev)

  return (
    <div className="relative order-1 w-40 md:w-64">
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
      <ul
        className={`absolute z-10 mt-1 transition-all duration-300 ease-in ${isOpen ? 'max-h-64 shadow-lg' : ''} max-h-0 w-full overflow-y-auto rounded-lg bg-white`}
      >
        {zones.map(([key, value]) => (
          <Link
            to={{
              pathname: location.pathname,
              search: getNewParams(key),
            }}
            key={value}
          >
            <li
              className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${currentZone === key ? 'bg-blue-100' : null}`}
              onClick={() => setIsOpen(false)}
            >
              {key}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  )
}

function KioskModeButton() {
  const [searchParams] = useSearchParams()
  const location = useLocation()

  const newParams = new URLSearchParams(searchParams.toString())
  newParams.set('kioskMode', 'true')
  const newSearch = newParams.toString()
  return (
    <Link
      to={{
        pathname: location.pathname,
        search: newSearch,
      }}
      type="button"
      className="order-3 flex items-center rounded-lg bg-gray-700 px-4 text-base text-white shadow-sm hover:bg-gray-500 active:bg-gray-700 active:outline-none"
    >
      Kiosk Mode
    </Link>
  )
}
