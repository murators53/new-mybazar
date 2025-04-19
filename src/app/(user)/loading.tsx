"use client"
import Skeleton from "@/components/ui/Skeleton";
import { useAuthStore } from "@/store/authStore";

export default function Loading() {
      const isLoading = useAuthStore((s) => s.isLoading);
    
  return (
    <>
    {isLoading && 
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-pulse space-y-4 text-center">
            <Skeleton className="h-4 w-48 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </div>}
    </>
  );
}
