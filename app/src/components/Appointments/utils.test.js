import { incomingScheduledEntries } from "../../mocks/scheduledEntries";
import { searchEntries } from "./utils";

const mockEntries = incomingScheduledEntries.entries;

describe("searchEntries", () => {
  it("returns a result based on owner search", () => {
    const searchResults = searchEntries(mockEntries, "Bill");
    expect(searchResults[0].owner).toBe("Bill Thornberry");
  });

  it("returns a result based on puppy search", () => {
    const searchResults = searchEntries(mockEntries, "fluffy");
    expect(searchResults[0].owner).toBe("Jill Doe");
  });

  it("does not return a result", () => {
    const searchResults = searchEntries(mockEntries, "Dusan");
    expect(searchResults).toHaveLength(0);
  });

  it("returns 2 results", () => {
    const searchResults = searchEntries(mockEntries, "ill");
    expect(searchResults).toHaveLength(2);
  });
});
