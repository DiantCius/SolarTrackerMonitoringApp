import { Container, Grid, List, ListItem, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { Layout } from "../../components/Layout"
import axios from "../../api/axios"
import { useParams } from "react-router-dom"
import {
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
    [`/Indications/read?serialNumber=${serialNumber}`],
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
    [`/EnergyProduction/today/${serialNumber}`],
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

  const options = {
    responsive: true,
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
        text: "Chart.js Line Chart",
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
        label: "Dataset 2",
        data: data?.energyProductions.map((e) => e.currentProduction),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  }

  return (
    <Layout>
      <Container maxWidth="xs">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {indicationData?.azimuth}
          </Grid>
          <Grid item xs={6}>
            {indicationData?.elevation}
          </Grid>
          <Grid item xs={6}>
            {indicationData?.windSpeed}
          </Grid>
          <Grid item xs={6}>
            state {indicationData?.state}
          </Grid>
        </Grid>
        Energy productions
        <Line options={options} data={chartData} />
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {data &&
            data.energyProductions.map((ep) => (
              <ListItem key={ep.energyProductionId} divider>
                <Typography>{ep.currentProduction}</Typography>
              </ListItem>
            ))}
        </List>
      </Container>
    </Layout>
  )
}
