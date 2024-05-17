import { type TAPIResponse, type TRole } from '~/core/types'
import { axiosInstance } from '~/core/utils/http.util'

import { API_URLS } from './api-urls'

export const roleAPI = {
  getRoles: async (): TAPIResponse<TRole[]> => {
    const response = await axiosInstance.get(API_URLS.ROLE.GET_ROLES)
    return response
  }
}
