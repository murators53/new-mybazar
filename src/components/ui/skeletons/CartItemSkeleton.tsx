import Skeleton from "../Skeleton";

export default function CartItemSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 border p-4 rounded-xl bg-white dark:bg-zinc-900 shadow-sm">
      <div className="flex items-center gap-4">
        <Skeleton className="w-20 h-20 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-16 rounded" />
      </div>
    </div>
  );
}
