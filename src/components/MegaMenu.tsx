import { megaMenuData } from "@/utils/categoryGroups";
import Link from "next/link";
import React, { useState } from "react";

const MegaMenu = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  return (
    <div className="flex  items-center h-16 justify-center bg-gray-100 dark:bg-zinc-900">
      {Object.entries(megaMenuData).map(([mainCategory, subGroups], i) => {
        return (
          <div
            key={mainCategory}
            onMouseEnter={() => {
              setActiveCategory(mainCategory);
            }}
            onMouseLeave={() => {
              setActiveCategory(null);
            }}
            className={`${
              mainCategory === "Elektronik" ? "border-x-2 border-gray-200" : ""
            } hover:bg-white dark:hover:bg-zinc-800 py-1 px-4`}
          >
            <button className="px-4 hover:text-blue-600 font-semibold text-gray-500">
              {mainCategory}
            </button>

            {activeCategory === mainCategory && (
              <div className="absolute top-full left-0 mt-[-20px] p-2 dark:bg-zinc-800 bg-white shadow-lg  w-full flex gap-20 justify-center z-50 text-center border-b-2 border-blue-300">
                {Object.entries(subGroups).map(([groupTitle, items]) => (
                  <div key={groupTitle} className="p-2 mt-2 ">
                    <h4 className="font-semibold mb-2 w-fit text-start text-base text-blue-500 border-b-2 border-gray-200">
                      {groupTitle}
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600  dark:text-gray-300 text-start">
                      {items.map((item) => {
                        return (
                          <Link
                            href={`/category/${item
                              .toLowerCase()
                              .replace(" ", "-")}`}
                            key={item}
                            onClick={() => setActiveCategory(null)}
                          >
                            <span className="hover:underline cursor-pointer block mb-1 hover:font-semibold transition-all duration-300 ease-in-out">
                              {item}
                            </span>
                          </Link>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MegaMenu;
