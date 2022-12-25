import { EntriesState } from "../App";
import { ScheduleEntry } from "../types";

export const sortEntriesByNextId = (
  normalizedEntries: ScheduleEntry[],
  entries: ScheduleEntry[]
): ScheduleEntry[] => {
  if (!normalizedEntries.length) {
    const firstEntry = entries.find((entry) => entry.prevEntryId === null)!;
    return sortEntriesByNextId([firstEntry], entries);
  }

  const lastEntry = normalizedEntries[normalizedEntries.length - 1];
  const nextEntry = entries.find(
    (entry) => entry.id === lastEntry.nextEntryId
  )!;
  const updatedNormalizedEntries = [...normalizedEntries, nextEntry];

  if (nextEntry.nextEntryId === null) return updatedNormalizedEntries;

  return sortEntriesByNextId(updatedNormalizedEntries, entries);
};

export const sortEntriesByCompleteness = (entriesToSort: EntriesState) =>
  Object.entries(entriesToSort).reduce(
    (dividedEntries, entry) => {
      const [date, entryData] = entry;
      const scheduledEntries = entryData.filter((entry) => !entry.serviced);
      const completeEntries = entryData.filter((entry) => entry.serviced);
      return {
        ...dividedEntries,
        scheduled: {
          ...dividedEntries.scheduled,
          [date]: scheduledEntries,
        },
        complete: {
          ...dividedEntries.complete,
          [date]: completeEntries,
        },
      };
    },
    { scheduled: {}, complete: {} }
  );
