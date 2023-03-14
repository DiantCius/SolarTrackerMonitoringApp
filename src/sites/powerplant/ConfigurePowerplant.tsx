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
  pass: Yup.string().required("pass of network is required"),
})

export const ConfigurePowerplant = () => {
  const [bleConnected, setBleConnected] = useState<boolean>(false)
  const [wifiConnection, setWifiConnection] =
    useState<String>("WIFI_DISCONNECTED")

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
      // filters: [
      //   {
      //     name: "SOLAR TRACKER DRIVER",
      //     services: ["4fafc201-1fb5-459e-8fcc-c5c9c331914b"],

      //   },
      // ],
      optionalServices: ["4fafc201-1fb5-459e-8fcc-c5c9c331914b"],
      acceptAllDevices: true,
    })
    console.log("requested device")
    server = await device.gatt.connect()

    setBleConnected(true)
    console.log("connection status:", bleConnected)

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
    console.log("thing:", thing)
    console.log("characteristic", characteristic)
    await characteristic.writeValue(encoder.encode(JSON.stringify(thing)))

    var response = await characteristic.readValue()
    var decoder = new TextDecoder("utf-8")
    var wifiConnection = decoder.decode(response)
    console.log("Wifi connection:", wifiConnection)
    setWifiConnection(wifiConnection)
  }

  const onSubmit = (props: ConfigurePowerplantFormProps) => {
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
            Connection status: {bleConnected ? "connected" : "disconnected"}
          </Typography>
          {bleConnected ? (
            <>
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
                type="password"
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
                onClick={handleSubmit(onSubmit)}
              >
                CONFIGURE DRIVER
              </Button>
            </>
          ) : (
            <div></div>
          )}
        </Box>
      </Container>
    </Layout>
  )
}
