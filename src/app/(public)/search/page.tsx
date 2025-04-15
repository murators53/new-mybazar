"use client";

import ProductCard from "@/components/ProductCard";
import SearchResultSkeleton from "@/components/ui/skeletons/SearchResultSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

// 🔧 Sen sadece query değerini alıp API’ye iletiyorsun,
// yani “ben şunu arıyorum” diyorsun.
// 🎯Asıl arama işini yapan taraf → API'nin kendisi (backend).

export default function SearchPage() {
  // Senin arama kutusuna yazıp enter'a bastığında veya bir arama
  // butonuna basıldığında URL'ye q=aramaTerimi eklenmişse, o değeri okur.
  const searchParams = useSearchParams();
  const query = searchParams.get("q"); //URL?q=iphone gibi bir sorgu varsa, bu query = "iphone" olacak

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", query], //queryKey	Aynı sorguyu tekrar yapmamak için cache anahtarı
    queryFn: async () => {
      //API çağrısı yapan async fonksiyon
      const res = await fetch(
        `https://dummyjson.com/products/search?q=${query}`
      );
      const json = await res.json();

      if (process.env.NODE_ENV === "development") {
        // await new Promise((r) => setTimeout(r, 11333));
        // if (true) throw new Error("Test hatası!");
      }

      return json.products as Product[];
    },
    enabled: !!query, // ✅ Sadece query varsa çalışır
    //query boşsa çalıştırmaz → null, undefined, "" engellenir
  });

  // Kullanıcı ?q= göndermemişse → direkt mesaj gösterilir
  if (!query) return <div className="p-8 text-center">Arama terimi yok</div>;
  if (isLoading) return <SearchResultSkeleton title={`"${query}"`} />;
  if (error)
    return (
      <div className="p-8 text-center text-red-600 dark:text-red-400">
        Arama sırasında bir hata oluştu. Lütfen tekrar deneyin.
      </div>
    );
  if (data?.length === 0)
    return <div className="p-8 text-center">Sonuç bulunamadı.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">“{query}” için sonuçlar:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data?.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id.toString()}
            title={product.title}
            price={product.price}
            image={product.thumbnail}
          />
        ))}
      </div>
    </div>
  );
}
