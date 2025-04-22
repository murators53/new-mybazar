"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const CategoryMenu = () => {
  const [categories, setCategories] = useState<
    { name: string; slug: string; url: string }[]
  >([]);
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("http://dummyjson.com/products/categories");
      const data = await res.json();
      setCategories(data);
    };

    fetchCategories();
  }, []); /* ✅ Ne zaman [] kullanmalıyım?
    Sadece bir kez çalışsın istiyorsan: []
    Belirli bir değişken değiştiğinde çalışsın istiyorsan: [variable]
    Her renderda çalışsın istiyorsan: hiç koyma (ama dikkatli ol, sonsuz döngü olabilir)
  */

  return (
    <div className="bg-blue-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 py-2 px-4 flex flex-wrap gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-700">
      {categories.map((cat) => {
        return (
          <Link
            key={cat.url}
            href={`/category/${cat.slug}`}
            className="text-sm hover:underline capitalize whitespace-nowrap"
          >
            {/* {cat.name} */}
            <button className="px-4 py-2 rounded-full bg-white dark:bg-zinc-800 text-gray-800 dark:text-white shadow-sm border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700 transition text-sm capitalize">
              {cat.name}
            </button>
            {/* {cat.name.replace('-', ' ')} */}
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryMenu;
