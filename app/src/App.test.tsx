import React from "react";
import { fireEvent, getByText, render, screen } from "@testing-library/react";
import App from "./App";

test("renders main header", () => {
  render(<App />);
  const mainHeaderElement = screen.getByText(/puppy spa/i);
  expect(mainHeaderElement).toBeInTheDocument();
});

test("renders scheduler section", () => {
  render(<App />);
  const schedulerSectionElement = screen.getByText("Scheduler");
  expect(schedulerSectionElement).toBeInTheDocument();
});

test("renders appointments section", () => {
  render(<App />);
  const appointmentsSectionElement = screen.getByText("Appointments");
  expect(appointmentsSectionElement).toBeInTheDocument();
});

test("successfully submit scheduled appointment", () => {
  render(<App />);
  const ownerInput = screen.getByPlaceholderText("Owner");
  const dateInput = screen.getByPlaceholderText("Arrival date and time");
  const submitButton = screen.getByTestId("scheduler__submit-button");

  fireEvent.change(dateInput, { target: { value: "2022-12-26T16:55" } });
  fireEvent.change(ownerInput, { target: { value: "Dusan" } });
  fireEvent.click(submitButton);

  const appointmentCard = screen.getByTestId("appointment-card");
  // eslint-disable-next-line testing-library/prefer-screen-queries
  const timeOnAppointmentCard = getByText(appointmentCard, "16:55");

  expect(timeOnAppointmentCard).toBeInTheDocument();
});
