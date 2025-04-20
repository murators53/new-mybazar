"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "@/components/ImageUploader";

export default function AdminProductCreatePage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [croppedFile, setCroppedFile] = useState<File | null>(null); // 🆕 Kırpılmış dosyayı tutuyoruz
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken) {
      toast.error("Yetkilendirme hatası", {
        description: "Lütfen tekrar giriş yapın.",
      });
      return;
    }

    if (!croppedFile) {
      toast.error("Ürün görseli eksik", {
        description: "Lütfen bir ürün görseli seçin.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const loadingToast = toast.loading("Görsel yükleniyor...");

      // 🔥 1. Cloudinary'ye yükle
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

      if (!uploadData.secure_url) {
        throw new Error("Görsel yüklenemedi");
      }

      const imageUrl = uploadData.secure_url;

      // 🔥 2. Ürünü kaydet
      const productData = {
        title: title.trim(),
        price,
        stock,
        image: imageUrl,
      };

      const res = await fetch("/api/product/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Ürün eklenemedi");
      }

      // 🎯 Success işlemleri
      toast.success("🎉 Ürün başarıyla kaydedildi!");
      toast.dismiss(loadingToast); // yükleniyor mesajını kapat

      setTimeout(() => {
        router.push("/admin/products");
      }, 1500); // biraz gecikmeyle yönlendiriyoruz ki mesajı görebilelim
    } catch (error: any) {
      console.error("Ürün kaydedilirken hata:", error);
      toast.error(error.message || "Bilinmeyen hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">➕ Yeni Ürün Ekle</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Başlık */}
        <div>
          <label className="block font-semibold mb-1">Ürün Başlığı</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
          />
        </div>

        {/* Fiyat ve Stok */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Fiyat (₺)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              className="w-full p-2 border rounded bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
            />
          </div>

          <div className="flex-1">
            <label className="block font-semibold mb-1">Stok Adedi</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              required
              className="w-full p-2 border rounded bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
            />
          </div>
        </div>

        {/* Görsel Yükleyici */}
        <div>
          <label className="block font-semibold mb-1">Ürün Görseli</label>
          <ImageUploader
            onUploadComplete={(croppedFile) => setCroppedFile(croppedFile)}
          />
        </div>

        {/* Kaydet Butonu */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-fit mx-auto flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-3 px-8 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Yükleniyor..." : "Ürünü Kaydet"}
        </button>
      </form>
    </div>
  );
}
