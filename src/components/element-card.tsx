import Draggable from "react-draggable";
import { Element, PlacedElement } from "../interfaces/element";
import { useDrag } from "react-dnd";

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
  const [, drag] = useDrag(() => ({
    type: "sidebar-element",
    item: element,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className="opacity-1 cursor-grab w-fit h-fit">
      <ElementCard element={element} />
    </div>
  );
};

export const ElementCardDraggableWrapper = ({
  element,
  index,
  onChangePosition,
}: {
  element: PlacedElement;
  index: number;
  onChangePosition: (index: number, x: number, y: number) => void;
}) => {
  return (
    <Draggable
      defaultPosition={{
        x: element.x,
        y: element.y,
      }}
      bounds="parent"
      onStop={(e, data) => {
        onChangePosition(index, data.x, data.y);
      }}
    >
      <div className="absolute cursor-grabbing w-fit h-fit">
        <ElementCard element={element} />
      </div>
    </Draggable>
  );
};
