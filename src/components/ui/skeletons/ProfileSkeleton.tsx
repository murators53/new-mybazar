import Skeleton from "../Skeleton";

 
export default function ProfileSkeleton() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-8 bg-gray-50 dark:bg-zinc-950">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-zinc-700">
        {/* Başlık ve ikon */}
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gray-200 text-white rounded-full p-8 shadow-md">
            <Skeleton />
          </div>
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Bilgi alanları */}
        <div className="space-y-3 text-base">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </div>

        <div className="mt-6">
          <Skeleton className="h-8 w-1/3 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* 
<div className="max-w-xl mx-auto p-6 border rounded shadow dark:border-zinc-700 space-y-4">
      <Skeleton className="h-8 w-1/3" /> 
      <Skeleton className="h-6 w-2/3" /> 
      <Skeleton className="h-6 w-2/5" /> 
      <Skeleton className="h-20 w-full mt-6" /> 
      </div>
      */
