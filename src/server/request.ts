import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import type { newAxiosRequestConfig } from './typed'
import Cookies from 'js-cookie';

export const axiosInstall =  (configMethods,resolve) => {

  axios.defaults.timeout = 60000

  axios.defaults.validateStatus = function (status) {
    return status >= 200 && status <= 500 // 默认的
  }

  axios.defaults.withCredentials = true // 跨域请求时发送Cookie

  const baseRequestConfig: AxiosRequestConfig = {
    baseURL:configMethods.baseURL
  }

  const instancs = axios.create(baseRequestConfig)
    instancs.interceptors.request.use(
      (config: newAxiosRequestConfig) => {
        NProgress.start()
        const token =  Cookies.get(configMethods.token)
        if (token) {
          config.headers['Authorization'] = token // token
        }
        configMethods.request()
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    instancs.interceptors.response.use(
      (res: AxiosResponse) => {
        NProgress.done()
        resolve(res)
        return res
      },
      (error) => {
        NProgress.done()
        return Promise.reject(new Error(error))
      }
    )
  return instancs
};

 
