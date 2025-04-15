"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore"; // Zustand'dan accessToken çekiyoruz (JWT token)

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

  useEffect(() => {
    const fetchOrders = async () => {
      // 1️⃣ Backend'e istek atıyoruz
      const res = await fetch("/api/order/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`, // 🛡️ Token'ı header'a ekle
        },
      });

      // 2️⃣ JSON cevabını al
      const data = await res.json();

      // 3️⃣ Gelen siparişleri state'e yaz
      setOrders(data);
    };

    // 4️⃣ Token geldiyse fetch başlasın
    if (accessToken) fetchOrders();
  }, [accessToken]); // accessToken değişirse yeniden çalışır

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">📦 Sipariş Geçmişi</h2>

      {orders.length === 0 && <p>Henüz sipariş bulunamadı.</p>}

      {orders.map((order) => (
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
            {order.cartItems.map(item=> (
              <li key={item.id} className="flex justify-between">
                <span>{item.title}</span>
                <span>
                  {item.quantity} x {item.price}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-right font-bold mt-2">Toplam: {order.total} TL</p>
        </div>
      ))}
    </div>
  );
}
