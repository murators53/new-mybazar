"use client";

import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import { Filter } from "lucide-react";
import { useState } from "react";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  brand: string;
  rating: number;
  stock: number;
  category: string;
  images: string[];
};

export default function CategoryClientPage({
  slug,
  products,
}: {
  slug: string;
  products: Product[];
}) {
  const [tempMaxPrice, setTempMaxPrice] = useState<number>(1000);
  const [tempMinPrice, setTempMinPrice] = useState<number>(0);
  const [appliedMinPrice, setAppliedMinPrice] = useState<number>(0);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number>(100000);
  const [sortOption, setSortOption] = useState<string>("default");

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minimumRating, setMinimumRating] = useState<number>(0);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [stockStatus, setStockStatus] = useState<
    "all" | "inStock" | "outOfStock"
  >("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredAndSortedProducts = (products ?? [])
    .filter((p) => p.price >= appliedMinPrice && p.price <= appliedMaxPrice)
    .filter(
      (p) => selectedBrands.length === 0 || selectedBrands.includes(p.brand)
    )
    .filter((p) => minimumRating === 0 || p.rating >= minimumRating)
    .filter((p) => {
      if (stockStatus === "inStock") return p.stock > 0;
      if (stockStatus === "outOfStock") return p.stock === 0;
      return true;
    })
    .filter((p) => {
      if (!selectedCategory) return true;
      return p.category === selectedCategory;
    })
    .sort((a, b) => {
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - a.price;
      if (sortOption === "title-asc") return a.title.localeCompare(b.title);
      if (sortOption === "title-desc") return b.title.localeCompare(a.title);
      if (sortOption === "rating-asc") return a.rating - b.rating;
      if (sortOption === "rating-desc") return b.rating - a.rating;
      return 0;
    });

  const dynamicBrandCounts = filteredAndSortedProducts.reduce(
    (acc: Record<string, number>, p) => {
      if (!p.brand) return acc; // 🔥 Eğer brand yoksa sayma
      acc[p.brand] = (acc[p.brand] || 0) + 1;
      return acc;
    },
    {}
  );

  const dynamicCategoryCounts = filteredAndSortedProducts.reduce(
    (acc: Record<string, number>, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    },
    {}
  );

  const handleRemoveBrand = (brand: string) => {
    setSelectedBrands((prev) => prev.filter((b) => b !== brand));
  };

  const resetPriceFilter = () => {
    setTempMinPrice(0);
    setTempMaxPrice(100000);
    setAppliedMinPrice(0);
    setAppliedMaxPrice(100000);
  };

  return (
    <div className="flex max-w-[1600px] mx-auto">
      <FilterSidebar
        tempMinPrice={tempMinPrice}
        tempMaxPrice={tempMaxPrice}
        setTempMinPrice={setTempMinPrice}
        setTempMaxPrice={setTempMaxPrice}
        handleApplyFilter={() => {
          setAppliedMinPrice(tempMinPrice);
          setAppliedMaxPrice(tempMaxPrice);
        }}
        sortOption={sortOption}
        setSortOption={setSortOption}
        selectedBrands={selectedBrands}
        setSelectedBrands={setSelectedBrands}
        setMinimumRating={setMinimumRating}
        minimumRating={minimumRating}
        stockStatus={stockStatus}
        setStockStatus={setStockStatus}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        brandCounts={dynamicBrandCounts}
        categoryCounts={dynamicCategoryCounts}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
      />

      <div className="flex-1 p-4">
        {/* Ürün Sayısı ve Sıralama */}
        <div className=" flex justify-between items-center mb-6 gap-2 ml-3">
          {(selectedBrands.length > 0 ||
            minimumRating !== 0 ||
            appliedMinPrice !== 0 ||
            appliedMaxPrice !== 100000 ||
            selectedCategory) && (
            <div className="flex-1 min-w-0 h-[32px]">
              <div
                className="flex flex-nowrap ml-6 sm:m-0  overflow-x-auto gap-2 rounded-lg  [&::-webkit-scrollbar]:h-[8px] [&::-webkit-scrollbar-track]:bg-gray-100
          [&::-webkit-scrollbar-thumb]:bg-gray-300"
              >
                {/* Seçilen Markalar */}
                {selectedBrands.map((brand) => (
                  <span
                    key={brand}
                    className="inline-flex shrink-0 gap-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:shadow-md ease-in-out px-3 py-1 rounded-full text-sm"
                  >
                    {brand}
                    <button
                      onClick={() => handleRemoveBrand(brand)}
                      className="text-xs "
                    >
                      ✕
                    </button>
                  </span>
                ))}

                {/* Minimum Rating */}
                {minimumRating !== 0 && (
                  <span className="inline-flex shrink-0 gap-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 hover:shadow-md ease-in-out px-3 py-1 rounded-full text-sm">
                    {minimumRating} yıldız ve üstü
                    <button
                      onClick={() => setMinimumRating(0)}
                      className="text-xs"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {/* Fiyat Aralığı */}
                {(appliedMinPrice !== 0 || appliedMaxPrice !== 100000) && (
                  <span className="inline-flex shrink-0 gap-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:shadow-md ease-in-out px-3 py-1 rounded-full text-sm">
                    {appliedMinPrice}₺ - {appliedMaxPrice}₺
                    <button onClick={resetPriceFilter} className="text-xs">
                      ✕
                    </button>
                  </span>
                )}

                {/* Kategori */}
                {selectedCategory && (
                  <span className="inline-flex shrink-0 gap-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 hover:shadow-md ease-in-out px-3 py-1 rounded-full text-sm">
                    {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="text-xs"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
          <div className="flex-shrink-0 ml-auto">
          <button
              className={`${
                isFilterOpen && ""
              }  sm:hidden block hover:bg-blue-200 p-1 rounded-full absolute left-[12.5px] top-[153px] `}
              onClick={() => setIsFilterOpen(true)}
            >
              <Filter />
            </button>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-2 w-auto ml-auto border rounded dark:bg-zinc-800 dark:border-zinc-700"
            >
              <option value="default">Varsayılan</option>
              <option value="price-asc">Fiyat: Artan</option>
              <option value="price-desc">Fiyat: Azalan</option>
              <option value="title-asc">İsim: A-Z</option>
              <option value="title-desc">İsim: Z-A</option>
              <option value="rating-asc">Puan: Artan</option>
              <option value="rating-desc">Puan: Azalan</option>
            </select>
          </div>
        </div>

        {/* Başlık */}
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {`${slug.replace(/-/g, " ")}`} Kategorisindeki Ürünler
          </h2>
          <span className="text-sm text-gray-600 dark:text-gray-400 pt-2 pl-2">
            <strong>{filteredAndSortedProducts.length}</strong> ürün bulundu
          </span>
        </div>

        {/* Ürünler */}
        <div className={`${isFilterOpen && 'hidden'} grid grid-cols-1  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`}>
          {filteredAndSortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id.toString()}
              title={product.title}
              price={product.price}
              image={product.images}
              product={product}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
