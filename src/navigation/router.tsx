import React from "react"
import { Route, Routes } from "react-router-dom"
import { Login } from "../sites/auth/Login"
import { Register } from "../sites/auth/Register"
import { Home } from "../sites/Home"
import { ConfigurePowerplant } from "../sites/powerplant/ConfigurePowerplant"
import { CreatePowerplant } from "../sites/powerplant/CreatePowerplant"
import { PowerplantDetails } from "../sites/powerplant/PowerplantDetails"
import { PowerplantList } from "../sites/powerplant/PowerplantList"
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
      <Route path={PATHS.powerplantList} element={<PowerplantList />} />
      <Route
        path={PATHS.powerplantConfigure}
        element={<ConfigurePowerplant />}
      />
      <Route path={PATHS.powerplantDetails} element={<PowerplantDetails />} />
    </Routes>
  )
}
