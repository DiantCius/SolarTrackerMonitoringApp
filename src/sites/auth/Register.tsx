import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material"
import { useForm } from "react-hook-form"
import { Layout } from "../../components/Layout"
import { PATHS } from "../../navigation/paths"
import { yupResolver } from "@hookform/resolvers/yup"
import axios from "../../api/axios"
import * as Yup from "yup"
import { useMutation } from "@tanstack/react-query"
import { RegisterResponse } from "../../models/api-models"
import { useNavigate } from "react-router-dom"

type RegisterFormProps = {
  username: string
  email: string
  password: string
  confirmPassword: string
}

const registerValidationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().required("Email is required").email("Email is invalid"),
  password: Yup.string()
    .required("Password is required")
    .min(4, "Password must be at least 4 characters")
    .max(40, "Password must not exceed 40 characters"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Confirm Password does not match"),
})

export const Register = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterFormProps>({
    resolver: yupResolver(registerValidationSchema),
    reValidateMode: "onChange",
  })

  const navigate = useNavigate()

  const { mutate, error, isError } = useMutation<RegisterResponse, any, any>(
    async (data) => {
      const res = await axios.post("/Auth/register", data)
      return res.data
    },
    {
      onSuccess: async (response) => {
        navigate(PATHS.login)
      },
      onError: (error) => {
        console.log("register error xd", error.response.data.error)
      },
    }
  )

  const onSubmit = (props: RegisterFormProps) => {
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
            Sign up
          </Typography>
          <TextField
            required
            sx={{ mt: 2, width: "100%" }}
            id="username"
            label="username"
            type="text"
            {...register("username")}
            error={errors.username ? true : false}
          />
          <Typography variant="inherit" color="error">
            {errors.username?.message}
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
          <TextField
            required
            sx={{ mt: 2, width: "100%" }}
            id="confirmPassword"
            label="confirm password"
            type="password"
            {...register("confirmPassword")}
            error={errors.confirmPassword ? true : false}
          />
          <Typography variant="inherit" color="error">
            {errors.confirmPassword?.message}
          </Typography>
          <Button
            sx={{ mt: 2, width: "100%" }}
            color="primary"
            variant="contained"
            onClick={handleSubmit(onSubmit)}
          >
            Register
          </Button>
          <Typography variant="inherit" color="error">
            {isError && errors !== null ? error.response.data.error : ""}
          </Typography>
          <Grid container marginTop={2} justifyContent="flex-end">
            <Grid item>
              <Link underline="none" href={PATHS.home}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Layout>
  )
}
