"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Package, ShoppingCart, Users } from "lucide-react";

export default function AdminDashboardPage() {
  const [productsCount, setProductsCount] = useState<number>(0);
  const [ordersCount, setOrdersCount] = useState<number>(0);
  const [usersCount, setUsersCount] = useState<number>(0);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
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
      } catch (err) {
        console.error("❌ Dashboard verisi alınamadı:", err);
      }
    };

    if (accessToken) fetchDashboardData();
  }, [accessToken]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">👑 Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Toplam Kullanıcılar */}
        <div className="bg-white dark:bg-zinc-900 shadow-md rounded-lg p-6 flex flex-col items-center justify-center border dark:border-zinc-700">
          <Users className="text-blue-600 dark:text-blue-400 w-12 h-12 mb-4" />
          <h2 className="text-xl font-semibold">Toplam Kullanıcılar</h2>
          <p className="text-2xl font-bold mt-2">128</p> {/* dummy */}
        </div>

        {/* Toplam Ürünler */}
        <div className="bg-white dark:bg-zinc-900 shadow-md rounded-lg p-6 flex flex-col items-center justify-center border dark:border-zinc-700">
          <Package className="text-green-600 dark:text-green-400 w-12 h-12 mb-4" />
          <h2 className="text-xl font-semibold">Toplam Ürünler</h2>
          <p className="text-2xl font-bold mt-2">56</p> {/* dummy */}
        </div>

        {/* Toplam Siparişler */}
        <div className="bg-white dark:bg-zinc-900 shadow-md rounded-lg p-6 flex flex-col items-center justify-center border dark:border-zinc-700">
          <ShoppingCart className="text-yellow-600 dark:text-yellow-400 w-12 h-12 mb-4" />
          <h2 className="text-xl font-semibold">Toplam Siparişler</h2>
          <p className="text-2xl font-bold mt-2">34</p> {/* dummy */}
        </div>
      </div>
    </div>
  );
}
