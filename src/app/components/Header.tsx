import { useState } from 'react'
import { SOUNDTRACK_ZONES } from '../App.tsx'

export function Header() {
  return (
    <div className="flex h-16 w-full flex-row justify-between bg-red-50 p-4 md:h-20">
      <LoungeSelect />
      <KioskModeButton />
    </div>
  )
}

function LoungeSelect() {
  const zones = Object.entries(SOUNDTRACK_ZONES)
  const searchParams = new URLSearchParams(location.search)
  const currentZone = searchParams.get('zone')

  const [isOpen, setIsOpen] = useState(false)
  const toggleDropdown = () => setIsOpen((prev) => !prev)

  const handleOptionClick = (option: (typeof zones)[0]) => {
    const currentUrl = new URL(location.href)
    currentUrl.searchParams.set('zone', option[0])
    setIsOpen(false)
    location.href = currentUrl.toString()
  }
  return (
    <div className="relative w-40 md:w-64">
      <button
        type="button"
        className="flex h-full w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-gray-500"
        onClick={toggleDropdown}
      >
        {/*>TODO:fix default value*/}
        <span>{currentZone ? currentZone : zones[0][0]}</span>
        <div
          className={`h-4 w-4 transition-transform ${isOpen ? '-translate-x-1 rotate-270' : 'translate-x-1 rotate-90'}`}
        >
          ❯
        </div>
      </button>
      {isOpen && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
          {zones.map((option) => (
            <li
              key={option[1]}
              className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${currentZone === option[0] ? 'bg-blue-100' : null}`}
              onClick={() => handleOptionClick(option)}
            >
              {option[0]}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function KioskModeButton() {
  const switchOnKioskMode = () => {
    const currentUrl = new URL(location.href)
    currentUrl.searchParams.set('kioskMode', 'true')
    location.href = currentUrl.toString()
  }

  return (
    <button
      type="button"
      className="flex items-center rounded-lg bg-gray-700 px-4 text-base text-white shadow-sm hover:bg-gray-500 active:bg-gray-700 active:outline-none"
      onClick={switchOnKioskMode}
    >
      Kiosk Mode
    </button>
  )
}
