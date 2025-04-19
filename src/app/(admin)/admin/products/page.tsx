"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Skeleton from "@/components/ui/Skeleton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/DeleteProductDialog";

type Product = {
  _id: string;
  title: string;
  price: number;
  stock: number;
  image: string;
  isDeleting?: boolean;
};

export default function AdminProductsPage() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/product/admin", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error("Veri alınamadı");
        }

        const data = await res.json();
        console.log("✅ Ürün verileri alındı:", data);

        setProducts(data);
      } catch (err) {
        console.error("🔥 Hata oluştu:", err);
        setError(true);
      } finally {
        console.log("⏹️ fetchProducts tamamlandı (başarı veya hata)");
        setLoading(false);
      }
    };

    if (accessToken) {
      console.log("🟢 accessToken mevcut, fetchProducts başlıyor...");
      fetchProducts();
    } else {
      console.warn("⚠️ accessToken mevcut değil, fetch yapılmadı");
    }
  }, [accessToken]);

  const handleDelete = async () => {
    if (!selectedProductId) return;

    try {
      setIsDeleting(true);

      const res = await fetch(`/api/product/admin?id=${selectedProductId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`, // Varsa
        },
      });

      if (!res.ok) {
        throw new Error("Ürün silinemedi");
      }

      toast.success("Ürün başarıyla silindi!");

      // ✅ Ürünleri güncellemek için products state'ini güncelle (örneğin)
      setProducts((prev) => prev.filter((p) => p._id !== selectedProductId));
    } catch (error) {
      console.error(error);
      toast.error("Silme işlemi başarısız oldu");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSelectedProductId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        <Link
          href="/admin/products/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          ➕ Ürün Ekle
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-6">📦 Ürünler</h2>

      {loading && (
        <>
          {console.log("🟡 loading TRUE - Skeleton gösteriliyor")}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </>
      )}

      {error && (
        <>
          {console.log("🔴 error TRUE - ErrorMessage gösteriliyor")}
          <ErrorMessage
            type="network"
            message="Ürünler alınamadı."
            statusCode={500}
          />
        </>
      )}

      {!loading && !error && products.length === 0 && (
        <>
          {console.log("🟣 Ürün listesi boş")}
          <p>Henüz ürün eklenmemiş.</p>
        </>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          {console.log("🟢 Ürünler render ediliyor:", products)}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="border p-4 rounded shadow-sm flex flex-col items-center gap-2 transition-all duration-300"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-24 w-24 object-contain"
                />
                <h3 className="font-semibold text-lg">{product.title}</h3>
                <p className="text-green-600 font-bold">{product.price}₺</p>
                <p className="text-sm text-gray-500">
                  Stok: {product.stock > 0 ? product.stock : "Stokta yok"}
                </p>

                <div className="flex gap-2 mt-2">
                  <button
                    className="text-sm px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-white font-semibold"
                    onClick={() =>
                      router.push(`/admin/products/${product._id}/edit`)
                    }
                  >
                    ✏️ Düzenle
                  </button>
                  <Button
                    type="button"
                    onClick={() => {
                      setSelectedProductId(product._id);
                      setIsDeleteDialogOpen(true);
                    }}
                    disabled={isDeleting && selectedProductId === product._id}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm transition disabled:opacity-50"
                  >
                    {isDeleting && selectedProductId === product._id
                      ? "Siliniyor..."
                      : "Sil"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <DeleteDialog
        open={isDeleteDialogOpen}
        isLoading={isDeleting}
        onClose={() => {
          if (!isDeleting) setIsDeleteDialogOpen(false);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
