import { ScheduleEntry } from "../../../App";
import { Draggable } from "react-beautiful-dnd";
import { useMemo } from "react";
import dayjs from "dayjs";
import dog1 from "../../../assets/dog1.png";
import dog2 from "../../../assets/dog2.png";
import dog3 from "../../../assets/dog3.png";

import "./appointment-card.css";
import { X } from "phosphor-react";
import { IconButton } from "@mui/material";

type AppointmentCardProps = {
  appointment: ScheduleEntry;
  index: number;
  onRemoveEntry: (id: string) => void;
};

const images = [dog1, dog2, dog3];
const getRandomImage = () => {
  const randomImage = images[Math.floor(Math.random() * images.length)];
  return randomImage;
};

export const AppointmentCard = ({
  appointment,
  index,
  onRemoveEntry,
}: AppointmentCardProps) => {
  const { owner, puppyName, requestedService, arrival } = appointment;

  const image = useMemo(() => getRandomImage(), []);

  return (
    <Draggable draggableId={appointment.id} index={index}>
      {(provided) => (
        <div
          className="appointment-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="appointment-card__avatar">
            <img src={image} alt="Dog avatar" />
          </div>
          <div className="appointment-card__data">
            <span>Owner : {owner}</span>
            <span>Puppy name : {puppyName}</span>
            <span>Requested service : {requestedService}</span>
            <span>
              Scheduled time :{" "}
              {!arrival
                ? "No date set"
                : arrival === "Custom"
                ? "Custom"
                : dayjs(arrival).format("DD/MM/YYYY HH:mm")}
            </span>
          </div>
          <div className="appointment-card__delete-button">
            <IconButton onClick={() => onRemoveEntry(appointment.id)}>
              <X weight="fill" size={24} />
            </IconButton>
          </div>
        </div>
      )}
    </Draggable>
  );
};
