import { useQuery } from "@tanstack/react-query"
import { GetEnergyProductionsResponse } from "../../../models/api-models"
import axios from "../../../api/axios"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar } from "react-chartjs-2"

interface MonthlyProductionChartProps {
  serialNumber: string
  month: number
  year: number
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const MonthlyProductionChart = ({
  serialNumber,
  month,
  year,
}: MonthlyProductionChartProps) => {
  const { data: monthlyProduction } = useQuery<
    any,
    any,
    GetEnergyProductionsResponse
  >(
    ["/EnergyProduction/month/daily", serialNumber, month, year],
    async () => {
      const res = await axios.get(
        `/EnergyProduction/month/daily?serialNumber=${serialNumber}&month=${month}&year=${year}`
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
  }

  const numDays = new Date(year, month, 0).getDate()

  const labels = Array.from({ length: numDays }, (_, index) => index + 1)

  const productions = monthlyProduction?.energyProductions.filter(
    (v) => v !== undefined
  )

  const values: string[] = []

  labels.forEach((element, index) => {
    const item = productions?.find((e) => {
      return new Date(e.currentTime).getDate() === index + 1
    })
    if (item !== undefined) {
      values[index] = item.dailyProduction
    } else {
      values[index] = "0"
    }
  })

  const chartData = {
    labels: labels,
    datasets: [
      {
        fill: true,
        label: "Energy kWh",
        data: values,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  }

  console.log("monthly:", values)

  return <Bar options={options} data={chartData} />
}
