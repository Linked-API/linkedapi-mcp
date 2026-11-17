import type { TSignalEvent } from '@linkedapi/node';

export interface TSignalEventsPage {
  since: string;
  events: Array<TSignalEvent>;
  hasMore: boolean;
  nextSince: string;
}
