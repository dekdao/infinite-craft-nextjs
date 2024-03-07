import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Element, PlacedElement } from "../interfaces/element";
import { Loader } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";

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
  isLoading,
}: {
  element: Element;
  isLoading: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: element.text,
    data: {
      element,
      type: "element",
    },
    disabled: isLoading,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-fit h-fit"
      {...listeners}
      {...attributes}
    >
      <ElementCard element={element} />
    </div>
  );
};

export const ElementCardDraggableWrapper = ({
  element,
  isLoading,
}: {
  element: PlacedElement;
  isLoading: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: element.id,
    data: {
      element,
      type: "placed-element",
    },
    disabled: isLoading,
  });

  const { isOver, setNodeRef: setNodeRef2 } = useDroppable({
    id: element.id,
    data: {
      element,
      type: "placed-element",
    },
    disabled: isLoading,
  });

  const style = useMemo(
    () => ({
      transform: CSS.Translate.toString(transform),
      top: element.y,
      left: element.x,
      border: isOver ? "2px solid green" : "none",
    }),
    [element.x, element.y, isOver, transform]
  );

  return (
    <div
      ref={setNodeRef}
      className="absolute w-fit h-fit"
      style={style}
      {...listeners}
      {...attributes}
    >
      <div ref={setNodeRef2}>
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
    </div>
  );
};
