import { useQuery } from "@tanstack/react-query"
import { GetYearlyProductionsResponse } from "../../../models/api-models"
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

interface YearlyProductionChartProps {
  serialNumber: string
  year: number
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const YearlyProductionChart = ({
  serialNumber,
  year,
}: YearlyProductionChartProps) => {
  const { data: yearlyProduction } = useQuery<
    any,
    any,
    GetYearlyProductionsResponse
  >(
    ["/EnergyProduction/year/monthly", serialNumber, year],
    async () => {
      const res = await axios.get(
        `/EnergyProduction/year/monthly?serialNumber=${serialNumber}&year=${year}`
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

  const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  }

  const values: number[] = []

  labels.forEach((element, index) => {
    const item = yearlyProduction?.monthlyProductions.find((e) => {
      return e.month === index + 1
    })
    if (item !== undefined) {
      values[index] = item.production
    } else {
      values[index] = 0
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

  return <Bar options={options} data={chartData} />
}
