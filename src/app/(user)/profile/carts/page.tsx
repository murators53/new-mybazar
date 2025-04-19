"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import OrderSkeleton from "@/components/ui/skeletons/OrderSkeleton";
import ErrorMessage from "@/components/ui/ErrorMessage";

type Cart = {
  _id: string;
  createdAt: string;
  cartItems: {
    id: string;
    title: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(true); // 🔄 Yükleniyor mu?
  const [error, setError] = useState(false); // ❌ Hata var mı?

  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    const fetchOrders = async () => {
      const minDelay = new Promise((res) => setTimeout(res, 1800)); // ⏳ En az 800ms bekle
      try {
        const res = await fetch("/api/cart/user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) throw new Error("Veri alınamadı");

        await minDelay; // 🔁 Skeleton'u biraz daha uzun göster

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("HATA: Siparişler alınamadı", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchOrders();
    }
  }, [accessToken]);

  // 🔄 Yükleniyor durumu
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-4">📦 Geçmiş Sepetlerim</h1>
        <OrderSkeleton />
      </div>
    );
  }

  // ❌ Hata durumu
  if (error) {
    return (
      <ErrorMessage
        type="network"
        message="Siparişler alınamadı."
        statusCode={500}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">📦 Geçmiş Sepetlerim</h1>

      {orders.length === 0 ? (
        <p>Henüz sepet kaydınız yok.</p>
      ) : (
        orders.map((order, i) => (
          <div key={i} className="border rounded p-4 space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Kaydedildi: {new Date(order.createdAt).toLocaleString()}
            </p>
            {order.cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center text-sm"
              >
                <span>{item.title}</span>
                <span>
                  {item.quantity} x {item.price}₺
                </span>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
