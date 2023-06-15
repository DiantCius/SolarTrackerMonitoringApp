import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import { ClockNumberClasses } from "@mui/x-date-pickers"

interface IndicationsTableProps {
  serialNumber: string
  azimuth: number
  elevation: number
  solarAzimuth: number
  solarElevation: number
  windSpeed: number
  state: number[]
  currentProduction: string
  dailyProduction: string
}

function createAngleData(
  angle: number,
  solarAngle: number,
  diffrence: number,
  state: number
) {
  return { angle, solarAngle, diffrence, state }
}

function createProductionData(
  serialNumber: string,
  currentProduction: string,
  dailyProduction: string,
  windSpeed: number
) {
  return { serialNumber, currentProduction, dailyProduction, windSpeed }
}

export const IndicationsTable = ({
  serialNumber,
  azimuth,
  elevation,
  solarElevation,
  solarAzimuth,
  windSpeed,
  state,
  currentProduction,
  dailyProduction,
}: IndicationsTableProps) => {
  const angleRows = [
    createAngleData(azimuth, solarAzimuth, solarAzimuth - azimuth, state[1]),
    createAngleData(
      elevation,
      solarElevation,
      -(elevation + (solarElevation - 90)),
      state[2]
    ),
  ]

  const productionRows = [
    createProductionData(
      serialNumber,
      currentProduction,
      dailyProduction,
      windSpeed
    ),
  ]

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 1 } }}
            >
              <TableCell>Serial number </TableCell>
              <TableCell align="right">Now</TableCell>
              <TableCell align="right">Today</TableCell>
              <TableCell align="right">Wind</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productionRows.map((row) => (
              <TableRow key={row.serialNumber}>
                <TableCell component="th" scope="row">
                  {row.serialNumber}
                </TableCell>
                <TableCell align="right">{row.currentProduction} W</TableCell>
                <TableCell align="right">{row.dailyProduction} kWh</TableCell>
                <TableCell align="right">{row.windSpeed} km/h</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 1 } }}
            >
              <TableCell>Tracker angle </TableCell>
              <TableCell align="right">Solar angle</TableCell>
              <TableCell align="right">Diffrence</TableCell>
              <TableCell align="right">State</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {angleRows.map((row, index) => (
              <TableRow key={row.angle}>
                {index == 0 ? (
                  <TableCell component="th" scope="row">
                    Azimuth: {row.angle}°
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    Elevation: {row.angle}°
                  </TableCell>
                )}
                <TableCell align="right">{row.solarAngle}°</TableCell>
                <TableCell align="right">{row.diffrence}°</TableCell>
                <TableCell align="right">{row.state}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
