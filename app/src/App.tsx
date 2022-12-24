import React, { useState } from "react";
import "./App.css";
import { Header } from "./components/Header/Header";
import { Scheduler, SchedulerFormData } from "./components/Scheduler/Scheduler";
import { v4 as uuid } from "uuid";
import { Appointments } from "./components/Appointments/Appointments";

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

const App = () => {
  const [scheduledEntries, setScheduledEntries] = useState<ScheduleEntry[]>([]);

  const addEntry = (entryData: SchedulerFormData) => {
    setScheduledEntries((currentEntries) => [
      ...currentEntries,
      {
        ...entryData,
        id: uuid(),
        serviced: false,
        prevEntryId: null,
        nextEntryId: null,
      },
    ]);
  };

  return (
    <div className="app">
      <div className="app-wrapper">
        <Header />
        <main className="content">
          <Appointments scheduledEntries={scheduledEntries} />
          <Scheduler addEntry={addEntry} />
        </main>
      </div>
    </div>
  );
};

export default App;
