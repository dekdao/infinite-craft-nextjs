export interface Element {
  text: string;
  emoji: string;
  discovered: boolean;
}

export interface PlacedElement extends Element {
  x: number;
  y: number;
}
