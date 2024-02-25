"use client";
import { useEffect, useState } from "react";
import { SideBar } from "../components/side-bar";
import { Element, PlacedElement } from "@/interfaces/element";
import { defaultElement } from "../constants/default-element";
import { ElementCardDraggableWrapper } from "../components/element-card";
import { useDrop } from "react-dnd";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { Trash } from "lucide-react";

export default function Home() {
  const [elements, setElements] = useState<Element[]>([]);
  const [placedElements, setPlacedElements] = useState<PlacedElement[]>([]);

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

  const onClearPlacedElements = () => {
    setPlacedElements([]);
  };

  const onChangePosition = async (
    placedElement: PlacedElement,
    x: number,
    y: number
  ) => {
    const width = `${placedElement.emoji} ${placedElement.text}`.length * 10;
    const rect1 = {
      x: x,
      y: y,
      width: width,
      height: 30,
    };
    const overlappingElement = placedElements.find((element) => {
      const width2 = `${element.emoji} ${element.text}`.length * 10;
      const rect2 = {
        x: element.x,
        y: element.y,
        width: width2,
        height: 30,
      };
      return (
        placedElement.id !== element.id &&
        !(
          rect2.x > rect1.x + rect1.width ||
          rect2.x + rect2.width < rect1.x ||
          rect2.y > rect1.y + rect1.height ||
          rect2.y + rect2.height < rect1.y
        )
      );
    });
    if (overlappingElement) {
      setPlacedElements((prev) =>
        prev
          .filter((v) => v.id !== placedElement.id)
          .map((v) => {
            if (v.id === overlappingElement.id) {
              return {
                ...v,
                isLoading: true,
              };
            }
            return v;
          })
      );
      axios
        .get("/api/combine", {
          params: {
            word1: placedElement.text,
            word2: overlappingElement.text,
          },
        })
        .then(({ data }) => {
          const newElement = {
            ...data.element,
            x: placedElement.x,
            y: placedElement.y,
          };
          const newPlacedElements = placedElements.filter(
            (v) => v.id !== placedElement.id && v.id !== overlappingElement.id
          );
          setPlacedElements([...newPlacedElements, newElement]);
          if (elements.every((element) => element.text !== data.element.text)) {
            setElements((prev) => [...prev, data.element]);
          }
        });
    } else {
      const index = placedElements.findIndex(
        (element) => element.id === placedElement.id
      );
      if (index === -1) return;
      const newPlacedElements = [...placedElements];
      newPlacedElements[index] = {
        ...placedElement,
        x: x,
        y: y,
      };
    }
  };

  const [, drop] = useDrop(() => ({
    accept: "sidebar-element",
    drop: (element: Element, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (element && clientOffset) {
        const width = `${element.emoji} ${element.text}`.length * 10;
        const placedElement = {
          ...element,
          id: uuid(),
          x: clientOffset.x - width / 2,
          y: clientOffset.y - 15,
        };
        setPlacedElements((prev) => [...prev, placedElement]);
        onChangePosition(placedElement, clientOffset.x, clientOffset.y);
      }
    },
  }));

  return (
    <main className="flex h-screen flex-col">
      <div className="grid grid-cols-12 h-full">
        <div ref={drop} className="col-span-9 h-full w-full relative">
          {placedElements.map((element, index) => (
            <ElementCardDraggableWrapper
              key={index}
              element={element}
              index={index}
              onChangePosition={onChangePosition}
            />
          ))}
          <div
            className="absolute top-0 left-0 p-4 cursor-pointer hover:text-red-400"
            onClick={onClearPlacedElements}
          >
            <Trash />
          </div>
        </div>
        <SideBar elements={elements} />
      </div>
    </main>
  );
}
