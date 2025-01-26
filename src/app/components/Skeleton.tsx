export function Skeleton({ className = '' }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-gray-300 ${className}`}></div>
  )
}
