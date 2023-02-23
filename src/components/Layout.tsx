import { Box, Container, Paper } from "@mui/material"
import { FC } from "react"
import { MyAppBar } from "./MyAppBar"
interface LayoutProps {
  children: JSX.Element
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <Box flexDirection={"column"} display="flex" minHeight="100vh">
      <Paper>
        <MyAppBar />
        <Container
          sx={{
            paddingX: 4,
            paddingY: 4,
            marginLeft: "auto",
            marginRight: "auto",
            flex: 1,
            flexDirection: "column",
            flexGrow: 1,
            width: "100%",
          }}
          maxWidth="xl"
        >
          {children}
        </Container>
      </Paper>
    </Box>
  )
}
