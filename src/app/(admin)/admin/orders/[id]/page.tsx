"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import ErrorMessage from "@/components/ui/ErrorMessage";
import OrderDetailSkeleton from "@/components/ui/skeletons/OrderDetailSkeleton";

type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
};

type OrderDetail = {
  _id: string;
  userId: string;
  email: string;
  cartItems: CartItem[];
  total: number;
  status: string;
  createdAt: string;
};

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken || !id) return;

    const fetchOrderDetail = async () => {
      try {
        const res = await fetch(`/api/order/admin/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error("Sipariş alınamadı");

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Sipariş detay çekme hatası:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id, accessToken]);

  if (loading) return <OrderDetailSkeleton />;
  if (error || !order)
    return <ErrorMessage message="Sipariş bulunamadı." type="network" />;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-md space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-6 text-center">
          📦 Sipariş Detayı
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <InfoRow label="Kullanıcı" value={order.email} />
          <InfoRow
            label="Sipariş Tarihi"
            value={new Date(order.createdAt).toLocaleDateString()}
          />
          <InfoRow label="Toplam Tutar" value={`${order.total} ₺`} />
          <InfoRow label="Durum" value={formatStatus(order.status)} />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">🛒 Ürünler</h3>

        <div className="space-y-4">
          {order.cartItems.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded-lg bg-gray-50 dark:bg-zinc-800 flex justify-between items-center hover:shadow-sm transition"
            >
              <div>
                <div className="text-lg font-semibold">{item.title}</div>
                <div className="text-sm text-gray-500">
                  {item.quantity} adet x {item.price} ₺
                </div>
              </div>
              <div className="text-lg font-bold">
                {(item.price * item.quantity).toFixed(2)} ₺
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-4 rounded-full transition"
        >
          <span className="text-lg">⬅️</span>
          <span>Geri Dön</span>
        </button>
      </div>
    </div>
  );
}

// Bilgileri düzgün şekilde göstermek için küçük bir yardımcı bileşen
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        {value}
      </span>
    </div>
  );
}

// Sipariş durumunu daha okunaklı yapmak için format fonksiyonu
function formatStatus(status: string) {
  switch (status) {
    case "pending":
      return "Beklemede";
    case "completed":
      return "Tamamlandı";
    case "cancelled":
      return "İptal Edildi";
    default:
      return status;
  }
}
