import axios from "axios"
import { redirect } from "react-router-dom"
import { PATHS } from "../navigation/paths"

axios.defaults.baseURL = "https://solarsystem.somee.com"
//axios.defaults.baseURL = "https://localhost:7227"

axios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (res) => {
    return res
  },
  async (err) => {
    if (err.response) {
      if (err.response.status === 401) {
        window.location.href = PATHS.login
        //redirect("/login")
      }
    }
    return Promise.reject(err)
  }
)

export default axios
