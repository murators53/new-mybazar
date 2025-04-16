"use client";

import Navbar from "@/components/Navbar";
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
      router.replace("/login");
    }
  }, [isLoading, accessToken]);

  if (!accessToken) return null;

  /* if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-pulse space-y-4 text-center">
            <Skeleton className="h-4 w-48 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </div>
      </>
    );
  } */

  return (
    <>
      <Navbar />
      {/* {isLoading ? (
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-pulse space-y-4 text-center">
            <Skeleton className="h-4 w-48 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </div>
      ) : (
        children
      )} */}
      {children}
    </>
  );
}
