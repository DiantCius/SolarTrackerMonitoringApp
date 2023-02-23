import axios from "axios"
import React, { ReactElement, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PATHS } from "../navigation/paths"

export const UserContext = React.createContext({
  isLoggedIn: false,
  setIsLoggedIn: (state: boolean) => {},
  token: "",
  setToken: (state: string) => {},
  //   email: "",
  //   setEmail: (state: string) => {},
  login: (token: string) => {},
  logout: () => {},
})

export const UserContextProvider: React.FC<{
  children: ReactElement<any, any>
}> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  //const [email, setEmail] = useState(localStorage.getItem("email") || "")
  const [token, setToken] = useState(localStorage.getItem("token") || "")
  const navigate = useNavigate()

  const login = (token: string) => {
    if (token) {
      //setEmail(email)
      setToken(token)
      setIsLoggedIn(true)
      //axios.defaults.headers.common.Authorization = `Bearer ${token}`
      localStorage.setItem("token", token)
      //localStorage.setItem("email", email)
    }
  }

  const logout = () => {
    //setEmail("")
    setToken("")
    localStorage.removeItem("token")
    //localStorage.removeItem("email")
    //axios.defaults.headers.common.Authorization = null
    setIsLoggedIn(false)
    navigate(PATHS.login)
  }

  return (
    <UserContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        setIsLoggedIn: setIsLoggedIn,
        //email: email,
        token: token,
        login: login,
        setToken: setToken,
        //setEmail: setEmail,
        logout: logout,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
