"use client";;
import { useEffect, useState } from "react";
import { SideBar } from "../components/side-bar";
import { Element, PlacedElement } from "@/interfaces/element";
import { defaultElement } from "../constants/default-element";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { PlaygroundArea } from "@/components/playground-area";
import { v4 as uuid } from "uuid";
import { ElementCard } from "@/components/element-card";

export default function Home() {
  const [elements, setElements] = useState<Element[]>([]);
  const [placedElements, setPlacedElements] = useState<PlacedElement[]>([]);

  const [activeElement, setActiveElement] = useState<Element | null>(null);
  const [activePlacedElement, setActivePlacedElement] =
    useState<PlacedElement | null>(null);

  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleWindowMouseMove = (event: any) => {
      setMouseCoords({
        x: event.clientX,
        y: event.clientY,
      });
    };
    window.addEventListener("mousemove", handleWindowMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
    };
  }, []);

  useEffect(() => {
    const items = localStorage.getItem("elements");
    if (!items) {
      setElements(defaultElement);
      return;
    }
    const parsedItems = JSON.parse(items);
    if (parsedItems.length === 0) {
      setElements(defaultElement);
      return;
    }
    setElements(parsedItems);
  }, []);

  useEffect(() => {
    if (elements.length === 0) return;
    localStorage.setItem("elements", JSON.stringify(elements));
  }, [elements]);

  const handleDragStart = (event: any) => {
    const { active } = event;
    if (active.data.current.type === "element") {
      setActiveElement(event.active.data.current.element);
    } else if (active.data.current.type === "placed-element") {
      setActivePlacedElement(event.active.data.current.element);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (
      active.data.current.type === "placed-element" &&
      over &&
      over.data.current.type === "sidebar"
    ) {
      const element = active.data.current.element;
      const newPlacedElements = placedElements.filter(
        (v) => v.id !== element.id
      );
      setPlacedElements(newPlacedElements);
    } else if (active.data.current.type === "placed-element") {
      const element = active.data.current.element;
      const newPlacedElements = placedElements.map((v) =>
        v.id === element.id
          ? {
              ...element,
              x: element.x + event.delta.x,
              y: element.y + event.delta.y,
            }
          : v
      );
      setPlacedElements(newPlacedElements);
    }

    if (
      active.data.current.type === "element" &&
      over &&
      over.data.current.type === "playground"
    ) {
      const element = active.data.current.element;
      const placedElement = {
        ...element,
        id: uuid(),
        x: mouseCoords.x,
        y: mouseCoords.y,
      };
      setPlacedElements((prev) => [...prev, placedElement]);
    }

    setActiveElement(null);
    setActivePlacedElement(null);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main className="flex h-screen flex-col">
        <div className="grid grid-cols-12 h-full">
          <PlaygroundArea
            setElements={setElements}
            setPlacedElements={setPlacedElements}
            placedElements={placedElements}
          />
          <SideBar elements={elements} />
        </div>
      </main>
      <DragOverlay dropAnimation={null}>
        {activeElement && <ElementCard element={activeElement} />}
        {activePlacedElement && <ElementCard element={activePlacedElement} />}
      </DragOverlay>
    </DndContext>
  );
}
