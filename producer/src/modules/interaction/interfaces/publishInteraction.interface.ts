import type { Interaction } from './interaction.interface';

export interface ViewInput {
  userId: string;
  page: string;
}

export interface ClickInput extends ViewInput {
  element: string;
}

export interface ScrollInput extends ViewInput {
  depth: number;
}

export interface PublishInteractionResult {
  interaction: Interaction;
  messageId: string;
  partition: number;
  offset: string;
}
