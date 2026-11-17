import type { TSignalEvent } from '@linkedapi/node';

import type { TSignalEventsPage } from '../types/signal-events-page.type.js';

// About 10k tokens of the pretty JSON the server returns, so one page fits a model's context.
const PAGE_CHARACTER_BUDGET = 40_000 as const;

// The poll lists events newest first, its `since` is exclusive, and one check stamps all of its
// events with the same detectedAt. A page therefore takes whole checks, oldest first: calling again
// with the newest detectedAt of the page continues with no gap and no repeat. A check larger than the
// budget still goes out whole, since splitting it would lose the rest of it.
export function pageSignalEvents({
  since,
  events,
}: {
  since: string;
  events: ReadonlyArray<TSignalEvent>;
}): TSignalEventsPage {
  const checks = groupChecksOldestFirst(events);
  const page: Array<TSignalEvent> = [];
  let pageSize = 0;
  let takenChecks = 0;

  for (const check of checks) {
    const checkSize = check.reduce(
      (size, event): number => size + JSON.stringify(event, null, 2).length,
      0,
    );
    if (takenChecks > 0 && pageSize + checkSize > PAGE_CHARACTER_BUDGET) {
      break;
    }

    page.push(...check);
    pageSize += checkSize;
    takenChecks += 1;
  }

  const newestFirst = page.reverse();

  return {
    since,
    events: newestFirst,
    hasMore: takenChecks < checks.length,
    nextSince: newestFirst[0]?.detectedAt ?? since,
  };
}

function groupChecksOldestFirst(events: ReadonlyArray<TSignalEvent>): Array<Array<TSignalEvent>> {
  const checks: Array<Array<TSignalEvent>> = [];

  for (const event of [...events].reverse()) {
    const check = checks.at(-1);
    if (check?.[0]?.detectedAt === event.detectedAt) {
      check.push(event);
    } else {
      checks.push([event]);
    }
  }

  return checks;
}
