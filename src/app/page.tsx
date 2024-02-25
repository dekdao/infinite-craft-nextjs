"use client";
import { useEffect, useState } from "react";
import { SideBar } from "./components/side-bar";
import { Element, PlacedElement } from "@/app/interfaces/element";
import { defaultElement } from "./constants/default-element";
import { ElementCardDraggableWrapper } from "./components/element-card";

export default function Home() {
  const [elements, setElements] = useState<Element[]>([]);
  const [placedElements, setPlacedElements] = useState<PlacedElement[]>([]);

  useEffect(() => {
    const items = localStorage.getItem("elements");
    if (items && JSON.parse(items).length > 0) {
      setElements(JSON.parse(items));
    } else {
      setElements(defaultElement);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("elements", JSON.stringify(elements));
  }, [elements]);

  const onDropElement = (e: React.DragEvent<HTMLDivElement>) => {
    const elementText = e.dataTransfer.getData("element-text");
    const element = elements.find((e) => e.text === elementText);
    if (element) {
      console.log(e);
      setPlacedElements([
        ...placedElements,
        {
          ...element,
          x: e.clientX,
          y: e.clientY,
        },
      ]);
    }
  };

  return (
    <main className="flex h-screen flex-col">
      <div className="grid grid-cols-12 h-full">
        <div
          className="col-span-9 h-full w-full"
          onDrop={onDropElement}
          onDragOver={(e) => e.preventDefault()}
        >
          {placedElements.map((element, index) => (
            <ElementCardDraggableWrapper
              key={index}
              element={element}
              index={index}
            />
          ))}
        </div>
        <SideBar elements={elements} />
      </div>
    </main>
  );
}
