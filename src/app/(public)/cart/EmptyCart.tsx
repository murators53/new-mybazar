import { ShoppingCart } from "lucide-react";

export default function EmptyCart() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      {/* <img src="/empty-cart.svg" alt="Sepet boş" className="w-40 h-40 " /> */}
      <ShoppingCart className="mb-4 w-32 h-32"/>
      <h2 className="text-xl font-bold">Sepetiniz Boş</h2>
      <p className="text-gray-500 mt-2">
        Ürün eklemek için alışverişe devam edin.
      </p>
    </div>
  );
}
