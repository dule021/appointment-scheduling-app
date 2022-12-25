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

  const [completedEntries, setCompletedEntries] =
    useState<EntriesState>(initialEntries);

  const placeNewEntryByScheduledTime = (
    existingEntries: ScheduleEntry[],
    entryData: SchedulerFormData | ScheduleEntry,
    markAsComplete?: boolean
  ) => {
    if (!existingEntries || !existingEntries.length) {
      return [
        {
          ...entryData,
          id: uuid(),
          serviced: Boolean(markAsComplete),
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

    if (indexOfSmallerEntry === -1) {
      return [
        ...existingEntries,
        {
          ...entryData,
          id: uuid(),
          serviced: Boolean(markAsComplete),
          prevEntryId: null,
          nextEntryId: null,
        },
      ];
    }

    return insertEntry(existingEntries, indexOfSmallerEntry, {
      ...entryData,
      id: uuid(),
      serviced: Boolean(markAsComplete),
      prevEntryId: null,
      nextEntryId: null,
    });
  };

  const addNewScheduledEntry = (entryData: SchedulerFormData) => {
    const entryDate = entryData.arrival.slice(
      0,
      entryData.arrival.indexOf("T")
    );

    setScheduledEntries((currentEntries) => {
      const updatedEntries = placeNewEntryByScheduledTime(
        currentEntries[entryDate],
        entryData
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

  const markEntryAsCompleteForDate = (date: string) => (entryId: string) => {
    const completedEntry = scheduledEntries[date].find(
      (entry) => entry.id === entryId
    )!;

    setScheduledEntries((currentEntries) => ({
      ...currentEntries,
      [date]: remapEntries(
        currentEntries[date].filter((entry) => entry.id !== entryId)
      ),
    }));

    setCompletedEntries((currentEntries) => {
      const updatedEntries = placeNewEntryByScheduledTime(
        currentEntries[date],
        completedEntry,
        true
      );

      return {
        ...currentEntries,
        [date]: remapEntries(updatedEntries),
      };
    });
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
            completedEntries={completedEntries}
            markEntryAsCompleteForDate={markEntryAsCompleteForDate}
          />
          <Scheduler addEntry={addNewScheduledEntry} />
        </main>
      </div>
    </div>
  );
};

export default App;
