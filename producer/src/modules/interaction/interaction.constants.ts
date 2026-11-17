export const INTERACTION_VIEW_MESSAGE = 'interaction.view';

export const INTERACTION_CLICK_MESSAGE = 'interaction.click';

export const INTERACTION_SCROLL_MESSAGE = 'interaction.scroll';

export const INTERACTION_PARTITIONS = {
  view: 0,
  click: 1,
  scroll: 2,
} as const;

export const MIN_SCROLL_DEPTH = 0;

export const MAX_SCROLL_DEPTH = 100;
