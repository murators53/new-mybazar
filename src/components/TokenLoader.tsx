"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

// Bu bir client component çünkü useEffect ve Zustand kullanıyor

export const TokenLoder = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  //Global state'e accessToken'i kaydetmek icin Zustand fonskyonu aliyoruz
  const setLoading = useAuthStore((s) => s.setLoading);
  const setEmail = useAuthStore((s) => s.setEmail);
  const email = useAuthStore((s) => s.email);

  useEffect(() => {
    console.log("tokenloader calisti");
    const refreshToken = async () => {
      try {
        // HTTP standardına göre GET isteklerinde body gönderilmez.
        const res = await fetch("/api/auth/refresh", {
          credentials: "include",
        });
        // Sunucudaki refresh endpoint'e istek atılıyor
        // refreshToken genelde httpOnly cookie'de tutulduğu için burada header gerekmez

        /* if (!res.ok) {
          // Yalnızca development'da bilgi ver
           if (process.env.NODE_ENV === "development") {
            console.info("🟡 Henüz giriş yapılmamış, refreshToken bulunamadı.");
          } 
          setLoading(false); // ❌ Token yoksa bile loading kapanmalı
          return;
        } */
        if (!res.ok) {
          console.log("🟡 Token alınamadı. Giriş yapılmamış olabilir."); // }
          return;
        }

        // Eğer sunucu hata dönerse devam etme (401 vs.)

        const data = await res.json(); // body'i json'a cevirir
        // Yeni accessToken JSON formatında geliyor
        setAccessToken(data.accessToken);
        // ✅ SADECE FARKLIYSA YAZ
        if (data.email && data.email !== email) {
          setEmail(data.email);
        }
        console.log("✅ Token yenilendi:", data.accessToken);
        // Yeni token'ı global state'e yaz → artık tüm app bu token'ı kullanabilir
      } catch (error) {
        console.log("Refresh token failed", error);
        // Hata olursa konsola logla (örneğin cookie yoksa veya expire olduysa)
      } finally {
        setLoading(false);
      }
    };

    refreshToken();
  }, []);

  return null;
  // Bu component görünür bir şey döndürmez ama arka planda token yükleme işi yapar
};
