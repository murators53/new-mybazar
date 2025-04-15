
import ProductCard from "@/components/ProductCard";
import LayoutWrapper from "@/components/shared/LayoutWrapper";
// 🔄 React Query'nin temel hook’u. Veri çekme, caching, loading/error durumlarını yönetme gibi işleri otomatik yapar.

// Ürün verisinin TypeScript tipi tanımı API’den gelen ürünlerin hangi formatta
type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

// API'den veri çeken server-side fonksiyon
async function getProducts() {
  if (process.env.NODE_ENV === "development") {
    // await new Promise((r) => setTimeout(r, 11333));
    // if (true) throw new Error("Test hatası!");
  }
  // Böylece sadece lokalde test eder, production'da anında yüklenir.
  

  const res = await fetch("https://dummyjson.com/products", {
    next: { revalidate: 60 },
  });
  const data = await res.json();
  return data.products;
}

export default async function Home() {
  const products = await getProducts(); // ⬅️ await burada olduğu için loading.tsx çalışır

  return (
    <LayoutWrapper>
      <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 p-6">
        {products.map((product: Product) => (
          <ProductCard
            key={product.id}
            id={product.id.toString()}
            title={product.title}
            price={product.price}
            image={product.thumbnail}
          />
        ))}
      </div>
    </LayoutWrapper>
  );
}