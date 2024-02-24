import { AlarmClock, ArrowDownAZ, Smile } from "lucide-react";

export enum Sort {
  Time,
  Name,
  Emoji,
}

export const SortButton = ({ sort, onClick }: { sort: Sort, onClick: () => void }) => {
  if (sort === Sort.Time) {
    return (
      <button onClick={onClick} className="flex flex-1 border gap-2 justify-center items-center">
        <AlarmClock /> Sort by Time
      </button>
    );
  } else if (sort === Sort.Name) {
    return (
      <button onClick={onClick} className="flex flex-1 border gap-2 justify-center items-center">
        <ArrowDownAZ /> Sort by Name
      </button>
    );
  } else if (sort === Sort.Emoji) {
    return (
      <button onClick={onClick} className="flex flex-1 border gap-2 justify-center items-center">
        <Smile/> Sort by Emoji
      </button>
    );
  }
};