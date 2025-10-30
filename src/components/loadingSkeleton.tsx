import { Skeleton } from "@/components/ui/skeleton"

export function LoadingSkeletonTable() {
  return (
    <div className="w-full space-y-3">
      {/* header row */}
      <Skeleton className="h-10 w-full" />

      {/* table rows */}
      {[...Array(1)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-8 w-1/6" />   {/* column 1 */}
          <Skeleton className="h-8 w-1/3" />   {/* column 2 */}
          <Skeleton className="h-8 w-1/4" />   {/* column 3 */}
          <Skeleton className="h-8 w-1/6" />   {/* column 4 */}
        </div>
      ))}
    </div>
  )
}

export function LoadingSkeletonView() {
  return (
    <div className="w-full space-y-3">
      {/* header row */}
      <Skeleton className="h-10 w-full" />

      {/* table rows */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-8 w-1/6" />   {/* column 1 */}
          <Skeleton className="h-8 w-1/3" />   {/* column 2 */}
          <Skeleton className="h-8 w-1/4" />   {/* column 3 */}
          <Skeleton className="h-8 w-1/6" />   {/* column 4 */}
        </div>
      ))}
    </div>
  )
}
