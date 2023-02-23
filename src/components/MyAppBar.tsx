import * as React from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Menu from "@mui/material/Menu"
import MenuIcon from "@mui/icons-material/Menu"
import Container from "@mui/material/Container"
import Button from "@mui/material/Button"
import Tooltip from "@mui/material/Tooltip"
import MenuItem from "@mui/material/MenuItem"
import { useTheme } from "@mui/material/styles"
import Brightness4Icon from "@mui/icons-material/Brightness4"
import Brightness7Icon from "@mui/icons-material/Brightness7"
import { ColorModeContext } from "../contexts/ColorModeContext"
import { PATHS } from "../navigation/paths"
import { Link } from "react-router-dom"
import SettingsIcon from "@mui/icons-material/Settings"
import { UserContext } from "../contexts/UserContext"

const settings = ["Profile", "Account", "Dashboard"]

export const MyAppBar = () => {
  const theme = useTheme()

  const colorMode = React.useContext(ColorModeContext)

  const { isLoggedIn, logout } = React.useContext(UserContext)

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  )

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box>
            <IconButton
              sx={{ ml: 1 }}
              onClick={colorMode.toggleColorMode}
              color="inherit"
            >
              {theme.palette.mode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            SOLAR MISIO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {isLoggedIn
                ? [
                    <Link key={"home"} to={PATHS.home}>
                      <MenuItem onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">HOME</Typography>
                      </MenuItem>
                    </Link>,
                    <Link key={"profile"} to={PATHS.profile}>
                      <MenuItem onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">PROFILE</Typography>
                      </MenuItem>
                    </Link>,
                  ]
                : [
                    <Link key={"home"} to={PATHS.home}>
                      <MenuItem onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">HOME</Typography>
                      </MenuItem>
                    </Link>,
                    <Link key={"login"} to={PATHS.login}>
                      <MenuItem onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">LOGIN</Typography>
                      </MenuItem>
                    </Link>,
                    <Link key={"register"} to={PATHS.register}>
                      <MenuItem onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">REGISTER</Typography>
                      </MenuItem>
                    </Link>,
                  ]}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            SOLAR MISIO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {isLoggedIn
              ? [
                  <Link key={"home"} to={PATHS.home}>
                    <Button
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      HOME
                    </Button>
                  </Link>,
                  <Link key={"profile"} to={PATHS.profile}>
                    <Button
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      PROFILE
                    </Button>
                  </Link>,
                ]
              : [
                  <Link key={"login"} to={PATHS.login}>
                    <Button
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      LOGIN
                    </Button>
                  </Link>,
                  <Link key={"register"} to={PATHS.register}>
                    <Button
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      REGISTER
                    </Button>
                  </Link>,
                  <Link key={"home"} to={PATHS.home}>
                    <Button
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      HOME
                    </Button>
                  </Link>,
                ]}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton
                color="inherit"
                onClick={handleOpenUserMenu}
                sx={{ p: 0 }}
              >
                <SettingsIcon fontSize="large" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
              {isLoggedIn ? (
                <MenuItem
                  onClick={() => {
                    logout()
                    handleCloseUserMenu()
                  }}
                >
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              ) : (
                <div></div>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
