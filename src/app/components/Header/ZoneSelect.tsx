import { useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'

import { SOUNDTRACK_ZONES } from '../../constants.ts'

export function ZoneSelect() {
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
