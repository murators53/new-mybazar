import React from "react";
import LayoutWrapper from "../../shared/LayoutWrapper";
import ProductSkeleton from "./ProductSkeleton";

export default function SearchResultSkeleton({ title }: { title: string }) {
  return (
    <LayoutWrapper>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">“{title}” için sonuçlar:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="">
               <ProductSkeleton key={i} />
            </div>
          ))}
        </div>
      </div>
    </LayoutWrapper>
  );
}
