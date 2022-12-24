import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders welcome header", () => {
  render(<App />);
  const mainHeaderElement = screen.getByText(/puppy spa/i);
  expect(mainHeaderElement).toBeInTheDocument();
});
