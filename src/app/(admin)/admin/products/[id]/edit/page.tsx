// app/admin/products/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import ImageUploader from "@/components/ImageUploader"; // kırpma destekli
import { useAuthStore } from "@/store/authStore";

export default function AdminProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const accessToken = useAuthStore((s) => s.accessToken);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [existingImage, setExistingImage] = useState<string | undefined>(
    undefined
  );
  const [croppedFile, setCroppedFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const id = params?.id as string;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/admin?id=${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error("Ürün verisi alınamadı");
        }

        const data = await res.json();

        // 🧠 Gelen ürün verilerini form input'larına yerleştiriyoruz:
        setTitle(data.title);
        setPrice(data.price);
        setStock(data.stock);
        setExistingImage(data.image); // 🔥 Görsel
      } catch (error) {
        console.error("Ürün verisi çekilemedi:", error);
        toast.error("Ürün bulunamadı veya yüklenemedi.");
      } finally {
        setIsLoading(false); // 🔥 HATA olsa da YÜKLEMEYİ KAPAT
      }
    };

    if (id && accessToken) {
      fetchProduct();
    }
  }, [id, accessToken]);

  // 📤 Güncelle
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      let imageUrl = existingImage;

      if (croppedFile) {
        const formData = new FormData();
        formData.append("file", croppedFile);
        formData.append("upload_preset", "mybazar_upload");

        const uploadRes = await fetch(
          "https://api.cloudinary.com/v1_1/dmkvrdab7/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const uploadData = await uploadRes.json();
        if (!uploadData.secure_url) throw new Error("Görsel yüklenemedi");
        imageUrl = uploadData.secure_url;
      }

      const res = await fetch(`/api/product/admin?id=${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          price,
          stock,
          image: imageUrl,
        }),
      });

      if (!res.ok) throw new Error("Ürün güncellenemedi");

      toast.success("✅ Ürün başarıyla güncellendi!");
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err.message || "Bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">✏️ Ürünü Güncelle</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-1">Ürün Başlığı</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Fiyat (₺)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Stok Adedi</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full p-2 border rounded dark:bg-zinc-800 dark:text-white"
              required
            />
          </div>
        </div>

        {/* 🔁 Görsel güncellenirse: */}
        <div>
          <label className="block font-semibold mb-1">Ürün Görseli</label>
          <ImageUploader
            onUploadComplete={(file) => setCroppedFile(file)}
            existingImage={existingImage}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-fit  mx-auto flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-3 px-8 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Güncelleniyor...</span>
            </>
          ) : (
            "Ürünü Güncelle"
          )}
        </button>
      </form>
    </div>
  );
}
