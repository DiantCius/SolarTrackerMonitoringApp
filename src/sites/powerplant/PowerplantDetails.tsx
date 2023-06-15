import {
  Box,
  Container,
  Grid,
  Typography,
  makeStyles,
  useTheme,
} from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { Layout } from "../../components/Layout"
import axios from "../../api/axios"
import { useLocation, useParams } from "react-router-dom"
import {
  EnergyProduction,
  GetEnergyProductionsResponse,
  GetIndicationResponse,
} from "../../models/api-models"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js"
import { DatePicker } from "@mui/x-date-pickers"
import dayjs, { Dayjs } from "dayjs"
import { useEffect, useState } from "react"
import { MonthlyProductionChart } from "./components/MonthlyProductionsChart"
import { DailyProductionsChart } from "./components/DailyProductionsChart"
import { YearlyProductionChart } from "./components/YearlyProductionsChart"
import * as signalR from "@microsoft/signalr"
import { IndicationsTable } from "./components/IndicationsTable"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
)

export const PowerplantDetails = () => {
  const theme = useTheme()
  const gridItemHeight = "40vh"
  if (theme.palette.mode == "light") {
    ChartJS.defaults.color = "black"
  } else {
    ChartJS.defaults.color = "white"
  }
  ChartJS.defaults.backgroundColor = "#9BD0F5"
  ChartJS.defaults.borderColor = "#36A2EB"
  ChartJS.defaults.font.size = 14
  ChartJS.defaults.font.family = "Roboto, sans-serif"

  const [dailyDate, setDailyDate] = useState<Dayjs | null>(dayjs())
  const [monthlyDate, setMonthlyDate] = useState<Dayjs | null>(dayjs())
  const [yearlyDate, setYearlyDate] = useState<Dayjs | null>(dayjs())
  const [indicationData, setIndicationData] =
    useState<GetIndicationResponse | null>(null)
  const [isSignalRConnected, setIsSignalRConnected] = useState<boolean>(false)
  const { serialNumber } = useParams()

  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://www.solarsystem.somee.com/Indication", {
      transport: signalR.HttpTransportType.ServerSentEvents,
      withCredentials: true,
    })
    .configureLogging(signalR.LogLevel.Information)
    .build()

  const closeConnection = () => {
    if (connection.state === signalR.HubConnectionState.Connected) {
      connection.stop()
      console.log("SignalR Connection Closed.")
      setIsSignalRConnected(false)
    }
  }

  const connectToSignalR = async () => {
    try {
      await connection.start()
      console.log("SignalR Connected.")
      setIsSignalRConnected(true)
      connection.invoke("JoinGroup", serialNumber)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (!isSignalRConnected) {
      connectToSignalR()
    }
  }, [])

  useEffect(() => {
    return () => {
      closeConnection()
    }
  }, [])

  connection.on("ReceiveIndication", (indication: GetIndicationResponse) => {
    setIndicationData(indication)
    console.log("indication", indication)
  })

  // const { data: indicationData, refetch: refetchIndication } = useQuery<
  //   any,
  //   any,
  //   GetIndicationResponse
  // >(
  //   ["/Indications/read"],
  //   async () => {
  //     const res = await axios.get(
  //       `/Indications/read?serialNumber=${serialNumber}`
  //     )
  //     return res.data
  //   },
  //   {
  //     onSuccess: async (response) => {
  //       console.log("refetched")
  //     },
  //     onError: (error) => {
  //       console.log("error getting energy production data: ", error)
  //     },
  //   }
  // )

  const { data, refetch } = useQuery<any, any, GetEnergyProductionsResponse>(
    ["/EnergyProduction/today", serialNumber],
    async () => {
      const res = await axios.get(
        `/EnergyProduction/today?serialNumber=${serialNumber}`
      )
      return res.data
    },
    {
      onSuccess: async (response) => {},
      onError: (error) => {
        console.log("error getting energy production data: ", error)
      },
    }
  )

  const { data: currentProduction, refetch: refetchCurrentProduction } =
    useQuery<any, any, EnergyProduction>(
      ["/EnergyProduction/today/last"],
      async () => {
        const res = await axios.get(
          `/EnergyProduction/today/last?serialNumber=${serialNumber}`
        )
        return res.data
      },
      {
        onSuccess: async (response) => {},
        onError: (error) => {
          console.log("error getting energy production data: ", error)
        },
        refetchInterval: 30000,
      }
    )

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 6000,
      },
      x: {},
    },
  }

  const chartData = {
    labels: data?.energyProductions
      .filter((v) => v.currentProduction !== undefined)
      .map((e) => {
        const date = new Date(e.currentTime)
        return date.getHours() + ":" + date.getMinutes()
      }),

    datasets: [
      {
        fill: true,
        label: "Energy W",
        data: data?.energyProductions.map((e) => e.currentProduction),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  }

  return (
    <Layout>
      <Container maxWidth="xl">
        <Box flexDirection={"column"} display="flex" minHeight="100vh">
          <Grid container rowSpacing={4} columnSpacing={2}>
            <Grid item xl={6} md={6} sm={12} xs={12} marginTop={4}>
              {/* <Line options={options} data={chartData} /> */}
              {indicationData && currentProduction && (
                <IndicationsTable
                  azimuth={indicationData.azimuth}
                  elevation={indicationData.elevation}
                  serialNumber={indicationData.serialNumber}
                  windSpeed={indicationData.windSpeed}
                  solarAzimuth={indicationData.solarAzimuth}
                  solarElevation={indicationData.solarElevation}
                  state={indicationData.state}
                  currentProduction={currentProduction.currentProduction}
                  dailyProduction={currentProduction.dailyProduction}
                />
              )}
            </Grid>

            <Grid
              item
              style={{ height: gridItemHeight }}
              xl={6}
              md={6}
              sm={12}
              xs={12}
              marginBottom={2}
            >
              <DailyProductionsChart
                colorMode={theme.palette.mode}
                serialNumber={serialNumber!}
                day={dailyDate?.date()!}
                month={dailyDate?.month()! + 1}
                year={dailyDate?.year()!}
              />
              <DatePicker
                value={dailyDate}
                onChange={(newValue) => setDailyDate(newValue)}
              />
            </Grid>
            <Grid
              item
              style={{ height: gridItemHeight }}
              xl={6}
              md={6}
              sm={12}
              xs={12}
              marginBottom={2}
            >
              <MonthlyProductionChart
                colorMode={theme.palette.mode}
                serialNumber={serialNumber!}
                month={monthlyDate?.month()! + 1}
                year={monthlyDate?.year()!}
              />
              <DatePicker
                views={["year", "month"]}
                value={monthlyDate}
                onChange={(newValue) => setMonthlyDate(newValue)}
              />
            </Grid>
            <Grid
              item
              style={{ height: gridItemHeight }}
              xl={6}
              md={6}
              sm={12}
              xs={12}
              marginBottom={2}
            >
              <YearlyProductionChart
                colorMode={theme.palette.mode}
                serialNumber={serialNumber!}
                year={yearlyDate?.year()!}
              />
              <DatePicker
                views={["year"]}
                value={yearlyDate}
                onChange={(newValue) => setYearlyDate(newValue)}
              />
            </Grid>
          </Grid>
          {/* <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {data &&
            data.energyProductions.map((ep) => (
              <ListItem key={ep.energyProductionId} divider>
                <Typography>{ep.currentProduction}</Typography>
              </ListItem>
            ))}
        </List> */}
        </Box>
      </Container>
    </Layout>
  )
}
