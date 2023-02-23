import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import { useContext } from "react"
import { Controller, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import axios from "../../api/axios"
import { Layout } from "../../components/Layout"
import { UserContext } from "../../contexts/UserContext"
import { LoginResponse } from "../../models/api-models"
import { PATHS } from "../../navigation/paths"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"

type LoginFormProps = {
  email: string
  password: string
}

const loginValidationSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Email is invalid"),
  password: Yup.string()
    .required("Password is required")
    .min(4, "Password must be at least 4 characters")
    .max(40, "Password must not exceed 40 characters"),
  // confirmPassword: Yup.string()
  //   .required("Confirm Password is required")
  //   .oneOf([Yup.ref("password")], "Confirm Password does not match"),
})

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormProps>({
    resolver: yupResolver(loginValidationSchema),
    reValidateMode: "onChange",
  })

  const userContext = useContext(UserContext)
  const navigate = useNavigate()

  const { mutate, error, isError } = useMutation<LoginResponse, any, any>(
    async (data) => {
      const res = await axios.post("/Auth/login", data)
      return res.data
    },
    {
      onSuccess: async (response) => {
        userContext.login(response.token)
        navigate(PATHS.home)
      },
      onError: (error) => {
        console.log("login error xd", error)
      },
    }
  )

  const onSubmit = (props: LoginFormProps) => {
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
            Sign in
          </Typography>
          <TextField
            required
            sx={{ mt: 2, width: "100%" }}
            id="email"
            label="email"
            type="email"
            {...register("email")}
            error={errors.email ? true : false}
          />
          <Typography variant="inherit" color="error">
            {errors.email?.message}
          </Typography>
          <TextField
            required
            sx={{ mt: 2, width: "100%" }}
            id="password"
            label="password"
            type="password"
            {...register("password")}
            error={errors.password ? true : false}
          />
          <Typography variant="inherit" color="error">
            {errors.password?.message}
          </Typography>
          {/* <Controller
            control={control}
            name="email"
            defaultValue="test1@test.pl"
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { invalid, isTouched, isDirty, error },
              formState,
            }) => (
              <TextField
                sx={{ mt: 2, width: "100%" }}
                label="email"
                value={value}
                type="email"
                onBlur={onBlur}
                onChange={onChange}
                inputRef={ref}
              />
            )}
          />
           */}
          <Button
            sx={{ mt: 2, width: "100%" }}
            color="primary"
            variant="contained"
            onClick={handleSubmit(onSubmit)}
          >
            Log in
          </Button>
          <Typography variant="inherit" color="error">
            {isError && errors !== null ? error?.response?.data?.error : ""}
          </Typography>
          <Grid container marginTop={2}>
            <Grid item xs>
              <Link underline="none" href={PATHS.home}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link underline="none" href={PATHS.register}>
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Layout>
  )
}
