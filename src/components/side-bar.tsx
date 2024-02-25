import { Telescope } from "lucide-react";
import { useState } from "react";
import { Sort, SortButton } from "./sort-button";
import { Element } from "@/interfaces/element";
import { ElementCardSideBarWrapper } from "./element-card";

export const SideBar = ({ elements }: { elements: Element[] }) => {
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
    <div className="col-span-3 border-l h-screen flex flex-col">
      <div className="flex flex-1 justify-start items-start">
        <div className="flex flex-wrap gap-2 p-2">
          {elements.map((element) => (
            <ElementCardSideBarWrapper key={element.text} element={element} />
          ))}
        </div>
      </div>
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
  );
};
