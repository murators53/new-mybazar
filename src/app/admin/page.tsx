"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import LoadingScreen from "@/components/LoadingScreen";

const AdminPage = () => {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (isLoading) return; // ⏳ token hâlâ yükleniyor → bekle

    if (!accessToken) {
      router.push("/login");
    }

    const checkAdmin = async () => {
      const res = await fetch("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!data.isAdmin) {
        router.push("/");
      }
    };

    checkAdmin();
  }, [accessToken, isLoading]);

  if (isLoading) {
    return <LoadingScreen/>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">🔐 Admin Panel</h1>
      <p>Sadece admin kullanıcılar bu sayfayı görebilir.</p>
    </div>
  );
};

export default AdminPage;
