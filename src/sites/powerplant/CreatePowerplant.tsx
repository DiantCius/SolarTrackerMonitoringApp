import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import { Layout } from "../../components/Layout"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

type CreatePowerplantFormProps = {
  name: string
  serialNumber: string
  powerplantType: number
}

const createPowerplantValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  serialNumber: Yup.string()
    .required("Serial number is required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(4, "Serial number must be 4 digits")
    .max(4, "Serial number must be 4 digits"),
  powerplantType: Yup.number().required("Type is required"),
})

export const CreatePowerplant = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePowerplantFormProps>({
    resolver: yupResolver(createPowerplantValidationSchema),
    reValidateMode: "onChange",
  })

  const connectToDevice = async () => {
    navigator.bluetooth
      .requestDevice({
        acceptAllDevices: true,
      })
      .then((device) => {
        console.log(`Name: ${device.name}`)
      })
      .catch((error) => {
        console.log("error", error)
      })

    navigator.bluetooth
      .requestDevice({
        acceptAllDevices: true,
      })
      .then((device) => {
        console.log("> Name:             " + device.name)
        console.log("> Id:               " + device.id)
        console.log("> Connected:        " + device.gatt?.connected)
      })
      .catch((error) => {
        console.log("Argh! " + error)
      })
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
          <Typography component="h1" variant="h5">
            Create Powerplant
          </Typography>
          <TextField
            required
            sx={{ mt: 2, width: "100%" }}
            id="name"
            label="name"
            type="text"
            {...register("name")}
            error={errors.name ? true : false}
          />
          <Typography variant="inherit" color="error">
            {errors.name?.message}
          </Typography>
          <TextField
            required
            sx={{ mt: 2, width: "100%" }}
            id="serialNumber"
            label="serial number"
            type="number"
            {...register("serialNumber")}
            error={errors.serialNumber ? true : false}
          />
          <Typography variant="inherit" color="error">
            {errors.serialNumber?.message}
          </Typography>
          <Select
            id="powerplantType"
            label="powerplant type"
            defaultValue={0}
            required
            sx={{ mt: 2, width: "100%" }}
            error={errors.powerplantType ? true : false}
            {...register("powerplantType")}
          >
            <MenuItem value={0}>Tracking</MenuItem>
            <MenuItem value={1}>Stationary</MenuItem>
          </Select>

          <Button
            sx={{ mt: 2, width: "100%" }}
            color="primary"
            variant="contained"
            onClick={connectToDevice}
          >
            BLUETOOTH
          </Button>
        </Box>
      </Container>
    </Layout>
  )
}
