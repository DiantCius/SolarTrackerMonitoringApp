import { useTheme } from "@mui/material/styles"
import { Box, Button, IconButton } from "@mui/material"
import React from "react"
import { ColorModeContext } from "../contexts/ColorModeContext"
import { Layout } from "../components/Layout"
import * as signalR from "@microsoft/signalr"
import { GetIndicationResponse } from "../models/api-models"

export const Home = () => {
  const theme = useTheme()
  const colorMode = React.useContext(ColorModeContext)
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://solarsystem.somee.com/Indication?serialNumber=1234", {})
    .configureLogging(signalR.LogLevel.Information)
    .build()

  async function start() {
    try {
      await connection.start().then(() => {
        connection.invoke("JoinGroup", "1234")
      })
      console.log("SignalR Connected.")
    } catch (err) {
      console.log(err)
    }
  }

  async function send() {
    try {
      await connection.invoke("SendMessageToGroup", "1234")
    } catch (err) {
      console.error(err)
    }
  }

  connection.on("ReceiveIndication", (indication: GetIndicationResponse) => {
    console.log("indication", indication)
  })

  return (
    <Layout>
      <Box>
        {theme.palette.mode} Mode
        <Button onClick={start}>signalr start</Button>
        <Button onClick={send}>signalr send</Button>
        <IconButton
          sx={{ ml: 1 }}
          onClick={colorMode.toggleColorMode}
          color="inherit"
        ></IconButton>
      </Box>
    </Layout>
  )
}
