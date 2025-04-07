/*🎯 Hedef: /cart Sayfası
//?🛠 Özellikler:
    Sepet ürünlerini göster (görsel, isim, fiyat, adet)
    Adet artır/azalt
    Ürünü sepetten kaldır
    Toplam fiyatı göster
    Boşsa “Sepetiniz boş” mesajı*/

//bir Client Component olduğunu belirtir.
"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
// import toast from "react-hot-toast";
import { toast } from "sonner";
// import { shallow } from "zustand/shallow";
// Gruplu Çağırma
//✅ sadece shallow içersndeki değer değiştiğinde re render olur

const CartPage = () => {
  // 🧠 Zustand store'dan accessToken'ı alıyoruz (sadece RAM'de tutuluyor)
  const accessToken = useAuthStore((s) => s.accessToken);
  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    totalPrice,
    clearCart,
  } = useCartStore();
  //simdi bu sayfaya gore cart degisse bile mesela increaseQty bile cagrilmis
  //hale gelecek yeniden re render tanimlamis gibi olacak perf. sorunu olur
  /* const {cart, increaseQty, decreaseQty, removeFromCart, totalPrice, clearCart}
= useCartStore(
    (state) => ({
        cart: state.cart,
        increaseQty: state.increaseQty,
        decreaseQty: state.decreaseQty,
        removeFromCart: state.removeFromCart,
        totalPrice: state.totalPrice,
        clearCart: state.clearCart,
    }),//Performanslı olacak (shallow comparison)
    shallow
    //Obje olarak birden fazla state/fonksiyon alıyorsan gerekli shallow 
  ) */

  // 🛒 Sepeti kaydet butonuna tıklanınca çalışacak fonksiyon
  const handleSaveCart = async () => {
    try {
      if (!accessToken) {
        toast.error("Giriş yapmadan sepet kaydedemezsiniz.");
        return;
      }

      // 📡 API'ye POST isteği atıyorsun
      const res = await fetch("/api/cart/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Gövde tipi JSON
          Authorization: `Bearer ${accessToken}`, // 🔐 JWT tokenı Header'a ekleniyor
        },
        body: JSON.stringify({ cartItems: cart }), // 🛒 Sepet verisi JSON olarak gönderiliyor
      });

      // 🔄 API'den gelen yanıt JSON formatında ayrıştırılıyor
      const data = await res.json();

      // 📢 Kullanıcıya mesaj gösteriliyor
      toast.success(data.message);
    } catch (err) {
      alert("Sepet kaydedilemedi");
      console.error(err);
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await fetch('/api/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ cartItems: cart }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Sipariş başarılı 🎉");
        clearCart();
      } else {
        toast.error(data.message || "Sipariş sırasında bir hata oluştu");
      }
    } catch (err) {
      console.error("❌ Sipariş hatası:", err);
      toast.error("Sunucu hatası: Sipariş oluşturulamadı");
    }
  };

  if (cart.length === 0) {
    return <div className="">Sepetiniz boş😢</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Sepet</h2>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border p-4 rounded-md"
        >
          <div className="flex items-center gap-4">
            <img
              src={item.image}
              alt={item.title}
              className="w-20 h-20 object-contain"
            />
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.price}₺</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => decreaseQty(item.id)}>
              -
            </Button>
            <span>{item.quantity}</span>
            <Button size="sm" onClick={() => increaseQty(item.id)}>
              +
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => removeFromCart(item.id)}
            >
              Sil
            </Button>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center border-t pt-4">
        <p className="text-xl font-bold">Toplam: {totalPrice().toFixed(2)}₺</p>
        <Button variant="outline" onClick={clearCart}>
          🗑️ Sepeti Temizle
        </Button>
        <Button onClick={handleSaveCart}>🛒 Sepeti Kaydet</Button>
        <Button onClick={handleCheckOut} className="bg-green-400  text-white">
          ✅ Siparişi Tamamla
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
