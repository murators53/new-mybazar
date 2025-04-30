// components/ui/skeletons/FilterSidebarSkeleton.tsx

"use client";

import Skeleton from "../Skeleton";

export default function FilterSidebarSkeleton() {
  return (
    <div className="w-full sm:w-64 border-r hidden sm:block dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 space-y-6">
      {/* Başlık */}
      <p className="text-2xl font-bold">Filtreler</p>

      {/* Kategoriler */}
      <div>
        <Skeleton className="w-24 h-4 mb-2" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      </div>

      {/* Fiyat Aralığı */}
      <div>
        <Skeleton className="w-28 h-4 mb-2" />
        <div className="flex gap-2">
          <Skeleton className="w-[74px] h-8 rounded-lg" />
          <Skeleton className="w-[74px] h-8 rounded-lg" />
        </div>
      </div>

      {/* Stok Durumu */}
      <div>
        <Skeleton className="w-32 h-4 mb-2" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      </div>

      {/* Minimum Puan */}
      <div>
        <Skeleton className="w-28 h-4 mb-2" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      </div>

      {/* Markalar */}
      <div>
        <Skeleton className="w-24 h-4 mb-2" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      </div>

      {/* Buton */}
      <Skeleton className="w-full h-10 rounded" />
    </div>
  );
}
