export interface Interaction {
  id: string;
  userId: string;
  page: string;
}

export type View = Interaction;

export interface Click extends Interaction {
  element: string;
}

export interface Scroll extends Interaction {
  depth: number;
}
