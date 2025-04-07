"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cartStore";
import { usePathname } from "next/navigation";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  images: string[];
};

export default function ProductDetailClient({ product }: { product: Product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const handlePrev = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  // ✅ Sepete ekleme fonksiyonu Zustand'dan
  const addToCart = useCartStore((s) => s.addToCart);

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Görsel */}
      <div className="relative">
        <img
          src={product.images[currentImageIndex]}
          alt={`Product ${currentImageIndex + 1}`}
          className="w-full object-contain rounded-md border h-96"
        />

        {/* Sol - Sağ oklar */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:scale-110"
        >
          ←
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:scale-110"
        >
          →
        </button>

        {/* Alt thumbnails */}
        <div className="flex gap-2 mt-4">
          {product.images.slice(0, 4).map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`thumb ${i}`}
              onClick={() => setCurrentImageIndex(i)}
              className={`w-16 h-16 object-cover rounded border cursor-pointer ${
                i === currentImageIndex ? "ring-2 ring-blue-500" : ""
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bilgiler */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <p className="text-muted-foreground text-sm">{product.description}</p>
        <p className="text-xl font-semibold text-primary">{product.price}₺</p>

        {/* ✅ Doğrudan sepete ekle */}
        <Button variant={"outline"} 
        onClick={() => addToCart({
          id: product.id.toString(),
          title: product.title,
          price: product.price,
          image: product.thumbnail,
        })}>
          Sepete Ekle
        </Button>
      </div>
    </div>
  );
}
