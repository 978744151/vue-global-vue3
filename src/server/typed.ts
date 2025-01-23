import type {
  AxiosRequestConfig,
  AxiosResponse,
  RawAxiosRequestHeaders,
  AxiosHeaders,
  AxiosError
} from 'axios'
export interface newAxiosRequestConfig extends AxiosRequestConfig {
  headers: RawAxiosRequestHeaders & AxiosHeaders
}
