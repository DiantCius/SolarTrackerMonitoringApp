import { Container } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { Layout } from "../../components/Layout"
import axios from "../../api/axios"
import { useParams } from "react-router-dom"
import { GetEnergyProductionsResponse } from "../../models/api-models"

export const PowerplantDetails = () => {
  const { serialNumber } = useParams()
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
  return (
    <Layout>
      <Container maxWidth="xs">powerplant details</Container>
    </Layout>
  )
}
