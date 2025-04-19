"use client";

import { useState, useEffect } from "react";
import { Crop, Trash2 } from "lucide-react";
import CropperModal from "./CropperModal";
import { toast } from "sonner";

interface ImageUploaderProps {
  onUploadComplete: (file: File) => void;
  existingImage?: string | null;
}

export default function ImageUploader({ onUploadComplete, existingImage }: ImageUploaderProps) {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✨ Sayfa açıldığında mevcut görseli yükle
  useEffect(() => {
    if (existingImage) {
      setPreviewUrl(existingImage);
    }
  }, [existingImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Sadece JPEG, PNG veya WebP dosyası yükleyebilirsiniz.");
      toast.error("Geçersiz dosya formatı!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Dosya boyutu 5MB'dan küçük olmalıdır.");
      toast.error("Dosya boyutu çok büyük!");
      return;
    }

    const url = URL.createObjectURL(file);

    setOriginalFile(file);
    setOriginalUrl(url);
    setSelectedFile(file);
    setPreviewUrl(url);
    setError(null);
    setIsCropperOpen(false);
    onUploadComplete(file);

    e.target.value = ""; // Aynı dosyayı tekrar seçebilmek için sıfırla
  };

  const handleRemoveImage = () => {
    setOriginalFile(null);
    setOriginalUrl(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setIsCropperOpen(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative w-52 h-52 rounded flex items-center justify-center overflow-hidden 
          ${error ? "border-2 border-red-500" : "border-2 border-dashed border-gray-300 dark:border-zinc-700"}
          bg-gray-50 dark:bg-zinc-800
        `}
      >
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Önizleme" className="object-cover w-full h-full" />

            {/* ✂️ Kırp */}
            {originalFile && (
              <button
                type="button"
                onClick={() => {
                  if (originalFile) {
                    setSelectedFile(originalFile);
                    setPreviewUrl(originalUrl);
                    setIsCropperOpen(true);
                  }
                }}
                className="absolute top-2 left-2 bg-white p-1 rounded-full shadow hover:bg-gray-200 transition"
                title="Kırp"
              >
                <Crop className="w-4 h-4 text-gray-600" />
              </button>
            )}

            {/* 🗑️ Sil */}
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-200 transition"
              title="Sil"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </>
        ) : (
          <label
            htmlFor="file-upload"
            className="text-gray-400 text-sm text-center cursor-pointer"
          >
            Görsel Yükle
          </label>
        )}
      </div>

      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-red-500 text-xs">{error}</p>}

      {isCropperOpen && selectedFile && (
        <CropperModal
          imageUrl={originalUrl!}
          originalName={originalFile!.name}
          originalType={originalFile!.type}
          onClose={() => setIsCropperOpen(false)}
          onCropComplete={(croppedFile) => {
            setSelectedFile(croppedFile);
            setPreviewUrl(URL.createObjectURL(croppedFile));
            onUploadComplete(croppedFile);
            setIsCropperOpen(false);
          }}
        />
      )}
    </div>
  );
}
