import { Box, Container, Grid, List, ListItem, Typography } from "@mui/material"
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
    ["/EnergyProduction/today"],
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
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Daily energy production",
      },
    },
  }

  const chartData = {
    labels: data?.energyProductions
      .filter((v) => v.currentProduction !== undefined)
      .map((e) => e.currentTime.substring(11, 19)),

    datasets: [
      {
        fill: true,
        label: "DAILY ENERGY",
        data: data?.energyProductions.map((e) => e.currentProduction),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  }

  return (
    <Layout>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <Typography pr={1}> Azimuth: {indicationData?.azimuth}° </Typography>
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
        <Grid container>
          <Grid item xl={6} md={6} sm={12} xs={12}>
            <Line options={options} data={chartData} />
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
      </Container>
    </Layout>
  )
}
