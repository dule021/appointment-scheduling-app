export type Service =
  | "Grooming"
  | "Full Body Shave"
  | "Exotic Hairdo"
  | "Nail Clipping";

export type ScheduleEntry = {
  id: string;
  arrival: string;
  owner: string;
  puppyName: string;
  requestedService: Service;
  serviced: boolean;
  prevEntryId: string | null;
  nextEntryId: string | null;
};
