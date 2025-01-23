import errorCode from '@/plugins/errorCode'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Cookies from 'js-cookie';
import commonStore from "@/store/modules/common";
import { axiosInstall } from 'g-axios'

const configMethods = {
  baseURL: import.meta.env.VITE_URL_API,
  token: import.meta.env.VITE_TOKEN,
  request: () => { }
}

const reslove = (res) => {
  const { resultCode } = res.data
  if (resultCode !== "0") {

    if (resultCode === '6') {
      setTimeout(() => {
        commonStore().loginOut()
      }, 500);
      ElMessage({
        message: '登录失效,请重新登录',
        type: 'error',
      })
      return Promise.reject(new Error())
    }
    ElMessage({
      message: res?.data.resultMsg || '未知错误,请联系管理员',
      type: 'error',
    })
    return Promise.reject(new Error())
  }
}

export default axiosInstall(configMethods, reslove)