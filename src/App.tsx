import "./App.css"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import React from "react"
import { ColorModeContext } from "./contexts/ColorModeContext"
import { AppRouter } from "./navigation/router"
import { BrowserRouter } from "react-router-dom"
import { UserContextProvider } from "./contexts/UserContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"

function App() {
  const [mode, setMode] = React.useState<"light" | "dark">("light")
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"))
      },
    }),
    []
  )

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  )

  const queryClient = new QueryClient()

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <UserContextProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AppRouter />
              </LocalizationProvider>
            </UserContextProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
