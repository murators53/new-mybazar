// app/(user)/error.tsx
'use client';

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("🚨 Segment Hatası:", error);
  }, [error]);

  return (
    <div className="flex flex-col justify-center items-center h-[60vh] text-center text-red-600">
      <h2 className="text-2xl font-bold mb-4">Bir hata oluştu 😓</h2>
      <p className="mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
      >
        Tekrar Dene
      </button>
    </div>
  );
}
