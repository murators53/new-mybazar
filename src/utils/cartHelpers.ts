import { CartItem, ToastFn } from "@/types/cart";

// 🛒 Sepeti kaydet butonuna tıklanınca çalışacak fonksiyon
export const handleSaveCart = async (accessToken: string | null, cart: CartItem[], toast: ToastFn ) => {
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

        console.log("res",res);

        // 🔄 API'den gelen yanıt JSON formatında ayrıştırılıyor
        const data = await res.json();

        // 📢 Kullanıcıya mesaj gösteriliyor
        toast.success(data.message);
    } catch (err) {
        alert("Sepet kaydedilemedi");
        console.error(err);
    }
};


export const handleCheckOut = async (accessToken: string | null, cart: CartItem[], toast : ToastFn, clearCart: () => void) => {
    try {
        const res = await fetch("/api/order/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ cartItems: cart }),
        });

        const data = await res.json();
        console.log("cart", cart);
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