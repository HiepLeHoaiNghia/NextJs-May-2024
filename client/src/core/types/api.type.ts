import { type AxiosResponse } from 'axios'

export interface IApiResponseError {
  response?: { data: { message: string } }
}

export type TAPIResponse<T> = Promise<AxiosResponse<{ data: T }>>
