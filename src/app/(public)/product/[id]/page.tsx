import ProductDetailClient from "@/components/ProductDetailClient";
import { notFound } from "next/navigation"; // ✅ Ürün bulunamazsa 404 sayfasına yönlendirmek için
type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  images: string[];
}; //✅ API'den gelecek ürün verisinin TypeScript tipini tanımlıyoruz

export async function generateMetadata({ params }: { params: { id: string } }) {
  const res = await fetch(`https://dummyjson.com/products/${params.id}`);
  const product = await res.json();
  if (!product) {
    return {
      title: "Ürün bulunamadı",
    };
  }

  return {
    title: `${product.title} | MyBāzar`,
    description: product.description,
    openGraph: {
      title: `${product.title} | MyBāzar`,
      description: product.description,
      images: [product.thumbnail],
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description,
      images: [product.thumbnail],
    },
  };
}

//✅ app/product/[id]/page.tsx gibi dynamic route sayfalarında
// Next.js params ile URL'deki id'yi veriyor.
export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(`https://dummyjson.com/products/${params.id}`);
  //✅ Verilen id'ye göre API'den ürün verisi çekiliyor
  if (process.env.NODE_ENV === "development") {
    await new Promise((r) => setTimeout(r, 2200));
    //  throw new Error("test hatasi");
  }
  //✅ Eğer API 404 veya 500 gibi bir hata dönerse → Next.js
  //notFound() fonk.u sayesinde kullanıcı 404 sayfasına yönlendirilir.
  if (!res.ok) return notFound();

  const product: Product = await res.json();
  //✅ API’den gelen JSON verisi Product tipinde product değişkenine atanıyor.

  return <ProductDetailClient product={product} />;
}
