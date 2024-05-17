export interface ICompany {
  id: number
  name: string
  address: string
  district: string
  city: string
  country: string
  startWorkTime: string
  endWorkTime: string
  startBreakLunchTime: string
  endBreakLunchTime: string
  freeTime: number
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}
