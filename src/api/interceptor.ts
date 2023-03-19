import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosHeaders } from 'axios'
import { Message, Modal } from '@arco-design/web-vue'
import { getToken } from '@/utils/auth'

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
}

// 请求拦截器
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token) {
      if (!config.headers) {
        config.headers = {} as AxiosHeaders
      }
      config.headers.set('Authorization', `Bearer ${token}`)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message.error({
    //     content: res.msg || 'Error',
    //     duration: 5 * 1000
    //   })
    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if ([50008, 50012, 50014].includes(res.code) && response.config.url !== '/api/user/info') {
    //     Modal.error({
    //       title: 'Confirm logout',
    //       content: 'You have been logged out, you can cancel to stay on this page, or log in again',
    //       okText: 'Re-Login',
    //       async onOk() {
    //         // const userStore = useUserStore();

    //         // await userStore.logout();
    //         window.location.reload()
    //       }
    //     })
    //   }
    //   return Promise.reject(new Error(res.msg || 'Error'))
    // }
    return res
  },
  (error) => {
    Message.error({
      content: error.msg || 'Request Error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
