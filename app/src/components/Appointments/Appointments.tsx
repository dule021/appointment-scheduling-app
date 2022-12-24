import { ScheduleEntry } from "../../App";
import "./appointments.css";

type AppontmentsProps = {
  scheduledEntries: ScheduleEntry[];
};

export const Appointments = ({ scheduledEntries }: AppontmentsProps) => {
  return (
    <div className="appointments-section">
      <h2>Appointments</h2>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {scheduledEntries.map((entry) => (
          <div className="appointment-card">
            <p>Owner : {entry.owner}</p>
            <p>Puppy name : {entry.puppyName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
