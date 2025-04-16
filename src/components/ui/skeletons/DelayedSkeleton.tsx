"use client";

import { useEffect, useState } from "react";
import Skeleton from "../Skeleton";

export default function DelayedSkeleton({
  className,
  delay = 800, // varsayılan: 800ms sonra göster
}: {
  className?: string;
  delay?: number;
}) {
  const [show, setShow] = useState(false); // Başta skeleton görünmeyecek

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay); // delay kadar bekle
    return () => clearTimeout(timer); // bileşen unmount olursa timer temizlenir
  }, [delay]);

  if (!show) return null; // show false iken hiçbir şey gösterme

  return <Skeleton className={className} />; // süre dolunca göster
}
