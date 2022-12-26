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
  isFirst?: boolean;
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
  isFirst,
}: AppointmentCardProps) => {
  const { owner, puppyName, requestedService, arrival } = appointment;

  const image = useMemo(() => getRandomImage(), []);

  return (
    <div
      className={`appointment-card ${
        appointment.serviced ? "appointment-card--complete" : ""
      } ${Boolean(isFirst) ? "appointment-card--first" : ""}`}
      data-testid="appointment-card"
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
      {onRemoveEntry && (
        <div className="appointment-card__delete-button">
          <IconButton
            color="warning"
            onClick={() => onRemoveEntry(appointment.id)}
          >
            <X weight="fill" size={24} />
          </IconButton>
        </div>
      )}
      <div className="appointment-card__complete-button">
        {appointment.serviced ? (
          <>
            <CheckCircle weight="fill" size={16} />
            <span className="appointment-card__complete-text">Complete</span>
          </>
        ) : (
          <IconButton
            color="primary"
            onClick={() => onMarkAsComplete(appointment.id)}
          >
            <CheckCircle weight="fill" size={24} />
          </IconButton>
        )}
      </div>
    </div>
  );
};
