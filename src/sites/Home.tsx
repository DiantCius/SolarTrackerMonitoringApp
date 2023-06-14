import { useTheme } from "@mui/material/styles"
import { Box, Button, IconButton } from "@mui/material"
import React from "react"
import { ColorModeContext } from "../contexts/ColorModeContext"
import { Layout } from "../components/Layout"

export const Home = () => {
  const theme = useTheme()
  const colorMode = React.useContext(ColorModeContext)

  return (
    <Layout>
      <Box>
        {theme.palette.mode} Mode
        <IconButton
          sx={{ ml: 1 }}
          onClick={colorMode.toggleColorMode}
          color="inherit"
        ></IconButton>
      </Box>
    </Layout>
  )
}
