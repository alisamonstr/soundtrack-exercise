import { Link, useLocation, useSearchParams } from 'react-router'

export function OpenKioskModeButton() {
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
