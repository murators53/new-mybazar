
import ProductCard from "@/components/ProductCard"; // Sepete Ekle için
import ProductDetailClient from "@/components/ProductDetailClient";
import { notFound, usePathname } from "next/navigation"; // ✅ Ürün bulunamazsa 404 sayfasına yönlendirmek için
type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  images: string[];
}; //✅ API'den gelecek ürün verisinin TypeScript tipini tanımlıyoruz

//✅ app/product/[id]/page.tsx gibi dynamic route sayfalarında
// Next.js params ile URL'deki id'yi veriyor.
export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(`https://dummyjson.com/products/${params.id}`);
  //✅ Verilen id'ye göre API'den ürün verisi çekiliyor

  //✅ Eğer API 404 veya 500 gibi bir hata dönerse → Next.js
  //notFound() fonk.u sayesinde kullanıcı 404 sayfasına yönlendirilir.
  if (!res.ok) return notFound();

  const product: Product = await res.json();
  //✅ API’den gelen JSON verisi Product tipinde product değişkenine atanıyor.

  return <ProductDetailClient product={product} />;
}
