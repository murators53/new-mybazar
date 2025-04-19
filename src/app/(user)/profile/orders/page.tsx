"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore"; // Zustand'dan accessToken çekiyoruz (JWT token)
import ErrorMessage from "@/components/ui/ErrorMessage";
import Skeleton from "@/components/ui/Skeleton";

type Order = {
  _id: string;
  createdAt: string;
  total: number;
  status: string;
  cartItems: {
    id: string;
    title: string;
    price: number;
    quantity: number;
  }[];
};

export default function UserOrdersPage() {
  const accessToken = useAuthStore((s) => s.accessToken); // 🔐 Giriş yapan kullanıcının JWT token'ı
  const [orders, setOrders] = useState<Order[]>([]); // 📦 Siparişleri state'e alıyoruz
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/order/user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) throw new Error("Veri alınamadı");

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("❌ Siparişler alınamadı:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) fetchOrders();
  }, [accessToken]);
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">📦 Sipariş Geçmişi</h2>

      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 1 }).map((_, index) => (
            <div
              key={index}
              className="border p-4 rounded space-y-2 animate-pulse"
            >
              <Skeleton className="h-4 w-44 bg-gray-200 rounded" />
              <Skeleton className="h-4 w-36 bg-gray-200 rounded" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24 bg-gray-200 rounded" />
                  <Skeleton className="h-4 w-20 bg-gray-200 rounded" />
                </div>
              ))}
              <Skeleton className="h-4 w-1/4 bg-gray-200 rounded ml-auto" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <ErrorMessage
          type="network"
          message="Siparişler alınamadı."
          statusCode={500}
        />
      )}

      {!loading && !error && orders.length === 0 && (
        <p>Henüz sipariş bulunamadı.</p>
      )}

      {!loading &&
        !error &&
        orders.map((order) => (
          <div className="border p-4 rounded mb-4" key={order._id}>
            <p className="text-sm text-muted-foreground mb-1">
              Tarih: {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="text-sm font-semibold mb-2">
              Durum:{" "}
              <span
                className={
                  order.status === "hazırlanıyor"
                    ? "text-yellow-600"
                    : "text-green-600"
                }
              >
                {order.status}
              </span>
            </p>
            <ul className="text-sm space-y-1">
              {order.cartItems.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.title}</span>
                  <span>
                    {item.quantity} x {item.price}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-right font-bold mt-2">
              Toplam: {order.total} TL
            </p>
          </div>
        ))}
    </div>
  );
}
