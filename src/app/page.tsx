"use client";
import { useEffect, useState } from "react";
import { SideBar } from "../components/side-bar";
import { Element, PlacedElement } from "@/interfaces/element";
import { defaultElement } from "../constants/default-element";
import { ElementCardDraggableWrapper } from "../components/element-card";
import { useDrop } from "react-dnd";

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

  const onChangePosition = (index: number, x: number, y: number) => {
    const overlappingElementIndex = placedElements.findIndex((element, i) => {
      const width = `${element.emoji} ${element.text}`.length * 10;
      return (
        i !== index &&
        x < element.x + width &&
        x > element.x - width &&
        y < element.y + 20 &&
        y > element.y - 20
      );
    });
    if (overlappingElementIndex !== -1) {
      console.log("overlapping element", index, overlappingElementIndex);
    } else {
      setPlacedElements((prev) => {
        const newPlacedElements = [...prev];
        newPlacedElements[index] = {
          ...newPlacedElements[index],
          x,
          y,
        };
        return newPlacedElements;
      });
    }
  };

  const [, drop] = useDrop(() => ({
    accept: "sidebar-element",
    drop: (element: Element, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (element && clientOffset) {
        const width = `${element.emoji} ${element.text}`.length * 10;
        setPlacedElements((prev) => [
          ...prev,
          {
            ...element,
            x: clientOffset.x - width / 2,
            y: clientOffset.y - 15,
          },
        ]);
      }
    },
  }));

  return (
    <main className="flex h-screen flex-col">
      <div className="grid grid-cols-12 h-full">
        <div ref={drop} className="col-span-9 h-full w-full">
          {placedElements.map((element, index) => (
            <ElementCardDraggableWrapper
              key={index}
              element={element}
              index={index}
              onChangePosition={onChangePosition}
            />
          ))}
        </div>
        <SideBar elements={elements} />
      </div>
    </main>
  );
}
