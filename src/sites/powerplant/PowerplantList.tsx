import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import axios from "../../api/axios"
import { Layout } from "../../components/Layout"
import { GetAllPowerplantsResponse } from "../../models/api-models"
import { PATHS } from "../../navigation/paths"

export const PowerplantList = () => {
  const navigate = useNavigate()

  const { data, refetch } = useQuery<any, any, GetAllPowerplantsResponse>(
    ["/powerplant/all"],
    async () => {
      const res = await axios.get("Powerplant/all")
      return res.data
    },
    {
      onSuccess: async (response) => {},
      onError: (error) => {
        console.log("error getting powerplants: ", error)
      },
    }
  )

  const onSubmit = () => {
    navigate(PATHS.powerplantCreate)
  }

  console.log("data", data)

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
          <Button
            sx={{ mt: 2, width: "100%" }}
            color="primary"
            variant="contained"
            onClick={onSubmit}
          >
            Create Powerplant
          </Button>

          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {data &&
              data.powerplants.map((e) => (
                <ListItem
                  key={e.powerplantId}
                  divider
                  secondaryAction={
                    e.connectionStatus == 1 ? (
                      <Typography>Online</Typography>
                    ) : (
                      <Button>Configure</Button>
                    )
                  }
                >
                  <ListItemText primary={e.name} secondary={e.location} />
                </ListItem>
              ))}
          </List>
        </Box>
      </Container>
    </Layout>
  )
}
