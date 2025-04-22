import CategoryClientPage from "@/components/CategoryClientPage";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const res = await fetch(`http://dummyjson.com/products/category/${params.slug}`);
  
  if (!res.ok) return notFound();

  const data = await res.json();
  const products = data.products;

  return (
    <CategoryClientPage slug={params.slug} products={products} />
  );
}
