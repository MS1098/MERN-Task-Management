import React, { createContext, useEffect, useState, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: "light",
});

export default function AppThemeProvider({ children }) {
  const [mode, setMode] = useState("light");

  // Load saved theme once
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setMode(saved);
  }, []);

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prev) => {
          const next = prev === "light" ? "dark" : "light";
          localStorage.setItem("theme", next);
          return next;
        });
      },
    }),
    [mode]
  );

  const theme = createTheme({
     palette: {
       mode,
       background: {
         paper: mode === "dark" ? "#1e1e1e" : "#fff",
         default: mode === "dark" ? "#121212" : "#fafafa",
       }
     }
   });
   

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}
