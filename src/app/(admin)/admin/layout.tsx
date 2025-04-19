"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const isLoading = useAuthStore((s) => s.isLoading);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!accessToken || !isAdmin)) {
      router.replace("/login");
    }
  }, [accessToken, isAdmin, isLoading]);

  if (isLoading || !accessToken || !isAdmin) {
    return null; // İstersen buraya loading skeleton koyabiliriz sonra
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-col flex-1">
        <AdminNavbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
