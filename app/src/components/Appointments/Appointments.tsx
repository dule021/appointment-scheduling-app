import {
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useMemo, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { EntriesState } from "../../App";
import { AppointmentCard } from "./AppointmentCard/AppointmentCard";
import { MagnifyingGlass } from "phosphor-react";
import dayjs from "dayjs";
import { ScheduleEntry } from "../../types";

import "./appointments.css";
import { searchEntries } from "./utils";

type AppontmentsProps = {
  scheduledEntries: EntriesState;
  setScheduledEntries: React.Dispatch<React.SetStateAction<EntriesState>>;
  removeEntryForDate: (date: string) => (id: string) => void;
  completedEntries: EntriesState;
  markEntryAsCompleteForDate: (date: string) => (id: string) => void;
};

type AppointmentState = "scheduled" | "complete";

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
  completedEntries,
  markEntryAsCompleteForDate,
}: AppontmentsProps) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>(todaysDate);
  const [activeAppointments, setActiveAppointments] =
    useState<AppointmentState>("scheduled");

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

  const onMarkAsComplete = useMemo(
    () => markEntryAsCompleteForDate(currentDate),
    [markEntryAsCompleteForDate, currentDate]
  );

  const scheduledAppointments = useMemo(() => {
    if (!scheduledEntries[currentDate] || !scheduledEntries[currentDate].length)
      return;

    return searchValue.length
      ? searchEntries(scheduledEntries[currentDate], searchValue)
      : scheduledEntries[currentDate];
  }, [scheduledEntries, searchValue, currentDate]);

  const completedAppointments = useMemo(() => {
    if (!completedEntries[currentDate] || !completedEntries[currentDate].length)
      return;

    return searchValue.length
      ? searchEntries(completedEntries[currentDate], searchValue)
      : completedEntries[currentDate];
  }, [completedEntries, searchValue, currentDate]);

  return (
    <div className="appointments-section">
      <h2 className="appointments-section__title">Appointments</h2>
      <div className="appointments-section__controls">
        <TextField
          id="currentDate"
          label="Current date"
          type="date"
          value={currentDate}
          onChange={(e) => setCurrentDate(e.target.value)}
          className="appointments__date-picker"
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="search"
          label="Search by owner or puppy name"
          value={searchValue}
          size="small"
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MagnifyingGlass size={16} />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <ToggleButtonGroup
        value={activeAppointments}
        exclusive
        size="small"
        onChange={(e, value) => setActiveAppointments(value)}
      >
        <ToggleButton value="scheduled">Scheduled</ToggleButton>
        <ToggleButton value="complete">Complete</ToggleButton>
      </ToggleButtonGroup>
      {activeAppointments === "complete" ? (
        <div className="appointments-list">
          {completedAppointments ? (
            completedAppointments.map((entry, index) => (
              <AppointmentCard
                appointment={entry}
                onMarkAsComplete={() => {}}
                key={entry.id}
              />
            ))
          ) : (
            <div>No completed appointments for the selected date.</div>
          )}
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="list">
            {(provided) => (
              <div
                className="appointments-list"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {scheduledAppointments ? (
                  scheduledAppointments.map((entry, index) => (
                    <Draggable
                      draggableId={entry.id}
                      index={index}
                      key={entry.id}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <AppointmentCard
                            appointment={entry}
                            onRemoveEntry={onRemoveEntry}
                            onMarkAsComplete={onMarkAsComplete}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <div>No scheduled appointments for the selected date.</div>
                )}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};
