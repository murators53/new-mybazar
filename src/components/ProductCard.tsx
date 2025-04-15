"use client"; //ir client component çünk

//🧠 Sepet yönetimini sağlayan Zustand store’umu içeri
import { useCartStore } from "@/store/cartStore";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProductProps {
  id: string;
  title: string;
  price: number;
  image?: string;
}

const ProductCard = ({ id, title, price, image }: ProductProps) => {
  const addToCart = useCartStore((s) => s.addToCart);
  const pathname = usePathname();

  return (
    <div
      className={`border  border-blue-100 rounded-md p-4 flex flex-col gap-2  transition-transform duration-300 ease-in-out ${
        pathname !== "/" ? "" : "hover:shadow-lg hover:scale-105"
      }`}
    >
      <Link href={`/product/${id}`}>
        {image && (
          <img
            src={image}
            alt={title}
            className="w-full rounded-full  h-40 object-contain"
          />
        )}
        <h3 className="line-clamp-2 min-h-[48px] text-base font-medium mt-3">{title}</h3>
        <p className="text-primary font-bold">{price}₺</p>
      </Link>
      <Button
        variant="outline" // kenarlıklı stil
        onClick={() => addToCart({ id, title, price, image })}
      >
        Sepete Ekle
      </Button>
    </div>
  );
};

export default ProductCard;
