"use client";

import { usePathname } from "next/navigation";
import CategoryMenu from "./CategoryMenu";

const ConditionalCategoryMenu = () => {
  const pathname = usePathname(); // şu anki sayfanın path'ini alıyoruz
  //aktif olan sayfanın yolunu (pathname) verir.
  const hideCategory = pathname === "/login" || pathname === "/register";
  //   hideCategory: Eğer kullanıcı /login veya /register sayfasındaysa, kategori menüsünü gizlemek için true olur.
  //   Aksi takdirde false olur ve menü gösterilir.
  if (hideCategory) return null;
  //   Eğer hideCategory true ise, yani kullanıcı login ya da register sayfasındaysa,
  // hiçbir şey render edilmez (ekrana hiçbir şey yazılmaz).

  return <CategoryMenu />;
};

export default ConditionalCategoryMenu;
