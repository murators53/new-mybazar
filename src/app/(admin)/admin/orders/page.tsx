'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

type Order = {
  _id: string;
  email: string;
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

export default function AdminOrdersPage() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      const res = await fetch('/api/order/all', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();
      setOrders(data);
    };

    if (accessToken) fetchAllOrders();
  }, [accessToken]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🛠️ Tüm Siparişler (Admin)</h1>

      {orders.length === 0 && <p>Hiç sipariş kaydı bulunamadı.</p>}

      {orders.map((order) => (
        <div key={order._id} className="border p-4 mb-4 rounded shadow-sm">
          <p className="text-sm text-muted-foreground">
            👤 <b>{order.email}</b> | {new Date(order.createdAt).toLocaleString()}
          </p>
          <p className="text-sm font-medium mb-2">
            Durum: <span className="text-blue-700">{order.status}</span>
          </p>
          <ul className="text-sm mb-2">
            {order.cartItems.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.title}</span>
                <span>{item.quantity} x {item.price}₺</span>
              </li>
            ))}
          </ul>
          <p className="text-right font-bold">Toplam: {order.total}₺</p>
        </div>
      ))}
    </div>
  );
}
