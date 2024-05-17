export interface ILoginResponse {
  statusCode: number
  message: string
  data: IUserData
}

export interface IUserData {
  user: IUser
  tokens: ITokens
}

export interface IUser {
  createdAt: string
  updatedAt: string
  id: string
  role_id: number
  email: string
  fullName: string
  phone: string
  gender: number
  address: string
  district: string
  city: string
  country: string
  avatar: string
  workStartDate: string
  position: string
  status: number
  companyId: number
  deletedAt: string
}

export interface ITokens {
  accessToken: string
  refreshToken: string
}

export interface IAttendancesHistoryResponse {
  id: string
  fullName: string
  avatar: string
  checkIn: number
  checkOut: number
  dayOut: number
  workFromHome: number
}
