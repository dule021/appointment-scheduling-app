import {
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Button,
} from "@mui/material";
import { Service } from "../../App";

import "./scheduler.css";

const serviceTypes: Service[] = [
  "Grooming",
  "Full Body Shave",
  "Exotic Hairdo",
  "Nail Clipping",
];

export type SchedulerFormData = {
  arrival: string;
  owner: string;
  puppyName: string;
  requestedService: Service;
};

type SchedulerProps = {
  addEntry: (formData: SchedulerFormData) => void;
};

export const Scheduler = ({ addEntry }: SchedulerProps) => {
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formValues = Object.fromEntries(formData) as SchedulerFormData;
    console.log(formValues);
    addEntry(formValues);
  };

  return (
    <div className="scheduler-section">
      <h2>Scheduler</h2>
      <form
        id="scheduler-form"
        className="scheduler-form"
        onSubmit={handleSubmit}
        action=""
      >
        <TextField
          id="arrival"
          name="arrival"
          label="Arrival date and time"
          type="datetime-local"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControl>
          <TextField
            id="owner"
            name="owner"
            required
            variant="outlined"
            label="Owner"
          />
        </FormControl>
        <TextField
          id="puppyName"
          name="puppyName"
          variant="outlined"
          label="Puppy name"
        />
        <FormControl>
          <InputLabel id="service-label">Service Type</InputLabel>
          <Select
            labelId="service-label"
            id="requestedService"
            name="requestedService"
            label="Service Type"
            defaultValue=""
          >
            {serviceTypes.map((service) => (
              <MenuItem value={service} key={service}>
                {service}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className="scheduler-form__buttons-container">
          <Button type="reset" variant="text">
            Clear
          </Button>
          <Button type="submit" form="scheduler-form" variant="contained">
            Schedule Appointment
          </Button>
        </div>
      </form>
    </div>
  );
};
