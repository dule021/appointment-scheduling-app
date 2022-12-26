import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
} from "@mui/material/styles";
import { amber, lightBlue } from "@mui/material/colors";

import { ReactNode } from "react";

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: lightBlue[800],
          light: "#58a5f0",
        },
        secondary: {
          main: amber[700],
          light: "#fff3e0",
        },
      },
    },
  },
  typography: {
    fontFamily: "Heebo, Arial",
  },
});

export const Theme = ({ children }: { children: ReactNode }) => (
  <CssVarsProvider theme={theme}>{children}</CssVarsProvider>
);
