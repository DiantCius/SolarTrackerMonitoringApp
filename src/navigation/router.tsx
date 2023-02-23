import React from "react"
import { Route, Routes } from "react-router-dom"
import { Login } from "../sites/auth/Login"
import { Register } from "../sites/auth/Register"
import { Home } from "../sites/Home"
import { CreatePowerplant } from "../sites/powerplant/CreatePowerplant"
import { Profile } from "../sites/Profile"
import { PATHS } from "./paths"

export const AppRouter = () => {
  return (
    <Routes>
      <Route path={PATHS.home} element={<Home />} />
      <Route path={PATHS.login} element={<Login />} />
      <Route path={PATHS.register} element={<Register />} />
      <Route path={PATHS.profile} element={<Profile />} />
      <Route path={PATHS.powerplantCreate} element={<CreatePowerplant />} />
    </Routes>
  )
}
