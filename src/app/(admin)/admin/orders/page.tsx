"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Skeleton from "@/components/ui/Skeleton";

type Order = {
  _id: string;
  email: string;
  total: number;
  createdAt: string;
};

export default function AdminOrdersPage() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/order/admin", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!res.ok) throw new Error("Siparişler alınamadı");

        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Sipariş çekme hatası:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchOrders();
    }
  }, [accessToken]);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">📦 Tüm Siparişler</h2>
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="p-4 border rounded-md shadow-sm bg-white dark:bg-zinc-900"
            >
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message="Siparişler yüklenemedi" type="network" />;
  }

  if (orders.length === 0) {
    return <p className="text-center text-gray-500">Henüz sipariş yok.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📦 Tüm Siparişler</h2>
      <div className="grid gap-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="p-4 border rounded-md shadow-sm bg-white dark:bg-zinc-900"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold">{order.email || "Kullanıcı bulunamadı"}</div>
              <div className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="font-bold text-lg">{order.total} ₺</div>
              <button
                onClick={() => router.push(`/admin/orders/${order._id}`)}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded transition"
              >
                Görüntüle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
