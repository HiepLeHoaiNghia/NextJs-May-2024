import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

import { ITokens } from '../types'

interface User {
  user: {
    tokens: ITokens
  }
}

const authInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const user = localStorage.getItem('user')

  const newConfig = { ...config }

  if (user) {
    const userParse = JSON.parse(user || '{}') as User
    newConfig.headers.Authorization = `Bearer ${userParse.user.tokens.accessToken}`
  }
  return newConfig
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(authInterceptor)

export { axiosInstance }
