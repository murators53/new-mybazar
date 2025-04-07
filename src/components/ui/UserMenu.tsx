'use client'

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const LogoutButton = () => {
  const router = useRouter();
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearAccessToken(); //Zustandi sifirla
    logout(); // Zustand'dan accessToken + email temizlenir
    router.push("/login");
  };

  return <p onClick={handleLogout} className="dropdown-link">Çıkış Yap</p>;
  // return <DropdownMenuItem onClick={handleLogout}>🚪 Çıkış Yap</DropdownMenuItem>
  
};

export default LogoutButton;


/* 
✅ Ne yaptık?

    useAuthStore ile accessToken aldık

    !!accessToken diyerek boolean hale getirdik

    isLoggedIn true ise Logout, Profile, Cart gösteriyoruz

    Aksi halde Login / Register linkleri
'use client';

import { ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import React from "react";
import LogoutButton from "./ui/UserMenu";
import { useAuthStore } from "@/store/authStore";

const Navbar = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = !!accessToken; // varsa true, yoksa false

  return (
    <header className="w-full shadow-sm sticky top-0 bg-white z-50 border-b ">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href={"/"} className="text-xl font-bold">
          my<span className="text-blue-800">Shop</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link className="hover:underline" href={"/search"}>
            Search
          </Link>

          {isLoggedIn ? (
            <>
              <Link href={"/profile"}>
                <User className="w-5 h-5" />
              </Link>

              <Link href={"/cart"} className="relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-3 -right-3 bg-blue-600 text-xs w-5 h-5 flex items-center justify-center rounded-full text-white font-bold">
                  3
                </span>
              </Link>

              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-blue-700 hover:underline">
                Giriş Yap
              </Link>
              <Link href="/register" className="text-sm text-blue-700 hover:underline">
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

*/