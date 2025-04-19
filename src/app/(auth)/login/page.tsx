"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const isLoading = useAuthStore((s) => s.isLoading); // ✅ artık zustand’dan al
  const setLoading = useAuthStore((s) => s.setLoading);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const passwordRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let paket = "test";
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, paket }),
        headers: {
          "Content-type": "application/json", // JSON formatında veri gönderiyoruz
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Giriş başarısız", {
          id: "login-error",
          duration: 4000,
        });
        setPassword(""); //sadece sifre alani temizlanir
        passwordRef.current?.focus(); // 👈 Fokus yeniden şifreye
        return;
      }

      // Eğer yanıt başarılıysa (200 OK vs.)
      if (res.ok) {
        const { jwtApiRouteTestControl, accessToken, email } = await res.json(); // JWT token'ı backend'den alıyoruz
        setAccessToken(accessToken); // Zustand store’a yaz
        setEmail(email);

        toast.success("Giriş başarılı, yönlendiriliyorsunuz...", {
          duration: 1500,
        });
        
        setTimeout(() => {
          router.push("/");
        }, 1600); // 100ms gecikmeli ki mesaj kaybolunca yönlensin
      }
    } catch (err) {
      toast.error("Sunucu hatası!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto mt-32 p-6 rounded-2xl shadow-xl bg-white dark:bg-zinc-900 space-y-5 border border-gray-100 dark:border-zinc-700"
    >
      <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
        <span role="img" aria-label="lock">
          🔐
        </span>{" "}
        Giriş Yap
      </h2>{" "}
      <div className="space-y-2 mb-4">
        <label className="text-sm font-medium">Email</label>
        <Input
          className="transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
          type="email"
          placeholder="example@mail.com"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2 relative">
        <label className="text-sm font-medium">Şifre</label>
        <Input
          // Bu key değiştikçe bileşen yeniden oluşturulacak, ve böylece type geçişi düzgün çalışacak
          key={showPassword ? "text" : "password"} // 🔁 değişimde yeniden render olur
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          ref={passwordRef}
        />
        <div
          className="absolute  right-[9px] top-[30px] p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </div>
      </div>
      {/* Gönder butonu */}
      <Button
        type="submit"
        className="w-full  transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Giriş Yap
      </Button>
      {pathname === "/login" && (
        <p className="text-sm text-center">
          Hesabınız yok mu?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Kayıt olun
          </Link>
        </p>
      )}
    </form>
  );
};

export default LoginPage;

/* zustandda destructuring ile selector farki selector mantikli re render etmeyip performans faydasi olur 
const { setAccessToken } = useAuthStore();

Bu satır, aslında şunun gibi bir şey:

const fullStore = useAuthStore();
const setAccessToken = fullStore.setAccessToken;
? Yani önce tüm store alınır, sonra içinden setAccessToken çıkarılır.

const setAccessToken = useAuthStore((state) => state.setAccessToken);

Burada sadece bir parça izleniyor.
Zustand diyor ki:

    ?“Sen sadece setAccessToken'la ilgileniyorsun, diğer şey değişirse umrunda değil.”

Bu yüzden re-render olmaz.
*/
