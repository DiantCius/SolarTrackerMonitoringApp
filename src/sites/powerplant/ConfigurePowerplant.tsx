import { Box, Button, Container, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { Layout } from "../../components/Layout"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Powerplant } from "../../models/api-models"
import axios from "../../api/axios"

const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
const WIFI_CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8"
const CONFIGURE_CHARACTERISTIC_UUID = "5dd6ee12-c309-11ed-afa1-0242ac120002"

let wifiCharacteristic: any,
  configureCharacteristic: any,
  device: any,
  service: any,
  server: any

type ConfigureWifiFormProps = {
  ssid: string
  pass: string
}

type ConfigurePowerplantFormProps = {
  latitude: number
  longitude: number
  elevationStart: number
  azimuthStart: number
  minElevation: number
  maxAzimuth: number
  windSpeedThreshold: number
}

const configurePowerplantValidationSchema = Yup.object().shape({
  latitude: Yup.number().min(-90).max(90).required("Coordinates are required"),
  longitude: Yup.number()
    .min(-180)
    .max(180)
    .required("Coordinates are required"),
  minElevation: Yup.number()
    .min(-80)
    .max(-40)
    .required("Min elevation angle required"),
  elevationStart: Yup.number()
    .min(-80)
    .max(0)
    .required("Elevation starting position required"),
  azimuthStart: Yup.number()
    .min(50)
    .max(300)
    .required("Azimuth starting position required"),
  maxAzimuth: Yup.number()
    .min(200)
    .max(300)
    .required("Max azimuth angle required"),
  windSpeedThreshold: Yup.number()
    .min(15)
    .max(40)
    .required("Wind speed threshold required"),
})

const configureWifiValidationSchema = Yup.object().shape({
  ssid: Yup.string().required("ssid of network is requried"),
  pass: Yup.string().required("pass of network is required"),
})

