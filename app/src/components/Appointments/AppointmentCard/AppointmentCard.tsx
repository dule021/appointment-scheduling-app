import { useMemo } from "react";
import dayjs from "dayjs";
import { X, CheckCircle } from "phosphor-react";
import { IconButton } from "@mui/material";
import dog1 from "../../../assets/dog1.png";
import dog2 from "../../../assets/dog2.png";
import dog3 from "../../../assets/dog3.png";

import "./appointment-card.css";
import { ScheduleEntry } from "../../../types";

type AppointmentCardProps = {
  appointment: ScheduleEntry;
  onRemoveEntry?: (id: string) => void;
  onMarkAsComplete: (id: string) => void;
};

const images = [dog1, dog2, dog3];
const getRandomImage = () => {
  const randomImage = images[Math.floor(Math.random() * images.length)];
  return randomImage;
};

export const AppointmentCard = ({
  appointment,
  onRemoveEntry,
  onMarkAsComplete,
}: AppointmentCardProps) => {
  const { owner, puppyName, requestedService, arrival } = appointment;

  const image = useMemo(() => getRandomImage(), []);

  return (
    <div
      className={`appointment-card ${
        appointment.serviced ? "appointment-card--complete" : ""
      }`}
    >
      <div className="appointment-card__avatar">
        <img src={image} alt="Dog avatar" />
      </div>
      <div className="appointment-card__data">
        <span>
          <b>
            {!arrival
              ? "No date set"
              : arrival === "Custom"
              ? "Custom slot"
              : dayjs(arrival).format("HH:mm")}
          </b>{" "}
        </span>
        <span>Owner : {owner}</span>
        <span>Puppy name : {puppyName}</span>
        <span>Requested service : {requestedService}</span>
      </div>
      <div className="appointment-card__delete-button">
        {onRemoveEntry && (
          <IconButton onClick={() => onRemoveEntry(appointment.id)}>
            <X weight="fill" size={24} />
          </IconButton>
        )}
        {appointment.serviced ? (
          <div className="appointment-card__complete-mark">
            <CheckCircle weight="fill" size={24} />
            <span>Complete</span>
          </div>
        ) : (
          <IconButton onClick={() => onMarkAsComplete(appointment.id)}>
            <CheckCircle weight="fill" size={24} />
          </IconButton>
        )}
      </div>
    </div>
  );
};
