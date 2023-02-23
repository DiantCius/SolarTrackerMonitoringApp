import { useTheme } from "@mui/material/styles"
import { Box, IconButton, Typography } from "@mui/material"
import React from "react"
import { ColorModeContext } from "../contexts/ColorModeContext"
import { Layout } from "../components/Layout"

export const Profile = () => {
  const theme = useTheme()
  const colorMode = React.useContext(ColorModeContext)
  return (
    <Layout>
      <Typography>profile</Typography>
    </Layout>
  )
}
