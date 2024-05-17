import { type IAttendancesHistoryResponse } from '~/core/types'
import { axiosInstance } from '~/core/utils/http.util'

export const userAPI = {
  getAttendancesHistory: async (): Promise<IAttendancesHistoryResponse[]> => {
    return axiosInstance.get('')
  }
}
