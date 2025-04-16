"use client";

import { useEffect, useState } from "react";
import DelayedSkeleton from "@/components/ui/skeletons/DelayedSkeleton";
import { useAuthStore } from "@/store/authStore";

export default function Loading() {
  const isLoading = useAuthStore((s) => s.isLoading);

  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    // Her yüklemede en az 800ms skeleton göster
    const minDelay = setTimeout(() => setShowSkeleton(false), 800);

    return () => clearTimeout(minDelay); // Temizlik
  }, []);

  // Eğer hala loading'deyiz ya da min süre bitmedi ise skeleton göster
  if (isLoading || showSkeleton) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-pulse space-y-4 text-center">
          <DelayedSkeleton className="h-4 w-48 mx-auto" delay={2500} />
          <DelayedSkeleton className="h-4 w-32 mx-auto" delay={2500} />
        </div>
      </div>
    );
  }

  return null; // Skeleton aşaması bitti
}
