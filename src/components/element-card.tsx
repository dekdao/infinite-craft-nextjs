import Draggable from "react-draggable";
import { Element, PlacedElement } from "../interfaces/element";
import { useDrag } from "react-dnd";
import { Loader } from "lucide-react";

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
  onChangePosition: (
    placedElement: PlacedElement,
    x: number,
    y: number
  ) => void;
}) => {
  return (
    <Draggable
      defaultPosition={{
        x: element.x,
        y: element.y,
      }}
      bounds="parent"
      onStop={(e, data) => {
        onChangePosition(element, data.x, data.y);
      }}
    >
      <div className="absolute cursor-grabbing w-fit h-fit">
        {element.isLoading && (
          <div className="flex gap-2 px-2 border rounded-xl h-fit w-fit">
            <div>
              <Loader className="animate-spin inline-block" />
            </div>
            <div>combining</div>
          </div>
        )}
        {!element.isLoading && <ElementCard element={element} />}
      </div>
    </Draggable>
  );
};
