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
import { useMutation } from "@tanstack/react-query"
import axios from "../../api/axios"
import { useNavigate } from "react-router-dom"
import { PATHS } from "../../navigation/paths"
import { useState } from "react"

type CreatePowerplantFormProps = {
  name: string
  serialNumber: string
  latitude: number
  longitude: number
  city: string
  tariff: number
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
  city: Yup.string().required("City is required"),
  tariff: Yup.number().required("Tariff is required"),
  latitude: Yup.number().min(-90).max(90).required("Coordinates are required"),
  longitude: Yup.number()
    .min(-180)
    .max(180)
    .required("Coordinates are required"),
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

  const navigate = useNavigate()

  const { mutate, error, isError } = useMutation<any, any, any>(
    async (data) => {
      const res = await axios.post("/Powerplant/add", data)
      return res.data
    },
    {
      onSuccess: async (response) => {
        navigate(PATHS.powerplantList)
      },
      onError: (error) => {
        console.log("create plant error xd", error)
      },
    }
  )
  const onSubmit = (props: CreatePowerplantFormProps) => {
    mutate(props)
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
          <TextField
            required
            sx={{ mt: 2, width: "100%" }}
            id="city"
            label="city"
            type="text"
            {...register("city")}
            error={errors.city ? true : false}
          />
          <Typography variant="inherit" color="error">
            {errors.city?.message}
          </Typography>
          <Box flexDirection={"row"} display="flex" marginTop={2}>
            <TextField
              sx={{ mr: 2 }}
              required
              id="latitude"
              label="latitude"
              type="number"
              {...register("latitude")}
              error={errors.latitude ? true : false}
            />
            <TextField
              required
              id="longitude"
              label="longitude"
              type="number"
              {...register("longitude")}
              error={errors.longitude ? true : false}
            />
          </Box>
          <Box flexDirection={"row"} display="flex">
            <Typography variant="inherit" color="error">
              {errors.latitude?.message}
            </Typography>
            <Typography variant="inherit" color="error">
              {errors.latitude?.message}
            </Typography>
          </Box>
          <TextField
            required
            sx={{ mt: 2, width: "100%" }}
            id="tariff"
            label="tariff"
            type="number"
            defaultValue={0.5}
            inputProps={{
              step: 0.1,
            }}
            {...register("tariff")}
            error={errors.tariff ? true : false}
          />
          <Typography variant="inherit" color="error">
            {errors.tariff?.message}
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
            onClick={handleSubmit(onSubmit)}
          >
            Create
          </Button>
          <Typography variant="inherit" color="error">
            {isError && errors !== null ? error.response.data.error : ""}
          </Typography>
        </Box>
      </Container>
    </Layout>
  )
}
