import { ScheduleEntry } from "../../types";

export const searchEntries = (entries: ScheduleEntry[], searchValue: string) =>
  entries.filter(
    (entry) =>
      entry.owner.toLowerCase().includes(searchValue) ||
      entry.puppyName.toLowerCase().includes(searchValue)
  );
