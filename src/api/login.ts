import request from '@/server/axios.ts'

// export const loginUser = (userInfo: {}) => {
//   return request({
//     url: '/api/passport/login',
//     method: 'GET',
//     data: userInfo
//   })
// }
export const loginUser = (userInfo: {}) => {
  return request({
    url: '/api/login',
    method: 'GET',
    data: userInfo
  })
}


export const register = (userInfo: {}) => {
  return request({
    url: '/api/v1/auth/register',
    method: 'post',
    data: userInfo
  })
}


export const loginOutApi = (params) => {
  return request({
    url: '/logout',
    method: 'post',
    params
  })
}

export const getUserDetail = (params) => {
  return request({
    url: '/user/getUserDetail',
    method: 'get',
    params
  })
}

export function updatePassword(data) {
  return request({
    url: '/user/updatePassword',
    method: 'post',
    data
  })
}


export function checkLogin(data?) {
  return request({
    url: 'index/checkLogin',
    method: 'get',
    data
  })
}

export function getMenus(data) {
  return request({
    url: 'menu',
    method: 'get',
    data
  })
}

export function login(data) {
  return request({
    url: 'login',
    method: 'post',
    data
  })
}



