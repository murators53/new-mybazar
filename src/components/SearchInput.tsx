"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SearchInput = () => {
  //input’a yazılan arama kelimesi.
  const [term, setTerm] = useState("");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // 👈 mobil input açma kontrolü

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    //trim() yanlislikla yapilan bosluklari siler
    // " merhaba dunya " => "merhaba dunya"
    if (!term.trim()) return; // ❌ input boşsa yönlendirme yapma
    router.push(`/search?q=${term}`);
    // ✅ URL’ye arama kelimesini ekleyip yönlendir
    setIsOpen(false); // arama sonrası mobil inputu kapat
  };

  return (
    <>
      {/* Masaüstü versiyon - hep açık */}
      <form
        onSubmit={handleSearch}
        className="hidden md:flex  items-center bg-gray-100 dark:bg-zinc-800 rounded-full px-3 py-1 border border-gray-200 dark:border-zinc-600"
      >
        <input
          type="text"
          placeholder="Ara..."
          className="bg-transparent  text-sm focus:outline-none px-2 py-1 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 w-[200px] lg:w-[240px]"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <button type="submit">
          <Search size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
      </form>

      {/* Mobil versiyon */}
      <div className="relative block md:hidden">
        <button
          className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <Search size={20} className="text-gray-600 dark:text-gray-300" />
        </button>

        {isOpen && (
          <form
            onSubmit={handleSearch}
            className="absolute top-12 left-1/2 -translate-x-1/2 w-48 max-w-sm bg-white dark:bg-zinc-900 p-3 rounded-xl shadow-lg z-50 border dark:border-zinc-700 transition-all duration-300"
          >
            <input
              type="text"
              autoFocus
              placeholder="Ne aramıştınız?"
              className="w-full bg-transparent border px-3 py-2 rounded-lg text-sm text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none border-gray-300 dark:border-zinc-600"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </form>
        )}
      </div>
    </>
  );
};

export default SearchInput;
