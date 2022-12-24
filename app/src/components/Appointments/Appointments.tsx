import { TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { EntriesState, ScheduleEntry } from "../../App";
import { AppointmentCard } from "./AppointmentCard/AppointmentCard";
import dayjs from "dayjs";

import "./appointments.css";

type AppontmentsProps = {
  scheduledEntries: EntriesState;
  setScheduledEntries: React.Dispatch<React.SetStateAction<EntriesState>>;
  removeEntryForDate: (date: string) => (id: string) => void;
};

export const remapEntries = (list: ScheduleEntry[]) =>
  list.map((entry, index) => {
    if (index === 0) {
      return {
        ...entry,
        prevEntryId: null,
        nextEntryId: list[index + 1] ? list[index + 1].id : null,
      };
    }

    if (index === list.length - 1) {
      return {
        ...entry,
        prevEntryId: list[index - 1].id,
        nextEntryId: null,
      };
    }

    return {
      ...entry,
      prevEntryId: list[index - 1].id,
      nextEntryId: list[index + 1].id,
    };
  });

const reorderEntries = (
  list: ScheduleEntry[],
  initialIndex: number,
  updatedIndex: number
) => {
  const result = Array.from(list);
  const [movedEntry] = result.splice(initialIndex, 1);

  const updatedEntry = {
    ...movedEntry,
    arrival: "Custom",
  };

  result.splice(updatedIndex, 0, updatedEntry);

  return result;
};

export const insertEntry = (
  list: ScheduleEntry[],
  insertIndex: number,
  newEntry: ScheduleEntry
) => {
  const result = Array.from(list);
  result.splice(insertIndex, 0, newEntry);

  return result;
};

export const todaysDate = dayjs().format("YYYY-MM-DD");

export const Appointments = ({
  scheduledEntries,
  setScheduledEntries,
  removeEntryForDate,
}: AppontmentsProps) => {
  const [currentDate, setCurrentDate] = useState<string>(todaysDate);

  const updateEntries = (entryList: ScheduleEntry[]) => {
    setScheduledEntries((entries: EntriesState) => ({
      ...entries,
      [currentDate]: entryList,
    }));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const updatedEntryIndex = result.destination.index;
    const previousEntryIndex = result.source.index;

    if (updatedEntryIndex === previousEntryIndex) {
      return;
    }

    const updatedEntries = reorderEntries(
      scheduledEntries[currentDate] || [],
      previousEntryIndex,
      updatedEntryIndex
    );

    const remapedEntries = remapEntries(updatedEntries);

    updateEntries(remapedEntries);
  };

  const onRemoveEntry = useMemo(
    () => removeEntryForDate(currentDate),
    [removeEntryForDate, currentDate]
  );

  return (
    <div className="appointments-section">
      <h2 className="appointments-section__title">Appointments</h2>
      <TextField
        id="currentDate"
        label="Current date"
        type="date"
        value={currentDate}
        onChange={(e) => setCurrentDate(e.target.value)}
        className="appointments__date-picker"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list">
          {(provided) => (
            <div
              className="appointments-list"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {scheduledEntries[currentDate] &&
              scheduledEntries[currentDate].length ? (
                scheduledEntries[currentDate].map((entry, index) => (
                  <AppointmentCard
                    appointment={entry}
                    onRemoveEntry={onRemoveEntry}
                    index={index}
                    key={entry.id}
                  />
                ))
              ) : (
                <div>No appointments for the selected date.</div>
              )}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
