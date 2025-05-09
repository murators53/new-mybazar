"use client";

import { Moon, ShoppingCart, Sun, User } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./ui/LogoutButton";
import { useCartStore } from "@/store/cartStore";
import SearchInput from "./SearchInput";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import RainbowDivider from "./RainbovDivider";
import MegaMenu from "./MegaMenu";
import Skeleton from "./ui/Skeleton";

const Navbar = () => {
  const totalItems = useCartStore((s) =>
    s.cart.reduce((total, item) => total + item.quantity, 0)
  );
  const theme = useThemeStore((s) => s.theme); // ✅ Tema bilgisi
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const email = useAuthStore((s) => s.email);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const accessToken = useAuthStore((s) => s.accessToken);
  const setEmail = useAuthStore((s) => s.setEmail);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isHydrated = useAuthStore((s) => s.isHydrated); // ✅ eklendi
  const isProfileLoading = isLoading || (!email && !!accessToken);
  const isLoggingOut = useAuthStore((s) => s.isLoggingOut);
  const [showSkeletonDelay, setShowSkeletonDelay] = useState(true);
  const showSkeleton =
    isLoading ||
    !isHydrated ||
    isProfileLoading ||
    isLoggingOut ||
    showSkeletonDelay;
  useEffect(() => {
    if (!isHydrated || !accessToken || email) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
         
        if (data.email) {
          setEmail(data.email);
        }
      } catch (err) {
        console.error("Profil alınamadı", err);
      }
    };

    fetchProfile();
  }, [accessToken]);
  useEffect(() => {
    const timer = setTimeout(() => setShowSkeletonDelay(false), 100); // 0.5 saniye skeleton garanti
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="w-full shadow-sm sticky top-0 bg-white dark:bg-zinc-900 text-black dark:text-white z-50 border-b dark:border-zinc-700 transition-colors duration-300">
      {" "}
      <div className="mx-auto max-w-[1600px] px-6 py-3 flex justify-between items-center">
        <Link href={"/"} className="text-xl font-bold">
          my<span className="text-blue-800 dark:text-blue-400">Bāzar</span>
        </Link>
        <SearchInput />
        {showSkeleton ? (
          <div className="flex items-center gap-2 py-[0.5px] justify-end">
            <Skeleton className="h-9 w-[32.5px] rounded-3xl" />{" "}
            {/* 👤 avatar */}
            <Skeleton className="h-9 w-[32.5px] rounded-3xl" /> {/* 🛒 sepet */}
            <Skeleton className="h-9 w-[32.5px] rounded-3xl" /> {/* 🌙 tema */}
          </div>
        ) : email ? (
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <User
                  className="translate-y-[3px] w-7 h-7 p-1 mb-[5px] rounded-md transition-colors duration-200 
             hover:bg-gray-200 dark:hover:bg-zinc-700 cursor-pointer"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-zinc-900">
                <DropdownMenuItem asChild>
                  {isAdmin?(<Link href="/admin" className="dropdown-link bg-green-400 ">
                    👑 Admin Panel
                  </Link>):(
                    <Link href="/profile" className="dropdown-link">
                    👤 Profil
                  </Link>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/orders" className="dropdown-link">
                    📦 Siparişlerim
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="pointer-event">
                  <Link href="/profile/carts" className="dropdown-link">
                    🛒 Sepet Geçmişi
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  🚪 <LogoutButton />{" "}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/cart" className="relative">
              <ShoppingCart
                className="w-7 h-7 p-1 rounded-md transition-colors duration-200 
             hover:bg-gray-200 dark:hover:bg-zinc-700 cursor-pointer"
              />
              <span className="absolute -top-2 -right-2 bg-blue-700 dark:bg-blue-400  text-xs w-5 h-5 flex items-center justify-center rounded-full text-white font-bold">
                {totalItems}
              </span>
            </Link>

            <button
              onClick={toggleTheme}
              className="p-[2px] rounded hover:bg-gray-200 dark:hover:bg-zinc-700  hover:border-gray-300 dark:hover:border-zinc-600 transition-colors duration-200"
              aria-label="Tema değiştir"
            >
              {theme === "dark" ? (
                <Sun
                  className="w-6 h-6 text-yellow-300  rounded-md transition-colors duration-200 
             hover:bg-gray-200 dark:hover:bg-zinc-700 cursor-pointer"
                  size={18}
                />
              ) : (
                <Moon
                  className="w-6 h-6  rounded-md transition-colors duration-200 
             hover:bg-gray-200 dark:hover:bg-zinc-700 cursor-pointer"
                  size={18}
                />
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-[6.2px] py-[6px] rounded-xl text-white bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md transition-all text-sm font-medium tracking-wide"
            >
              Giriş Yap
            </Link>

            <button
              onClick={toggleTheme}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-700"
              aria-label="Tema değiştir"
            >
              {theme === "dark" ? (
                <Sun className="w-6 h-6 text-yellow-300" />
              ) : (
                <Moon className="w-6 h-6" />
              )}
            </button>
          </div>
        )}
      </div>
      <RainbowDivider />
      <MegaMenu />
    </header>
  );
};

export default Navbar;
