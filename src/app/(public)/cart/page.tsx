"use client";

import { Button } from "@/components/ui/button";
import CartItemSkeleton from "@/components/ui/skeletons/CartItemSkeleton";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import EmptyCart from "./EmptyCart";
import { handleCheckOut, handleSaveCart } from "@/utils/cartHelpers";
import { CartItem } from "@/types/cart";

const CartPage = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isLoading = useAuthStore((s) => s.isLoading);
  const cart = useCartStore((s) => s.cart) as CartItem[];
  const totalPrice = useCartStore((s) => s.totalPrice);
  const increaseQty = useCartStore((s) => s.increaseQty);
  const decreaseQty = useCartStore((s) => s.decreaseQty);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const clearCart = useCartStore((s) => s.clearCart);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Sepet</h2>
        {[...Array(3)].map((_, i) => (
          <CartItemSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (cart.length === 0) {
    return <EmptyCart />;
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Sepet</h2>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between gap-4 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <img
              src={item.image}
              alt={item.title || "Ürün görseli"}
              className="w-20 h-20 object-cover aspect-square rounded-md border"
            />
            <div>
              <p className="font-semibold text-lg">{item.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.price}₺
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => decreaseQty(item.id)}
              className="transition hover:scale-105"
            >
              -
            </Button>
            <span className="font-medium">{item.quantity}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => increaseQty(item.id)}
              className="transition hover:scale-105"
            >
              +
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => removeFromCart(item.id)}
              className="transition hover:scale-105"
            >
              Sil
            </Button>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center gap-2 border-t pt-4">
        <p className="text-xl font-bold">Toplam: {totalPrice().toFixed(2)}₺</p>
        <Button
          variant="outline"
          className="transition hover:scale-105"
          onClick={clearCart}
        >
          🗑️ Sepeti Temizle
        </Button>
        <Button onClick={() => handleSaveCart(accessToken, cart, toast)}>
          🛒 Sepeti Kaydet
        </Button>
        <Button
          onClick={() => handleCheckOut(accessToken, cart, toast, clearCart)}
          className="bg-green-400  text-white transition hover:scale-105"
        >
          ✅ Siparişi Tamamla
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
