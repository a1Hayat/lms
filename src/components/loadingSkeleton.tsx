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


export function CourseCardSkeletonRow() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 w-full">
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="rounded-lg shadow-sm p-4 space-y-4"
        >
          {/* Thumbnail */}
          <Skeleton className="w-full h-48 rounded-md" />

          {/* Title */}
          <Skeleton className="h-6 w-3/4" />

          {/* Level */}
          <Skeleton className="h-4 w-1/4" />

          {/* Description (3 lines) */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>

          {/* Price & Button row */}
          <div className="flex justify-between items-center mt-2">
            <Skeleton className="h-6 w-16" />   {/* price */}
            <Skeleton className="h-8 w-20 rounded" /> {/* button */}
          </div>
        </div>
      ))}
    </div>
  );
}