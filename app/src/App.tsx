import React, { useState } from "react";
import "./App.css";
import { Header } from "./components/Header/Header";
import { Scheduler, SchedulerFormData } from "./components/Scheduler/Scheduler";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import {
  Appointments,
  insertEntry,
  remapEntries,
  todaysDate,
} from "./components/Appointments/Appointments";

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

export type EntriesState = Record<string, ScheduleEntry[]>;

const initialEntries = { [todaysDate]: [] };

const App = () => {
  const [scheduledEntries, setScheduledEntries] =
    useState<EntriesState>(initialEntries);

  console.log(scheduledEntries);

  const addEntry = (entryData: SchedulerFormData) => {
    const entryDate = entryData.arrival.slice(
      0,
      entryData.arrival.indexOf("T")
    );

    const placeNewEntryByScheduledTime = (existingEntries: ScheduleEntry[]) => {
      if (!existingEntries || !existingEntries.length) {
        return [
          {
            ...entryData,
            id: uuid(),
            serviced: false,
            prevEntryId: null,
            nextEntryId: null,
          },
        ];
      }

      const newEntryTime = dayjs(entryData.arrival).unix();
      const indexOfSmallerEntry = existingEntries.findIndex((entryItem) =>
        entryItem.arrival === "custom"
          ? false
          : newEntryTime > dayjs(entryItem.arrival).unix()
      );
      console.log(indexOfSmallerEntry, "index of smaller entry");
      if (indexOfSmallerEntry === -1) {
        return [
          ...existingEntries,
          {
            ...entryData,
            id: uuid(),
            serviced: false,
            prevEntryId: null,
            nextEntryId: null,
          },
        ];
      }

      return insertEntry(existingEntries, indexOfSmallerEntry, {
        ...entryData,
        id: uuid(),
        serviced: false,
        prevEntryId: null,
        nextEntryId: null,
      });
    };

    console.log(entryDate);

    setScheduledEntries((currentEntries) => {
      const updatedEntries = placeNewEntryByScheduledTime(
        currentEntries[entryDate]
      );
      return {
        ...currentEntries,
        [entryDate]: remapEntries(updatedEntries),
      };
    });
  };

  const removeEntryForDate = (date: string) => (entryId: string) => {
    setScheduledEntries((currentEntries) => ({
      ...currentEntries,
      [date]: remapEntries(
        currentEntries[date].filter((entry) => entry.id !== entryId)
      ),
    }));
  };

  return (
    <div className="app">
      <div className="app-wrapper">
        <Header />
        <main className="content">
          <Appointments
            scheduledEntries={scheduledEntries}
            setScheduledEntries={setScheduledEntries}
            removeEntryForDate={removeEntryForDate}
          />
          <Scheduler addEntry={addEntry} />
        </main>
      </div>
    </div>
  );
};

export default App;
