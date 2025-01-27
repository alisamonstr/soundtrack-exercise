import { Link, useLocation, useSearchParams } from 'react-router'

export function CloseKiosModeButton() {
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const newParams = new URLSearchParams(searchParams.toString())
  newParams.delete('kioskMode')
  const newSearch = newParams.toString()

  return (
    <Link
      type="button"
      aria-label="Exit kiosk mode"
      className="absolute top-2 right-4 rounded-lg bg-gray-700 px-4 text-white shadow-sm hover:bg-gray-500 active:bg-gray-700 active:outline-none"
      to={{
        pathname: location.pathname,
        search: newSearch,
      }}
    >
      X
    </Link>
  )
}
