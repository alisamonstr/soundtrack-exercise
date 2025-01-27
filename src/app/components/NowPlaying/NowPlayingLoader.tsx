import { Skeleton } from '../Skeleton.tsx'

export function NowPlayingLoader({ isKioskMode }: { isKioskMode: boolean }) {
  return (
    <>
      <div className="relative w-full flex-1">
        <div className="[container-type:size] absolute flex h-full w-full items-center justify-center">
          <Skeleton
            className={`h-[min(100cqw,100cqh)] w-[min(100cqw,100cqh)] rounded-none`}
          />
        </div>
      </div>

      <div className="w-full">
        <div className="flex w-full items-center gap-4">
          <div className="mt-1 flex flex-1 flex-col gap-4">
            <Skeleton className="h-4 w-30" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div>
            <Skeleton className="h-2 w-10" />
          </div>
        </div>

        <div className="relative mt-4 w-full">
          <Skeleton className="h-1 w-full" />
        </div>
      </div>

      {isKioskMode && <Skeleton className="absolute top-2 right-4 h-6 w-10" />}
    </>
  )
}
