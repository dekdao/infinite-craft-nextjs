"use client";

import { Telescope } from "lucide-react";
import { useState } from "react";
import { Sort, SortButton } from "./components/sort-button";

export default function Home() {
  const [sort, setSort] = useState(Sort.Time);

  const onRotateSort = () => {
    switch (sort) {
      case Sort.Time:
        setSort(Sort.Name);
        break;
      case Sort.Name:
        setSort(Sort.Emoji);
        break;
      case Sort.Emoji:
        setSort(Sort.Time);
        break;
    }
  };

  return (
    <main className="flex h-screen flex-col">
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-9">A</div>
        <div className="col-span-3 border-l h-screen flex flex-col">
          <div className="flex-1 overflow-auto">Element</div>
          <div className="h-24 border-t flex-shrink-0 flex-col">
            <div className="flex h-10">
              <button className="flex flex-1 border gap-2 justify-center items-center">
                <Telescope /> Discoveries
              </button>
              <SortButton sort={sort} onClick={onRotateSort} />
            </div>
            <div className="flex-1">Element</div>
          </div>
        </div>
      </div>
    </main>
  );
}
