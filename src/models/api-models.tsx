export interface LoginResponse {
  token: string
}

export interface RegisterResponse {
  token: string
}

export interface Powerplant {
  powerplantId: number
  name: string
  longitude: number
  latitude: number
  tariff: string
  powerplantType: number
  serialNumber: string
  connectionStatus: number
}

export interface GetAllPowerplantsResponse {
  powerplants: Powerplant[]
}

export interface EnergyProduction {
  energyProductionId: number
  currentProduction: string
  dailyProduction: string
  currentTime: string
  serialNumber: string
}

export interface GetEnergyProductionsResponse {
  energyProductions: EnergyProduction[]
}
