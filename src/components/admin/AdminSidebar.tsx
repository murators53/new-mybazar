"use client";

import Link from "next/link";
import { LayoutDashboard, Package, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Ürünler", icon: Package },
  { href: "/admin/orders", label: "Siparişler", icon: Package },
  { href: "/admin/users", label: "Kullanıcılar", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpenSideBar, setIsOpenSideBar] = useState<boolean>(false);

  return (
    <aside
      className={`absolute top-[62px] group w-20 hover:w-64 sm:w-64 sm:block sm:static z-30  min-h-screen hover:border-r sm:border-r hover:border-b rounded-b-xl dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4`}
    >
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
              <link.icon className="w-5 h-6  " />
              <span className={`hidden sm:block group-hover:block`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
