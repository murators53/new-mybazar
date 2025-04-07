"use client";

import ProductCard from "@/components/ProductCard";
// 🔄 React Query'nin temel hook’u. Veri çekme, caching, loading/error durumlarını yönetme gibi işleri otomatik yapar.
import { useQuery } from "@tanstack/react-query";

// Ürün verisinin TypeScript tipi tanımı API’den gelen ürünlerin hangi formatta
type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],//Bu sorguya(Query ) bir cache anahtar veriyoruz. Cache için kull.
    queryFn: async()=>{//Asıl veri çekme işlemi burada tanımlı. API'den veri 
      const res = await fetch('https://dummyjson.com/products');
      const json = await res.json();
      // console.log("json",json);//{products: Array(30), total: 194, skip: 0, limit: 30}
      return json.products as Product[];//json.products, API'den gelen ürün listesidir.
      //sadece urunleri don ve json.products datayi verir
    },
  });

  
  if (isLoading) return <div>Ürünler yükleniyor...</div>//Veri cekiliyorsa loader

  if (error) return <div>Ürünler getirilemedi</div>// Hata varsa mesaj gönder

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6">
      {data?.map((product)=> (
        <ProductCard 
          key={product.id}
          id={product.id.toString()}
          title={product.title}
          price={product.price}
          image={product.thumbnail}
        />
      ))}
    </div>
  );
}
