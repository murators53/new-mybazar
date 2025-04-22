"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductProps {
  id: string;
  title: string;
  price: number;
  image?: string[];
  test?: string;
  product?: Product;
}

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  brand: string;
  rating: number;
  stock: number;
  category: string;
  images: string[]; // ✅ bunu ekle
};

const ProductCard = ({ id, title, price, image, product }: ProductProps) => {
  const addToCart = useCartStore((s) => s.addToCart);
  const pathname = usePathname();
  const [viewedPicture, setViewedPicture] = useState<string>("");
  const [pictureOrderPage, setPictureOrderPage] = useState<number>(0);

  console.log("pr0", product);

  return (
    <div
      className={`group border rounded-lg p-4 flex flex-col bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all duration-300 ${
        pathname !== "/" ? "" : "hover:scale-[1.02]"
      }`}
    >
      {/* Ürün görseli */}
      <Link
        href={`/product/${id}`}
        className="flex flex-col items-center relative"
      >
        <div className="absolute w-full h-full flex flex-row items-center justify-center">
          {product?.images.map((image, i) => (
            <p
              onMouseEnter={() => {
                setViewedPicture(image);
                setPictureOrderPage(i);
              }}
              className="flex-grow h-full left-0 z-10"
            ></p>
          ))}
          <span className="absolute bottom-[18%]  z-20 bg-gray-100 shadow-2xl rounded-lg  flex flex-row justify-center items-center gap-[3px]">
            {product?.images.map((_, i) => (
              <p
                className={`w-[10px] h-[10px] rounded-full duration-200 ease-in-out ${
                  pictureOrderPage === i ? "bg-blue-400" : "bg-blue-200"
                }`}
              ></p>
            ))}
          </span>
        </div>
        {image && (
          <img
            src={viewedPicture || image[0]}
            alt={title}
            className="w-48 h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {/* Ürün adı */}
        <h3 className="line-clamp-2 min-h-[48px] text-center text-base font-medium mt-3 text-gray-700 dark:text-gray-300">
          {title}
        </h3>

        {/* Ürün Puanı */}
        <div className="absolute shadow-lg rounded-full p-1 -top-3 -left-3 z-50 text-[11px]">⭐ {product?.rating}</div>
      </Link>

      {/* Ürün fiyatı */}
      <p className="text-center text-lg font-bold text-primary mt-2">
        {price}₺
      </p>

      {/* Sepete Ekle butonu */}
      {/* <Button
        variant="default"
        size="sm"
        onClick={() => addToCart({ id, title, price, image })}
        className="mt-4"
      >
        Sepete Ekle
      </Button> */}
    </div>
  );
};

export default ProductCard;
