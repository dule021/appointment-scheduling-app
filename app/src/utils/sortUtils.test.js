import { incomingScheduledEntries } from "../mocks/scheduledEntries";
import { sortEntriesByNextId } from "./sortUtils";

const mockEntries = incomingScheduledEntries.entries;

describe("sortEntriesByNextId", () => {
  it("result first entry prevId is null", () => {
    const sortedEntries = sortEntriesByNextId([], mockEntries);
    expect(sortedEntries[0].prevEntryId).toBe(null);
  });

  it("result last entry nextEntryId is null", () => {
    const sortedEntries = sortEntriesByNextId([], mockEntries);
    expect(sortedEntries[sortedEntries.length - 1].nextEntryId).toBe(null);
  });

  it("returns the same number of entries it gets", () => {
    const sortedEntries = sortEntriesByNextId([], mockEntries);
    expect(sortedEntries.length).toBe(mockEntries.length);
  });
});
