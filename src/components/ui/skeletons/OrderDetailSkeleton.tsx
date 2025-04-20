import Skeleton from "@/components/ui/Skeleton";

export default function OrderDetailSkeleton() {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-md space-y-8">
    {/* Başlık */}
    <h2 className="text-3xl font-bold mb-6 text-center">📦 Sipariş Detayı</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {[...Array(2)].map((_, i) => (
            <div className="flex flex-col" key={i}>
              <span className="text-sm font-medium text-gray-500">
                <Skeleton className="h-8 w-32 mb-4" />
              </span>
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                <Skeleton className="h-8 w-32 mb-4" />
              </span>
            </div>
          ))}
      </div>

      <div className="mb-4">
        <Skeleton className="h-8 w-40 " />
      </div>

      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg bg-gray-50 dark:bg-zinc-800 flex justify-between items-center hover:shadow-sm transition"
          >
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>

      <Skeleton className="mt-6 h-10 w-24" />
    </div>
  );
}
