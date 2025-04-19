import { create } from 'zustand'; // Zustand: basit, hafif bir global state yönetim kütüphanesi

// 🚀 AuthStore tipi: Hangi verileri tutacağımızı ve hangi fonksiyonları barındıracağımızı tanımlar
type AuthState = {
    accessToken: string | null; //Kullanici accessToken'i (giris yapinca set edilir)
    isLoading: boolean;
    email: string | null;
    isHydrated: boolean;
    isAdmin: boolean; // ✅ Admin bilgisi
    setIsAdmin: (isAdmin: boolean) => void; // ✅ Admin setter
    setHydrated: () => void;
    setAccessToken: (token: string) => void; // accessToken'ı belleğe kaydetmek için fonksiyon}
    clearAccessToken: () => void; // accessToken'ı silmek için fonksiyon (örn. logout)
    setLoading: (loading: boolean) => void;
    setEmail: (email: string) => void;
    logout: () => void;
    isLoggingOut: boolean; // 👈 yeni state
    setLoggingOut: (loggingOut: boolean) => void; // 👈 yeni setter
}
// 🧠 Zustand ile global bir auth store (durum yönetimi) oluşturuluyor
export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,// İlk başta token yok (kullanıcı giriş yapmamış)
    isLoading: true,
    email: null,
    isHydrated: false,
    isAdmin: false, // ✅ default admin false
    setHydrated: () => set({ isHydrated: true }),
    // ✅ Kullanıcı giriş yaptığında token'ı state'e yazar
    setAccessToken: (token) => set({ accessToken: token }),
    // 🔓 Kullanıcı çıkış yaptığında token'ı sıfırlar
    clearAccessToken: () => set({ accessToken: null }),
    setLoading: (loading) => set({ isLoading: loading }),
    setEmail: (email) => set({ email: email }),
    setIsAdmin: (isAdmin) => set({ isAdmin }), // ✅ yeni fonksiyon
    logout: () => set({
        accessToken: null,
        email: null,
        isLoading: false,
    }),
    setLoggingOut: (loggingOut) => set({ isLoggingOut: loggingOut }),
    isLoggingOut: false,
}))


/*
✅ Bu Store             Ne İşe Yarar?
🧠Ne yapar?	            Açıklama
🧠accessToken	        Giriş yapmış kullanıcıyı temsil eden token
🧠setAccessToken()	    Girişten sonra token'ı belleğe yazar
🧠clearAccessToken()	Çıkışta token'ı temizler
🧠useAuthStore()	    Bu hook'u her component'te çağırarak token'a erişebiliriz

🧠 Cevap: Çünkü Zustand (ve diğer tüm JS state yönetimi) 
sadece RAM'de tutulur.
🔁 Tarayıcı Sayfa Yenileme Mantığı:

    Senin Next.js frontend’in yükleniyor.

    Zustand içindeki veriler belleğe (RAM) yazılıyor:

useAuthStore.getState().accessToken = 'abc123';

Ama sayfa yenilenirse (F5):

    Tarayıcı tüm JS belleğini (RAM) sıfırlar ❌

    Zustand’daki tüm geçici veriler kaybolur ❌

    accessToken artık undefined/null olur

     Ne Kalıyor Geriye? → httpOnly refreshToken

Senin stratejin şu:
Durum	Kaynak	Açıklama
accessToken	RAM (zustand)	Yenileme sonrası silinir ❌
refreshToken	Tarayıcı çerezi (httpOnly)	Yenileme sonrası kalır ✅

🔐 Neden credentials: 'include' Yazmalıyız?

Çünkü fetch() default olarak cookie göndermez.
Ama biz refreshTokenı cookie olarak tuttuk. Bu yüzden:

fetch("/api/auth/refresh", {
  credentials: 'include'
});

Yazmazsan istek boş gider → refreshToken sunucuya ulaşmaz ❌
*/

