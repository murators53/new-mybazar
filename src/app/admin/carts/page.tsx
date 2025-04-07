"use client"; // 👉 Bu bileşen tarayıcıda çalışacak (server değil)

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore"; // 🔐 Zustand'dan accessToken'ı alıyoruz
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; // isteğe bağlı modern toast

// 🧾 Cart tipi: Sepet objesi yapısı
type Cart = {
  _id: string;
  userId: string;
  email: string;
  createdAt: string;
  cartItems: {
    id: string;
    title: string;
    price: number;
    quantity: number;
  }[];
};

export default function AdminCartsPage() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [allCarts, setAllCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) return;
    const fetchAllCarts = async () => {
      try {
        const res = await fetch("/api/cart/all", {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 🛡️ Admin token'ı gönderiliyor
          },
        });

        const data = await res.json();

        if (data.message === "Yetkiniz yok") {
          toast.error("Bu sayfayı görüntüleme yetkiniz yok.");
          router.push("/");
          return;
        }

        setAllCarts(data); // 🗂️ Gelen veriyi state'e aktar
      } catch (err) {
        toast.error("Veriler alınırken hata oluştu");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCarts();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-muted-foreground">
        ⏳ Yükleniyor...
      </div>
    );
  }

  if (!Array.isArray(allCarts)) {
    return (
      <div className="text-center mt-20 text-red-500 font-semibold">
        🚫 Bu sayfayı görüntüleme yetkiniz yok.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        📋 Tüm Sepet Kayıtları (Admin)
      </h1>

      {/* 🕳️ Hiç kayıt yoksa uyarı mesajı */}
      {allCarts.length === 0 && <p>Henüz kayıtlı sepet bulunamadı.</p>}

      {/* 📦 Kayıtlı tüm sepetleri sırayla göster */}
      {allCarts.map((cart, i) => (
        <div key={i} className="border rounded p-4 mb-4">
          {/* 👤 Kullanıcı email + tarih bilgisi */}
          <p className="text-sm text-muted-foreground">
            👤 {cart.email} – {new Date(cart.createdAt).toLocaleString()}
          </p>
          {/* 🛒 Sepetin içeriği */}
          <ul className="mt-2 space-y-1">
            {cart.cartItems.map((item) => (
              <li key={item.id} className="text-sm flex justify-between">
                <span>{item.title}</span>
                <span>
                  {item.quantity} x {item.price}₺
                </span>
              </li>
            ))}
          </ul>{" "}
        </div>
      ))}
    </div>
  );
}
