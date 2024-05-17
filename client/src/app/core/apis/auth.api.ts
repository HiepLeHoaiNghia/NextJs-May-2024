import { IChangePasswordPayload } from '~/core/types'
import { axiosInstance } from '~/core/utils/http.util'

import { TLoginSchema, TUserManagementSchema } from '../validation'
import { API_URLS } from './api-urls'

export const authAPI = {
  login: async (payload: TLoginSchema) => {
    const response = await axiosInstance.post(API_URLS.AUTH.LOGIN, payload)

    return response
  },

  register: async (payload: TUserManagementSchema) => {
    const response = await axiosInstance.post(API_URLS.AUTH.REGISTER, payload)

    return response
  },

  changePassword: async (payload: IChangePasswordPayload) => {
    const { userId, oldPassword, newPassword } = payload
    const response = await axiosInstance.post(API_URLS.AUTH.CHANGE_PASSWORD, { userId, oldPassword, newPassword })

    return response
  },
}
