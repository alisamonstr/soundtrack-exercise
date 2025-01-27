import { Skeleton } from '../Skeleton.tsx'

export function TrackRowLoader() {
  return (
    <>
      <div className="flex gap-2">
        <Skeleton className="size-16" />
        <div className="flex flex-col gap-2 pt-4">
          <Skeleton className="h-2 w-15" />
          <Skeleton className="h-2 w-20" />
        </div>
      </div>
      <div>
        <Skeleton className="w:20 mt-2 h-2 md:w-20" />
      </div>
      <div className="hidden md:block">
        <Skeleton className="mt-2 h-2 w-10" />
      </div>
    </>
  )
}
