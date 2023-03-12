import { Box, Button, Container, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { Layout } from "../../components/Layout"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

let characteristic: any, device: any, service: any, server: any

type ConfigurePowerplantFormProps = {
  ssid: string
  pass: string
}

const configurePowerplantValidationSchema = Yup.object().shape({
  ssid: Yup.string().required("ssid of network is requried"),
  serialNumber: Yup.string().required("pass of network is required"),
})

export const ConfigurePowerplant = () => {
  const [connected, setConnected] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfigurePowerplantFormProps>({
    resolver: yupResolver(configurePowerplantValidationSchema),
    reValidateMode: "onChange",
  })

  const connectToDevice = async () => {
    device = await navigator.bluetooth.requestDevice({
      filters: [
        {
          services: ["4fafc201-1fb5-459e-8fcc-c5c9c331914b"],
        },
      ],
    })
    console.log("requested device")
    server = await device.gatt.connect()

    setConnected(true)
    console.log("connection status:", connected)

    service = await server.getPrimaryService(
      "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
    )
    console.log("got service")
    characteristic = await service.getCharacteristic(
      "beb5483e-36e1-4688-b7f5-ea07361b26a8"
    )
    console.log("got char")

    var thing = await characteristic.readValue()
    var decoder = new TextDecoder("utf-8")
    console.log(decoder.decode(thing))

    console.log("read char")

    // TODO : send something to the ESP
    var encoder = new TextEncoder()
    characteristic.writeValue(encoder.encode("gday")) // see if we can get this
  }

  const configureDriver = async (props: ConfigurePowerplantFormProps) => {
    console.log("connect wifi...")
    var encoder = new TextEncoder()
    var thing = {
      ssid: props.ssid,
      pass: props.pass,
    }
    await characteristic.writeValue(encoder.encode(JSON.stringify(thing)))
  }

  const onConfigureClick = (props: ConfigurePowerplantFormProps) => {
    console.log("configure props:", props)
    configureDriver(props)
  }

  return (
    <Layout>
      <Container maxWidth="xs">
        <Box
          flexDirection={"column"}
          display="flex"
          marginTop={10}
          alignItems="center"
          minHeight="100vh"
        >
          <Typography component="h1" variant="h5">
            Configure powerplant
          </Typography>
          <Button
            sx={{ mt: 2, width: "100%" }}
            color="primary"
            variant="contained"
            onClick={connectToDevice}
          >
            CONNECT TO BLUETOOTH DEVICE
          </Button>
          <Typography component="h1" variant="h5">
            Connection status: {connected ? "connected" : "disconnected"}
          </Typography>
          <TextField
            required
            sx={{ mt: 2, width: "100%" }}
            id="ssid"
            label="ssid"
            type="text"
            {...register("ssid")}
            error={errors.ssid ? true : false}
          />
          <Typography variant="inherit" color="error">
            {errors.ssid?.message}
          </Typography>
          <TextField
            required
            sx={{ mt: 2, width: "100%" }}
            id="pass"
            label="pass"
            type="pass"
            {...register("pass")}
            error={errors.pass ? true : false}
          />
          <Typography variant="inherit" color="error">
            {errors.pass?.message}
          </Typography>
          <Button
            sx={{ mt: 2, width: "100%" }}
            color="primary"
            variant="contained"
            onClick={handleSubmit(onConfigureClick)}
          >
            CONFIGURE DRIVER
          </Button>
        </Box>
      </Container>
    </Layout>
  )
}
