export interface LoginResponse {
  token: string
}

export interface RegisterResponse {
  token: string
}

export interface Powerplant {
  powerplantId: number
  name: string
  location: string
  powerplantType: number
  serialNumber: string
  connectionStatus: number
}

export interface GetAllPowerplantsResponse {
  powerplants: Powerplant[]
}
