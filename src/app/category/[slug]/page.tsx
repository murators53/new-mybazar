import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

export default async function ({ params }: { params: { slug: string } }) {
  ("params", params);

  const res = await fetch(
    `http://dummyjson.com/products/category/${params.slug}`
  );

  if (!res.ok) return notFound();

  const data = await res.json();
  const products: Product[] = data.products;

  const toTitleCase = (str: string) => {
    return str
      .replaceAll("-", " ") // tüm tireleri boşluk yap
      .split(" ") // boşluklara göre ayır
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // baş harfi büyüt
      .join(" "); // tekrar birleştir
  };

  return (
    <div>
      {/* <h2>{params.slug.replace("-", " ")} kategorisindeki ürünler</h2> */}
      <h2 className="text-2xl font-bold mb-4 capitalize">{toTitleCase(params.slug)} kategorisindeki ürünler</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => {
          return (
          <ProductCard 
            key={product.id}
            id={product.id.toString()}
            title={product.title}
            price={product.price}
            image={product.thumbnail}
          />)
        })}
      </div>
    </div>
  );
}
