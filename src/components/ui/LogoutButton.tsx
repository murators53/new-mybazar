"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const LogoutButton = () => {
  const router = useRouter();
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
  const logout = useAuthStore((s) => s.logout);
  const pathname = usePathname();
  const setLoggingOut = useAuthStore((s) => s.setLoggingOut);

  const handleLogout = async () => {
    setLoggingOut(true); // 👈 çıkış başlarken
    console.log("logout tetiklendi");
    await fetch("/api/auth/logout", { method: "POST" });

    clearAccessToken(); //Zustandi sifirla
    logout(); // Zustand'dan accessToken + email temizlenir

    const shouldRedirect =
      pathname.startsWith("/profile") || pathname.startsWith("/admin");

    if (shouldRedirect) {
      router.push("/login");
    }else{
      setTimeout(() => {
        setLoggingOut(false); // 👈 Skeleton’ı kapat
      }, 555); // 1.2 saniye sonra
    }
  };

  return (
    <p onClick={handleLogout} className="dropdown-link">
      Çıkış Yap
    </p>
  );
};

export default LogoutButton;
