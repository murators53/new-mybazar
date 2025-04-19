"use client";

import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminProductCreatePage() {
  const [fileError, setFileError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false); // 🆕 Ekledik
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

    try {
      setIsSubmitting(true); // ✅ Submit başladığında loading true
      const newProduct = {
        title,
        price,
        stock,
        image: previewUrl || "", // Geçici olarak preview URL'sini kullanıyoruz (ileride gerçek upload yapacağız)
      };

      // 2️⃣ Ürün bilgisini API'ye POST edelim
      const res = await fetch("/api/product/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Ürün eklenemedi");
      }

      toast.success("🎉 Ürün başarıyla kaydedildi!", {
        description: "Yeni ürün admin panelinde listelendi.",
      });

      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);
    } catch (error: any) {
      console.error("🔥 Ürün kaydedilirken hata:", error);
      toast.error("Ürün eklenemedi!", {
        description: error.message || "Bilinmeyen bir hata oluştu.",
      });
    } finally {
      setIsSubmitting(false); // ✅ Ne olursa olsun loading kapanır
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded shadow-md transition-colors duration-300">
      {" "}
      <h2 className="text-2xl font-bold mb-6">➕ Yeni Ürün Ekle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Ürün Başlığı</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-colors duration-300"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Fiyat (₺)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full p-2 border rounded bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-colors duration-300"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Stok Adedi</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="w-full p-2 border rounded bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-colors duration-300"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Ürün Görseli</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (!selectedFile) return;

              const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
              if (!allowedTypes.includes(selectedFile.type)) {
                setFileError("Sadece JPEG, PNG veya WebP formatı desteklenir.");
                toast.error("Desteklenmeyen dosya formatı!", {
                  description: "JPEG, PNG veya WebP dosyası yükleyin.",
                });
                setFile(null);
                setPreviewUrl("");
                return;
              }

              if (selectedFile.size > 5 * 1024 * 1024) {
                setFileError("Dosya boyutu 5MB'dan küçük olmalı.");
                toast.error("Dosya çok büyük!", {
                  description: "5MB'dan küçük bir görsel yükleyin.",
                });
                setFile(null);
                setPreviewUrl("");
                return;
              }

              setFileError("");
              setFile(selectedFile);
              setPreviewUrl(URL.createObjectURL(selectedFile));
            }}
            className={`w-full p-2 border rounded transition-colors duration-300 ${
              fileError
                ? "border-red-500"
                : "border-gray-300 dark:border-zinc-700"
            }`}
            required
          />
          {fileError && (
            <p className="text-red-500 text-sm mt-1">{fileError}</p>
          )}
          {previewUrl && (
            <div className="mt-4 p-2 border rounded bg-gray-50 dark:bg-zinc-800 flex justify-center items-center w-40 h-40 mx-auto shadow">
              <img
                src={previewUrl}
                alt="Önizleme"
                className="object-cover w-full h-full rounded"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting} // 🛡️ Tıklanamaz yap
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Yükleniyor..." : "Ürünü Kaydet"}
        </button>
      </form>
    </div>
  );
}
