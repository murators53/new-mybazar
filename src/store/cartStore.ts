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
/* ✨ Kısaca:
Utility	Anlamı
Omit<T, K>	T tipinden K alanını çıkar
Pick<T, K>	T tipinden sadece K alanını al
Partial<T>	T tipindeki tüm alanları opsiyonel yap
Required<T>	T tipindeki tüm alanları zorunlu yap
*/

/* 🔍 persist bu kısmı nasıl kullanıyor?
İlk açıldığında localStorage['cart-storage'] var mı bakar.
✨ Teknik olarak şöyle işler:
    persist middleware, ilk kez store oluşturulurken bakar:

        localStorage’ta "cart-storage" adında bir kayıt var mı?

    Eğer varsa: ✅ Onu alır → store’un state’ini onunla override eder
    (Yani cart: [] yerine localStorage’taki değer gelir.)

    Eğer yoksa: ✅ İlk kez oluşturuluyordur → cart: [] olan ilk değeri kullanır
    ve onu localStorage’a yazar.
    1. Store tanımlandı (cart: [])
    2. persist dedi ki:
   → "Bende localStorage var mı?"
      - Varsa: Store’u onunla doldur
      - Yoksa: cart: []'yi kullan ve kaydet
    */

export const useCartStore = create<CartState>()(
    //Zustand’ın persist middleware’i ile tanımladığımız 
    // store verileri tarayıcıdaki localStorage'a kaydedilir.
    persist(
        (set, get) => ({
            //🔽 Sepet Verisi
            //Zustand store'un başlangıç (initial state) değeridir.
            cart: [],//Başlangıçta sepet boş olur. Ancak persist sayesinde localStorage'dan veriler yüklenir.
            // ➕ Ürün Ekleme
            addToCart: (item) => {//get().cart → doğrudan cart dizisine ulaşmış olursun
                const cart = get().cart;
                const existing = cart.find((i) => i.id === item.id);
                const truncateText = (text: string, maxLength: number) => {
                    return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
                  };
                //Eklenmek istenen ürün zaten sepette var mı kontrol edilir
                if (existing) {
                    set({
                        cart: cart.map((i) =>
                            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                            // ✅ Eğer ürün varsa quantity artırılır
                            // ✅ Yoksa quantity: 1 ile sepet dizisine eklenir
                        )
                    })
                } else {
                    set({
                        cart: [...cart, { ...item, quantity: 1 }],
                    });
                }
                toast.success(`${truncateText(item.title, 16)} sepete eklendi 🛒`);
            },
            //❌ Ürün Silme Belirtilen id'ye sahip ürün sepetten tamamen kaldırılır
            removeFromCart: (id) =>
                set({ cart: get().cart.filter((item) => item.id !== id) }),
            //🧹 Sepeti Tamamen Temizleme
            clearCart: () => set({ cart: [] }),
            // 🔼 Adet Artırma
            increaseQty: (id) =>
                set({
                    cart: get().cart.map((item) =>
                        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
                    ),
                }),
            // 🔽 Adet Azaltma (sıfıra inerse silinir)
            decreaseQty: (id) =>
                set({
                    cart: get().cart.map((item) =>
                        item.id === id // Adet 1 azaltılır
                            ? { ...item, quantity: item.quantity - 1 }
                            : item
                    ).filter((item) => item.quantity > 0),
                    // Eğer quantity 0 olursa → filter ile sepetten kaldırılır
                }),
            totalPrice: () =>
                get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }),
        {
            name: 'cart-storage'
        }
    )
);


/* 
    Uygulama kapansa bile,

    Sayfa yenilense bile,

    Kullanıcı geri gelse bile...

🔁 localStorage'tan otomatik olarak geri yüklenir.
yoksa bos ise deger cart:[] ile tanimlanan olur
*/