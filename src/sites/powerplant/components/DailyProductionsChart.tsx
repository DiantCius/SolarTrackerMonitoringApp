import { useQuery } from "@tanstack/react-query"
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

import { GetEnergyProductionsResponse } from "../../../models/api-models"
import axios from "../../../api/axios"

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

interface DailyProductionsChartProps {
  serialNumber: string
  day: number
  month: number
  year: number
}

export const DailyProductionsChart = ({
  serialNumber,
  year,
  month,
  day,
}: DailyProductionsChartProps) => {
  const { data: dailyProduction, refetch } = useQuery<
    any,
    any,
    GetEnergyProductionsResponse
  >(
    ["/EnergyProduction/day", serialNumber, year, month, day],
    async () => {
      const res = await axios.get(
        `/EnergyProduction/day?serialNumber=${serialNumber}&year=${year}&month=${month}&day=${day}`
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
    labels: dailyProduction?.energyProductions
      .filter((v) => v.currentProduction !== undefined)
      .map((e) => {
        const date = new Date(e.currentTime)
        return date.getHours() + ":" + date.getMinutes()
      }),

    datasets: [
      {
        fill: true,
        label: "Energy W",
        data: dailyProduction?.energyProductions.map(
          (e) => e.currentProduction
        ),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  }

  return <Line options={options} data={chartData} />
}
