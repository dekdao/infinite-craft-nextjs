"use client";
import { useEffect, useMemo, useState } from "react";
import { SideBar } from "../components/side-bar";
import { Element, PlacedElement } from "@/interfaces/element";
import { defaultElement } from "../constants/default-element";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { PlaygroundArea } from "@/components/playground-area";
import { v4 as uuid } from "uuid";
import { ElementCard } from "@/components/element-card";
import axios from "axios";

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

  const handleCombineElements = (
    e1: PlacedElement,
    e2: PlacedElement | Element
  ) => {
    if ("id" in e2) {
      setPlacedElements((prev) =>
        prev
          .filter((v) => v.id !== e2.id)
          .map((v) =>
            v.id === e1.id
              ? {
                  ...v,
                  isLoading: true,
                }
              : v
          )
      );
    } else {
      setPlacedElements((prev) =>
        prev.map((v) =>
          v.id === e1.id
            ? {
                ...v,
                isLoading: true,
              }
            : v
        )
      );
    }

    axios
      .get("/api/combine", {
        params: {
          word1: e1.text,
          word2: e2.text,
        },
      })
      .then(({ data }) => {
        setPlacedElements((prev) =>
          prev.map((v) =>
            v.id === e1.id
              ? {
                  ...data.element,
                  id: uuid(),
                  x: v.x,
                  y: v.y,
                  isLoading: false,
                }
              : v
          )
        );
        if (elements.every((element) => element.text !== data.element.text)) {
          setElements((prev) => [...prev, data.element]);
        }
      })
      .catch((e) => {
        window.alert(
          "Something when wrong! Failed to combine elements" + e.toString()
        );
        setPlacedElements((prev) =>
          prev.map((v) =>
            v.id === e1.id
              ? {
                  ...v,
                  isLoading: false,
                }
              : v
          )
        );
      });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    console.log("active", active);
    console.log("over", over);

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
    } else if (
      active.data.current.type === "placed-element" &&
      over &&
      over.data.current.type === "placed-element"
    ) {
      handleCombineElements(
        over.data.current.element,
        active.data.current.element
      );
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
    } else if (
      active.data.current.type === "element" &&
      over &&
      over.data.current.type === "placed-element"
    ) {
      handleCombineElements(
        over.data.current.element,
        active.data.current.element
      );
    }

    setActiveElement(null);
    setActivePlacedElement(null);
  };

  const isLoading = useMemo(() => {
    return placedElements.some((v) => v.isLoading);
  }, [placedElements]);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main className="flex h-screen flex-col">
        <div className="grid grid-cols-12 h-full">
          <PlaygroundArea
            setElements={setElements}
            setPlacedElements={setPlacedElements}
            placedElements={placedElements}
            isLoading={isLoading}
          />
          <SideBar elements={elements} isLoading={isLoading} />
        </div>
      </main>
      <DragOverlay dropAnimation={null}>
        {activeElement && <ElementCard element={activeElement} />}
        {activePlacedElement && <ElementCard element={activePlacedElement} />}
      </DragOverlay>
    </DndContext>
  );
}
