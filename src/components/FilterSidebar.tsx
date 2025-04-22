"use client";

import { toTitleCase } from "@/utils/toTitleCase";
import { Building2, Folder, Package, Search, Star, Tag } from "lucide-react";

interface FilterSidebarProps {
  availableBrands?: string[];
  tempMaxPrice: number;
  setTempMaxPrice: (value: number) => void;
  tempMinPrice: number;
  setTempMinPrice: (value: number) => void;
  handleApplyFilter: () => void;
  sortOption: string;
  setSortOption: (value: string) => void;
  selectedBrands: string[];
  setSelectedBrands: (value: string[]) => void;
  setMinimumRating: (value: number) => void;
  minimumRating: number;
  stockStatus: "all" | "inStock" | "outOfStock";
  setStockStatus: (value: "all" | "inStock" | "outOfStock") => void;
  categoryCounts?: Record<string, number>;
  selectedCategory?: string | null;
  setSelectedCategory?: (value: string | null) => void;
  brandCounts?: Record<string, number>;
}

export default function FilterSidebar({
  tempMinPrice,
  setTempMinPrice,
  tempMaxPrice,
  setTempMaxPrice,
  handleApplyFilter,
  selectedBrands,
  setSelectedBrands,
  setMinimumRating,
  minimumRating,
  stockStatus,
  setStockStatus,
  categoryCounts,
  selectedCategory,
  setSelectedCategory,
  brandCounts,
}: FilterSidebarProps) {
  return (
    <div className="w-64 border-r dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <h3 className="text-2xl font-bold border-b-2 border-gray-200 p-6">
        Filtreler
      </h3>

      {categoryCounts && (
        <div className=" border-b-2 border-gray-200 py-4 px-6">
          <label className=" mb-2 text-base font-semibold flex items-center gap-2">
            <Folder size={16} /> Kategoriler
          </label>
          <div
            className="flex flex-col  max-h-48 overflow-y-auto pr-2  [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300"
          >
            {Object.keys(categoryCounts)
              .sort((a, b) => categoryCounts[b] - categoryCounts[a]) // büyükten küçüğe sırala
              .map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    categoryCounts[category] > 0 &&
                    setSelectedCategory?.(
                      selectedCategory === category ? null : category
                    )
                  }
                  className={`flex justify-between items-center text-sm p-2 rounded cursor-pointer transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-200 text-black hover:bg-blue-100 transition-all duration-200"
                      : categoryCounts[category] === 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                  disabled={categoryCounts[category] === 0}
                >
                  <span>{toTitleCase(category)}</span>
                  <span>({categoryCounts[category]})</span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Fiyat Aralığı */}
      <div className=" border-b-2 border-gray-200 p-6">
        <label className="mb-2 text-base font-semibold flex items-center gap-2">
          <Tag size={16} /> Fiyat Aralığı
        </label>
        <div className="flex items-center gap-1 pl-2">
          <input
            maxLength={7}
            type="text"
            value={tempMinPrice}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value)) {
                setTempMinPrice(Number(e.target.value));
              }
            }}
            placeholder="Min"
            className="w-[74px] px-1 py-2 text-sm border rounded-lg text-center dark:bg-zinc-800 dark:border-zinc-700"
          />
          <span className="text-gray-500">-</span>
          <input
            maxLength={7}
            type="text"
            value={tempMaxPrice}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value)) {
                setTempMaxPrice(Number(e.target.value));
              }
            }}
            placeholder="Max"
            className="w-[74px] px-1 py-2 text-sm border rounded-lg text-center dark:bg-zinc-800 dark:border-zinc-700"
          />
          <button
            onClick={handleApplyFilter}
            className="bg-blue-200 text-black hover:bg-blue-100 duration-100 p-[5px] rounded-lg ml-1"
          >
            <Search width={20} />
          </button>
        </div>
      </div>

      {/* Stok Durumu */}
      <div className=" border-b-2 border-gray-200 p-6">
        <label className=" mb-2 text-base font-semibold flex items-center gap-2">
          <Package size={16} /> Stok Durumu
        </label>
        <div className="flex flex-col gap-2 pl-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="stockStatus"
              value="all"
              checked={stockStatus === "all"}
              onChange={() => setStockStatus("all")}
            />
            Tüm Ürünler
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="stockStatus"
              value="inStock"
              checked={stockStatus === "inStock"}
              onChange={() => setStockStatus("inStock")}
            />
            Stokta Olanlar
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="stockStatus"
              value="outOfStock"
              checked={stockStatus === "outOfStock"}
              onChange={() => setStockStatus("outOfStock")}
            />
            Tükenenler
          </label>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="border-b-2 border-gray-200 p-6">
        <label className="mb-2 text-base font-semibold flex items-center gap-2">
          <Star size={16} /> Minimum Puan
        </label>
        <div className="flex flex-col gap-2 pl-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="minimumRating"
                value={rating}
                checked={minimumRating === rating}
                onChange={() => setMinimumRating(rating)}
              />
              {/* sadece yıldız ve rating */}⭐ {rating} ve üstü
            </label>
          ))}
        </div>
      </div>

      {brandCounts && (
        <div className="border-b-2 border-gray-200 p-6">
          <label className=" mb-2 text-base font-semibold flex items-center gap-2">
            <Building2 size={16} /> Markalar
          </label>
          <div
            className="flex flex-col gap-2 max-h-48 overflow-y-auto pl-2 [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300"
          >
            {Object.keys(brandCounts)
              .filter((brand) => brand.trim() !== "" && brandCounts[brand] > 0) // sadece boş olmayan ve sayısı 0'dan büyük olanlar
              .sort()
              .map((brand) => (
                <label key={brand} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBrands([...selectedBrands, brand]);
                      } else {
                        setSelectedBrands(
                          selectedBrands.filter((b) => b !== brand)
                        );
                      }
                    }}
                  />
                  {brand}
                </label>
              ))}
          </div>
        </div>
      )}

      {/* Uygula */}
      <button
        onClick={handleApplyFilter}
        className="w-full bg-blue-300 hover:bg-blue-400 text-black py-2 rounded transition"
      >
        Filtreleri Uygula
      </button>
    </div>
  );
}
