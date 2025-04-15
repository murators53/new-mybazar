import Skeleton from "../Skeleton";

export default function ProductSkeleton() {
  return (
    <div className="border border-blue-100 rounded-md p-2 flex flex-col gap-2">
      <Skeleton className="h-40 w-full rounded-full mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-6 w-1/3 mb-4" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
