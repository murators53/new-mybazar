import React from "react";
import LayoutWrapper from "../../shared/LayoutWrapper";
import ProductSkeleton from "./ProductSkeleton";
import Skeleton from "../Skeleton";

export default function SearchResultSkeleton({ title }: { title: string }) {
  return (
    <LayoutWrapper className="flex-1 ">
      <div className="p-4">
        <div className="flex justify-end ">
          <select className="p-2 w-auto ml-auto border rounded dark:bg-zinc-800 dark:border-zinc-700">
            <option value="default">Varsayılan</option>
            <option value="price-desc">Fiyat: Azalan</option>
            <option value="rating-desc">Puan: Azalan</option>
          </select>
        </div>
        <div className="flex justify-between items-center ">
          <h2 className="text-2xl font-bold my-6">{title} için sonuçlar</h2>
          <Skeleton className="w-[108px] h-5 mt-2"/>
        </div>
        <div className="grid grid-cols-1  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
