"use client"; // 🔁 Bu bileşenin client-side çalışacağını belirtir

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore"; // 🧠 accessToken'ı Zustand'dan alıyoruz

// 🗂️ Tip tanımı: Sepet içeriği
type Cart = {
  _id: string; //_id MongoDB'nin kendi standart adlandırması.
  createdAt: string;
  cartItems: {
    id: string;
    title: string;
    price: number;
    quantity: number;
    image?: string;
  }[];// ← dizi 
};



export default function OrdersPage() {
  const [orders, setOrders] = useState<Cart[]>([]); // 💾 Sepet geçmişi state
  const accessToken = useAuthStore((s) => s.accessToken); // 🔐 JWT access token

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("/api/cart/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`, // 🛡️ Token'ı header'a ekle
        },
      });

      const data = await res.json(); // 🔄 JSON parse
      
      setOrders(data); // 📥 Veriyi state'e aktar
    };

    if (accessToken) fetchOrders(); // 🔃 accessToken varsa, fetch işlemi başlat
  }, [accessToken]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">📦 Geçmiş Sepetlerim</h1>
      {/* 🕳️ Eğer hiç sepet yoksa mesaj göster */}
      {orders.length === 0 && <p>Hiç sepet kaydınız yok.</p>}

      {/* 📦 Her bir sepet kaydını göster */}
      {orders.map((order, i) => (
        <div key={i} className="border rounded p-4 space-x-2">
          {/* ⏱️ Sepetin oluşturulma tarihi->toLocaleString()->Tarihi kullanıcı dostu formatta göstermek*/}
          <p>Kaydedildi: {new Date(order.createdAt).toLocaleString()}</p>
          {order.cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <span>{item.title}</span>
              <span>
                {item.quantity} x {item.price}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
