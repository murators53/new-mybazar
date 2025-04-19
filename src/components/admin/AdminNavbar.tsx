"use client";

import { Moon, Sun, LogOut } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function AdminNavbar() {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const logout = useAuthStore((s) => s.logout);
  const clearAccessToken = useAuthStore((s) => s.clearAccessToken);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearAccessToken();
    logout();
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between p-4 border-b dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <h1 className="text-lg font-bold">myBāzar Admin</h1>
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="hover:opacity-80">
          {theme === "dark" ? (
            <Sun className="w-6 h-6 text-yellow-300" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </button>
        <button onClick={handleLogout} className="hover:opacity-80">
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
