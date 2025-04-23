/* 💡Açıklama:
Fonksiyon	    Açıklama
addToCart	    Ürün zaten sepetteyse quantity artırır, değilse ekler
removeFromCart	Ürünü tamamen siler
increaseQty	    Ürün adedini artırır
decreaseQty	    Ürün adedini azaltır, 0 olursa çıkar
totalPrice	    Tüm ürünlerin toplam fiyatını döner
persist	        Zustand içeriğini localStorage'a senkronlar ✅
*/

import { toast } from "sonner";
import { create } from 'zustand';//React state yönetimi
import { persist } from 'zustand/middleware';
// persist → Zustand state'ini localStorage'a senkronlamak için middleware

type CartItem = {
    id: string; //Urunun benzersiz kimligi
    title: string;
    price: number;
    image?: string; //Opsiyonel ürün görseli
    quantity: number; //Urunden kac adet var
};

export type CartState = {
    cart: CartItem[]; //Sepet dizisi
    //Omit<T, K>	T tipinden K alanını çıkar
    // {id: string;name: string;price: number;// quantity yok!}
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    increaseQty: (id: string) => void;
    decreaseQty: (id: string) => void;
    totalPrice: () => number;
};


export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: [],
            addToCart: (item) => {
                const cart = get().cart;
                const existing = cart.find((i) => i.id === item.id);
                const truncateText = (text: string, maxLength: number) => {
                    return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
                  };
                if (existing) {
                    set({
                        cart: cart.map((i) =>
                            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                        )
                    })
                } else {
                    set({
                        cart: [...cart, { ...item, quantity: 1 }],
                    });
                }
                toast.success(`${truncateText(item.title, 16)} sepete eklendi 🛒`);
            },
            removeFromCart: (id) =>
                set({ cart: get().cart.filter((item) => item.id !== id) }),
            clearCart: () => set({ cart: [] }),
            increaseQty: (id) =>
                set({
                    cart: get().cart.map((item) =>
                        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
                    ),
                }),
            decreaseQty: (id) =>
                set({
                    cart: get().cart.map((item) =>
                        item.id === id 
                            ? { ...item, quantity: item.quantity - 1 }
                            : item
                    ).filter((item) => item.quantity > 0),
                }),
            totalPrice: () =>
                get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }),
        {
            name: 'cart-storage'
        }
    )
);

