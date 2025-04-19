"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

// Bu bir client component çünkü useEffect ve Zustand kullanıyor

export const TokenLoder = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  //Global state'e accessToken'i kaydetmek icin Zustand fonskyonu aliyoruz
  const setLoading = useAuthStore((s) => s.setLoading);
  const setEmail = useAuthStore((s) => s.setEmail);
  const setIsAdmin = useAuthStore((s) => s.setIsAdmin);
  const email = useAuthStore((s) => s.email);
  const setHydrated = useAuthStore((s) => s.setHydrated); // ✅ eklendi
  useEffect(() => {
    console.log("tokenloader calisti");
    const refreshToken = async () => {
      try {
        const res = await fetch("/api/auth/refresh", {
          credentials: "include",
        });
       
        if (!res.ok) {
          console.log("🟡 Token alınamadı. Giriş yapılmamış olabilir."); 
          return;
        }

        const data = await res.json(); 

        console.log("🔵 Refresh sonrası gelen data:", data); 

        setAccessToken(data.accessToken);

        if (data.email && data.email !== email) {
          setEmail(data.email);
          console.log("🔵 Email store'a kaydedildi:", data.email);
        }

        if (typeof data.isAdmin === "boolean") {
          setIsAdmin(data.isAdmin); // ← 🔥 Bu satır KRİTİK
        }

      } catch (error) {
        console.log("Refresh token failed", error);
      } finally {
        setLoading(false);
        setHydrated();
        console.log("✅ Loading bitti, hydrate tamamlandı.");
      }
    };

    refreshToken();
  }, []);

  return null;
};
