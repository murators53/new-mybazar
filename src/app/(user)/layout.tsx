"use client";

import Navbar from "@/components/Navbar";
import Skeleton from "@/components/ui/Skeleton";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isLoading = useAuthStore((s) => s.isLoading);
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !accessToken) {
      router.push("/login");
    }
  }, [accessToken, isLoading]);

  if (isLoading) return <div className="flex items-center justify-center h-[70vh]">
  <div className="animate-pulse space-y-4 text-center">
    <Skeleton className="h-4 w-48 mx-auto" />
    <Skeleton className="h-4 w-32 mx-auto" />
  </div>
</div>;
  if (!accessToken) return null; // yönlendirme sırasında boş render


  return <>
  <Navbar/>
  {children}</>;
}
