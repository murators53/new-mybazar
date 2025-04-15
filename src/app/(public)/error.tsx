"use client";

import LayoutWrapper from "@/components/shared/LayoutWrapper";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Sayfa hatası:", error);
  }, [error]);

  return (
    <LayoutWrapper>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-4">
        <h2 className="text-2xl font-bold text-red-400">Bir hata oluştu</h2>
        <p className="text-gray-500 dark:text-gray-300">
  {error.message.includes("Network")
    ? "Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edin."
    : "Bir şeyler ters gitti."}
</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
        >
          Sayfayı Yenile
        </button>
      </div>
    </LayoutWrapper>
  );
}
