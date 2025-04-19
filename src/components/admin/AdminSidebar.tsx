"use client";

import Link from "next/link";
import { LayoutDashboard, Package, Users } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Ürünler", icon: Package },
  { href: "/admin/orders", label: "Siparişler", icon: Package },
  { href: "/admin/users", label: "Kullanıcılar", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen border-r dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 p-4">
      <nav className="flex flex-col gap-4">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 p-3 rounded-md transition-colors ${
                isActive
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold"
                  : "hover:bg-gray-200 dark:hover:bg-zinc-700"
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
