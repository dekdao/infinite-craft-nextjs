import { Search, Telescope } from "lucide-react";
import { useMemo, useState } from "react";
import { Sort, SortButton } from "./sort-button";
import { Element } from "@/interfaces/element";
import { ElementCardSideBarWrapper } from "./element-card";
import { useDroppable } from "@dnd-kit/core";

export const SideBar = ({
  elements,
  isLoading,
}: {
  elements: Element[];
  isLoading: boolean;
}) => {
  const [sort, setSort] = useState(Sort.Time);
  const [isDiscoveries, setIsDiscoveries] = useState(false);
  const [word, setWord] = useState("");

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

  const sortedElement = useMemo(() => {
    const sortedElement = [...elements];
    switch (sort) {
      case Sort.Time:
        return sortedElement;
      case Sort.Name:
        return sortedElement.sort((a, b) => a.text.localeCompare(b.text));
      case Sort.Emoji:
        return sortedElement.sort((a, b) => a.emoji.localeCompare(b.emoji));
    }
  }, [elements, sort]);

  const { setNodeRef } = useDroppable({
    id: "sidebar-area",
    data: {
      type: "sidebar",
    },
    disabled: isLoading,
  });

  return (
    <div
      className="col-span-3 border-l h-screen flex flex-col"
      ref={setNodeRef}
    >
      <div className="flex flex-1 justify-start items-start overflow-y-scroll overflow-x-hidden">
        <div className="flex flex-wrap gap-2 p-2">
          {sortedElement
            .filter((v) => !isDiscoveries || (isDiscoveries && v.discovered))
            .filter(
              (v) => !word || v.text.includes(word) || v.emoji.includes(word)
            )
            .map((element) => (
              <ElementCardSideBarWrapper
                key={element.text}
                element={element}
                isLoading={isLoading}
              />
            ))}
        </div>
      </div>
      <div className="h-22 border-t flex-shrink-0 flex-col">
        <div className="flex h-10">
          {!isDiscoveries && (
            <button
              className="flex flex-1 border gap-2 justify-center items-center"
              onClick={() => setIsDiscoveries(true)}
            >
              <Telescope /> Discoveries
            </button>
          )}
          {isDiscoveries && (
            <button
              className="flex flex-1 border gap-2 justify-center items-center bg-gray-500"
              onClick={() => setIsDiscoveries(false)}
            >
              <Telescope /> Discoveries
            </button>
          )}
          <SortButton sort={sort} onClick={onRotateSort} />
        </div>
        <div className="flex items-center gap-2 p-2">
          <Search />{" "}
          <input
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="flex px-2 rounded-md w-full text-gray-600"
            placeholder="Search..."
          />
        </div>
      </div>
    </div>
  );
};
