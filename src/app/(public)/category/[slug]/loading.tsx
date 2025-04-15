// sayfa yüklenirken gösterilir

import LayoutWrapper from "@/components/shared/LayoutWrapper";
import ProductSkeleton from "@/components/ui/skeletons/ProductSkeleton";

export default function GlobalLoading() {
  return (
    <LayoutWrapper>
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 p-6">
        {/* Yüklenme sırasında gösterilecek ürün Skeleton'ları */}
        {[...Array(12)].map((_, i) => (
          // Her bir ürün için ayrı ProductSkeleton bileşeni oluşturuyoruz.
          <ProductSkeleton key={i} />
        ))}
      </div>
    </LayoutWrapper>
  );
}
