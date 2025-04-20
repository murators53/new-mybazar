"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Package, ShoppingCart, Users } from "lucide-react";

export default function AdminDashboardPage() {
  const [productsCount, setProductsCount] = useState<number | null>(null);
  const [ordersCount, setOrdersCount] = useState<number | null>(null);
  const [usersCount, setUsersCount] = useState<number | null>(null);
  const accessToken = useAuthStore((s) => s.accessToken);

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error("Veri alınamadı");

      const data = await res.json();
      console.log("📊 Admin Dashboard verisi:", data);

      setProductsCount(data.productsCount);
      setOrdersCount(data.ordersCount);
      setUsersCount(data.usersCount);

      setLastUpdated(new Date()); // 🔥 burası yeni!
    } catch (err) {
      console.error("❌ Dashboard verisi alınamadı:", err);
    }
  };
  useEffect(() => {
    if (accessToken) fetchDashboardData();
  }, [accessToken]);

  const handleRefresh = () => {
    if (accessToken) {
      fetchDashboardData();
    }
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return "Veriler yükleniyor...";

    const secondsAgo = Math.floor(
      (new Date().getTime() - lastUpdated.getTime()) / 1000
    );

    if (secondsAgo < 60) return `🕒 ${secondsAgo} saniye önce güncellendi`;
    if (secondsAgo < 3600)
      return `🕒 ${Math.floor(secondsAgo / 60)} dakika önce güncellendi`;
    return `🕒 ${Math.floor(secondsAgo / 3600)} saat önce güncellendi`;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="text-base text-gray-500 dark:text-gray-400">
          {formatLastUpdated()}
        </div>

        <button
          onClick={handleRefresh}
          className="text-base text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
        >
          🔄 Yenile
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">👑 Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Toplam Kullanıcılar */}
        <DashboardCard
          icon={
            <Users className="text-blue-600 dark:text-blue-400 w-12 h-12 mb-4" />
          }
          title="Toplam Kullanıcılar"
          value={usersCount}
        />

        {/* Toplam Ürünler */}
        <DashboardCard
          icon={
            <Package className="text-green-600 dark:text-green-400 w-12 h-12 mb-4" />
          }
          title="Toplam Ürünler"
          value={productsCount}
        />

        {/* Toplam Siparişler */}
        <DashboardCard
          icon={
            <ShoppingCart className="text-yellow-600 dark:text-yellow-400 w-12 h-12 mb-4" />
          }
          title="Toplam Siparişler"
          value={ordersCount}
        />
      </div>
    </div>
  );
}

function DashboardCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number | null;
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 shadow-md rounded-lg p-6 flex flex-col items-center justify-center border dark:border-zinc-700">
      {icon}
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-2xl font-bold mt-2">
        {value === null ? (
          <span className="animate-pulse text-gray-400">Yükleniyor...</span>
        ) : (
          value
        )}
      </p>
    </div>
  );
}