export const ConfigurePowerplant = () => {
  const [bleConnected, setBleConnected] = useState<boolean>(false)
  const [wifiConnection, setWifiConnection] =
    useState<String>("WIFI_DISCONNECTED")
  const [driverConfigured, setDriverConfigured] = useState<boolean>(false)

  const navigate = useNavigate()

  const { id } = useParams()

  const {
    register: registerWifi,
    handleSubmit: handleSubmitWifi,
    formState: { errors: wifiErrors },
  } = useForm<ConfigureWifiFormProps>({
    resolver: yupResolver(configureWifiValidationSchema),
    reValidateMode: "onChange",
  })

  const {
    register: registerConfig,
    handleSubmit: handleSubmitConfig,
    formState: { errors: configErrors },
  } = useForm<ConfigurePowerplantFormProps>({
    resolver: yupResolver(configurePowerplantValidationSchema),
    reValidateMode: "onChange",
  })

  const { data, refetch } = useQuery<any, any, Powerplant>(
    [`/Powerplant/${id}`],
    async () => {
      const res = await axios.get(`/Powerplant/${id}`)
      return res.data
    },
    {
      onSuccess: async (response) => {},
      onError: (error) => {
        console.log("error getting powerplant: ", error)
      },
      refetchInterval: 5000,
    }
  )

  const connectToDevice = async () => {
    device = await navigator.bluetooth.requestDevice({
      optionalServices: [SERVICE_UUID],
      acceptAllDevices: true,
    })
    console.log("requested device")
    server = await device.gatt.connect()

    setBleConnected(true)
    console.log("connection status:", bleConnected)

    service = await server.getPrimaryService(SERVICE_UUID)
    console.log("got service")
    // wifiCharacteristic = await service.getCharacteristic(
    //   WIFI_CHARACTERISTIC_UUID
    // )
    configureCharacteristic = await service.getCharacteristic(
      CONFIGURE_CHARACTERISTIC_UUID
    )
    console.log("got configure characteristic")
  }

  const configureWifi = async (props: ConfigureWifiFormProps) => {
    console.log("connect wifi...")
    var encoder = new TextEncoder()
    var wifiProps = {
      ssid: props.ssid,
      pass: props.pass,
    }
    console.log("wifi props:", wifiProps)
    console.log("characteristic", wifiCharacteristic)
    await wifiCharacteristic.writeValue(
      encoder.encode(JSON.stringify(wifiProps))
    )

    var response = await wifiCharacteristic.readValue()
    var decoder = new TextDecoder("utf-8")
    var wifiConn = decoder.decode(response)
    console.log("Wifi connection:", wifiConn)
    setWifiConnection(wifiConn)
    // console.log("Getting configure characteristic")
    // if (wifiConn == "WIFI_CONNECTED") {
    //   configureCharacteristic = await service.getCharacteristic(
    //     CONFIGURE_CHARACTERISTIC_UUID
    //   )
    //   console.log("Configure characteristic:", configureCharacteristic)
    // }
  }

  const configureDriver = async (props: ConfigurePowerplantFormProps) => {
    var encoder = new TextEncoder()
    var driverProps = {
      latitude: props.latitude,
      longitude: props.longitude,
      elevationStart: props.elevationStart,
      azimuthStart: props.azimuthStart,
      minElevation: props.minElevation,
      maxAzimuth: props.maxAzimuth,
      windSpeedThreshold: props.windSpeedThreshold,
    }
    console.log("driver props:", driverProps)
    console.log("characteristic", configureCharacteristic)
    await configureCharacteristic.writeValue(
      encoder.encode(JSON.stringify(driverProps))
    )

    var response = await configureCharacteristic.readValue()
    var decoder = new TextDecoder("utf-8")
    var configureStatus = decoder.decode(response)
    console.log("Driver status:", configureStatus)
    if (configureStatus == "DRIVER_CONFIGURED") {
      setDriverConfigured(true)
      wifiCharacteristic = await service.getCharacteristic(
        WIFI_CHARACTERISTIC_UUID
      )
    }
    //device.gatt.disconnect()
  }

  const onWifiSubmit = (props: ConfigureWifiFormProps) => {
    console.log("wifi props:", props)
    configureWifi(props)
  }

  const onConfigSubmit = (props: ConfigurePowerplantFormProps) => {
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
          <Typography>
            Powerplant server connection status:{" "}
            {data?.connectionStatus == 1 ? "connected" : "disconnected"}
          </Typography>
          <Typography component="h1" variant="h5">
            CONFIGURE POWERPLANT
          </Typography>
          <Button
            sx={{ mt: 2, width: "100%" }}
            color="primary"
            variant="contained"
            onClick={connectToDevice}
          >
            CONNECT TO BLUETOOTH DEVICE
          </Button>
          <Typography>
            Bluetooth connection status:{" "}
            {bleConnected ? "connected" : "disconnected"}
          </Typography>
          {bleConnected ? (
            <>
              <Typography component="h1" variant="h5">
                Configure powerplant parameters
              </Typography>
              <Box flexDirection={"row"} display="flex" marginTop={2}>
                <TextField
                  sx={{ mr: 2 }}
                  required
                  id="latitude"
                  label="latitude"
                  type="number"
                  {...registerConfig("latitude")}
                  error={configErrors.latitude ? true : false}
                />
                <TextField
                  required
                  id="longitude"
                  label="longitude"
                  type="number"
                  {...registerConfig("longitude")}
                  error={configErrors.longitude ? true : false}
                />
              </Box>
              <Box flexDirection={"row"} display="flex">
                <Typography variant="inherit" color="error">
                  {configErrors.latitude?.message}
                </Typography>
                <Typography variant="inherit" color="error">
                  {configErrors.longitude?.message}
                </Typography>
              </Box>
              <TextField
                required
                sx={{ mt: 2, width: "100%" }}
                id="minElevation"
                label="minElevation"
                type="number"
                defaultValue={-50}
                inputProps={{
                  step: 1,
                }}
                {...registerConfig("minElevation")}
                error={configErrors.minElevation ? true : false}
              />
              <Typography variant="inherit" color="error">
                {configErrors.minElevation?.message}
              </Typography>
              <TextField
                required
                sx={{ mt: 2, width: "100%" }}
                id="maxAzimuth"
                label="maxAzimuth"
                type="number"
                defaultValue={290}
                inputProps={{
                  step: 10,
                }}
                {...registerConfig("maxAzimuth")}
                error={configErrors.maxAzimuth ? true : false}
              />
              <Typography variant="inherit" color="error">
                {configErrors.maxAzimuth?.message}
              </Typography>
              <TextField
                required
                sx={{ mt: 2, width: "100%" }}
                id="elevationStart"
                label="elevationStart"
                type="number"
                defaultValue={0}
                inputProps={{
                  step: 1,
                }}
                {...registerConfig("elevationStart")}
                error={configErrors.elevationStart ? true : false}
              />
              <Typography variant="inherit" color="error">
                {configErrors.elevationStart?.message}
              </Typography>
              <TextField
                required
                sx={{ mt: 2, width: "100%" }}
                id="azimuthStart"
                label="azimuthStart"
                type="number"
                defaultValue={68.81}
                inputProps={{
                  step: 0.1,
                }}
                {...registerConfig("azimuthStart")}
                error={configErrors.azimuthStart ? true : false}
              />
              <Typography variant="inherit" color="error">
                {configErrors.azimuthStart?.message}
              </Typography>
              <TextField
                required
                sx={{ mt: 2, width: "100%" }}
                id="windSpeedThreshold"
                label="windSpeedThreshold"
                type="number"
                defaultValue={25}
                inputProps={{
                  step: 1,
                }}
                {...registerConfig("windSpeedThreshold")}
                error={configErrors.windSpeedThreshold ? true : false}
              />
              <Typography variant="inherit" color="error">
                {configErrors.windSpeedThreshold?.message}
              </Typography>
              <Button
                sx={{ mt: 2, width: "100%" }}
                color="primary"
                variant="contained"
                onClick={handleSubmitConfig(onConfigSubmit)}
              >
                CONFIGURE DRIVER
              </Button>
            </>
          ) : (
            <div></div>
          )}
          {bleConnected && driverConfigured ? (
            <>
              <TextField
                required
                sx={{ mt: 2, width: "100%" }}
                id="ssid"
                label="ssid"
                type="text"
                {...registerWifi("ssid")}
                error={wifiErrors.ssid ? true : false}
              />
              <Typography variant="inherit" color="error">
                {wifiErrors.ssid?.message}
              </Typography>
              <TextField
                required
                sx={{ mt: 2, width: "100%" }}
                id="pass"
                label="pass"
                type="password"
                {...registerWifi("pass")}
                error={wifiErrors.pass ? true : false}
              />
              <Typography variant="inherit" color="error">
                {wifiErrors.pass?.message}
              </Typography>
              <Button
                sx={{ mt: 2, width: "100%" }}
                color="primary"
                variant="contained"
                onClick={handleSubmitWifi(onWifiSubmit)}
              >
                CONFIGURE WIFI
              </Button>
            </>
          ) : (
            <div></div>
          )}
          {wifiConnection == "WIFI_CONNECTED" &&
          driverConfigured &&
          data?.connectionStatus == 1 ? (
            <Button
              sx={{ mt: 2, width: "100%" }}
              color="primary"
              variant="contained"
              onClick={() => {}}
            >
              FINISH CONFIGURATION
            </Button>
          ) : (
            <div></div>
          )}
        </Box>
      </Container>
    </Layout>
  )
}
