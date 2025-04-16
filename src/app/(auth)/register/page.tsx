"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    //async çünkü fetch kullanacağız (Promise dönecek)

    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Şifreler eşleşmiyor.");
      return;
    }
    try {
      ///api/auth/register endpoint’ine POST isteği gönderiliyor
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Header: JSON olduğunu belirtiyor
        body: JSON.stringify({ email, password }), //Body: email ve password JSON formatında gönderiliyor
      });

      const data = await res.json(); // ciktilar icin routedan gelen resposonse ile

      if (!res.ok) {
        toast.error(data.message || "Kayıt başarısız");
        return;
      }
      setTimeout(() => {
        router.push("/login");
      }, 800);
      toast.success("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
    } catch (err) {
      toast.error("Sunucu hatası");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="max-w-md mx-auto mt-28 p-6 rounded-2xl shadow-xl bg-white dark:bg-zinc-900 space-y-5 border border-gray-100 dark:border-zinc-700"
    >
      <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
        <span role="img" aria-label="register">
          📝
        </span>{" "}
        Kayıt Ol
      </h2>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          placeholder="example@mail.com"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Şifre */}
      <div className="space-y-2 relative">
        <label className="text-sm font-medium">Şifre</label>
        <Input
          key={showPassword ? "text" : "password"}
          type={showPassword ? "text" : "password"}
          placeholder="Şifrenizi girin"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <div
          className="absolute right-[9px] top-[30px] p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </div>
      </div>

      {/* Şifre Tekrar */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Şifre (Tekrar)</label>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Şifrenizi tekrar girin"
          value={confirmPassword}
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {/* Buton */}
      <Button
        type="submit"
        className="w-full mt-6 bg-violet-600 hover:bg-violet-700 text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"      >
        Kayıt Ol
      </Button>
      <p className="text-sm text-center">
        Zaten hesabınız var mı?{" "}
        <a href="/login" className="text-blue-600 hover:underline font-medium">
          Giriş yap
        </a>
      </p>
    </form>
  );
};

export default RegisterPage;
