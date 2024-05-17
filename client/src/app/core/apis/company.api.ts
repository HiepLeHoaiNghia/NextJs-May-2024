import { ICompany, TAPIResponse } from '~/core/types'
import { axiosInstance } from '~/core/utils/http.util'

import { API_URLS } from './api-urls'

export const companyAPI = {
  getCompanies: async (): TAPIResponse<ICompany[]> => {
    const response = await axiosInstance.get(API_URLS.COMPANY.GET_COMPANIES)

    return response
  },
}
