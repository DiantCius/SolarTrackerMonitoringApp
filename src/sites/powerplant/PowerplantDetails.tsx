import { Box, Container, Grid, Typography, makeStyles } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { Layout } from "../../components/Layout"
import axios from "../../api/axios"
import { useParams } from "react-router-dom"
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
import { Line } from "react-chartjs-2"
import { DatePicker } from "@mui/x-date-pickers"
import dayjs, { Dayjs } from "dayjs"
import { useState } from "react"
import { MonthlyProductionChart } from "./components/MonthlyProductionsChart"
import { DailyProductionsChart } from "./components/DailyProductionsChart"
import { YearlyProductionChart } from "./components/YearlyProductionsChart"

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
  const gridItemHeight = "40vh"

  const [dailyDate, setDailyDate] = useState<Dayjs | null>(dayjs())
  const [monthlyDate, setMonthlyDate] = useState<Dayjs | null>(dayjs())
  const [yearlyDate, setYearlyDate] = useState<Dayjs | null>(dayjs())

  const { serialNumber } = useParams()

  const { data: indicationData, refetch: refetchIndication } = useQuery<
    any,
    any,
    GetIndicationResponse
  >(
    ["/Indications/read"],
    async () => {
      const res = await axios.get(
        `/Indications/read?serialNumber=${serialNumber}`
      )
      return res.data
    },
    {
      onSuccess: async (response) => {
        console.log("refetched")
      },
      onError: (error) => {
        console.log("error getting energy production data: ", error)
      },
      refetchInterval: 2000,
    }
  )

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

  console.log("daily", dailyDate?.month())

  return (
    <Layout>
      <Container maxWidth="xl">
        <Box flexDirection={"column"} display="flex" minHeight="100vh">
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Typography pr={1}>Azimuth: {indicationData?.azimuth}°</Typography>
            <Typography pr={1}>
              Elevation: {indicationData?.elevation}°
            </Typography>
            <Typography pr={1}>
              Wind speed: {indicationData?.windSpeed}
            </Typography>
            <Typography pr={1}>State: {indicationData?.state} </Typography>
            <Typography pr={1}>
              Today: {currentProduction?.dailyProduction} kWh
            </Typography>
            <Typography pr={1}>
              Now: {currentProduction?.currentProduction} W
            </Typography>
          </Box>
          <Grid container rowSpacing={4} columnSpacing={2}>
            <Grid
              item
              style={{ height: gridItemHeight }}
              xl={6}
              md={6}
              sm={12}
              xs={12}
            >
              <Line options={options} data={chartData} />
            </Grid>
            <Grid
              item
              style={{ height: gridItemHeight }}
              xl={6}
              md={6}
              sm={12}
              xs={12}
            >
              <DailyProductionsChart
                serialNumber={serialNumber!}
                day={dailyDate?.date()!}
                month={dailyDate?.month()! + 1}
                year={dailyDate?.year()!}
              />
              <DatePicker
                sx={{ width: 175 }}
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
            >
              <MonthlyProductionChart
                serialNumber={serialNumber!}
                month={monthlyDate?.month()! + 1}
                year={monthlyDate?.year()!}
              />
              <DatePicker
                sx={{ width: 175 }}
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
            >
              <YearlyProductionChart
                serialNumber={serialNumber!}
                year={yearlyDate?.year()!}
              />
              <DatePicker
                sx={{ width: 175 }}
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
