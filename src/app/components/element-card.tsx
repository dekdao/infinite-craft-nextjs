import Draggable from "react-draggable";
import { Element, PlacedElement } from "../interfaces/element";

export const ElementCard = ({ element }: { element: Element }) => {
  return (
    <div className="flex gap-2 px-2 border rounded-xl h-fit w-fit">
      <div>{element.emoji}</div>
      <div>{element.text}</div>
    </div>
  );
};

export const ElementCardSideBarWrapper = ({
  element,
}: {
  element: Element;
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("element-text", element.text);
      }}
    >
      <ElementCard element={element} />
    </div>
  );
};

export const ElementCardDraggableWrapper = ({
  element,
  index,
}: {
  element: PlacedElement;
  index: number;
}) => {
  return (
    <Draggable
      defaultPosition={{
        x: element.x,
        y: element.y,
      }}
      bounds="parent"
    >
      <div className="absolute cursor-grabbing w-fit h-fit">
        <ElementCard element={element} />
      </div>
    </Draggable>
  );
};
