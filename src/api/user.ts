import request from '@/server/axios.ts'

export const getAppResources = (params) => {
  return request({
    url: '/user/getAppResources',
    method: 'GET',
    params
  })
}

export const getUserResources = (params) => {
  return request({
    url: '/user/getUserResources',
    method: 'get',
    params
  })
}

export const getUserRoles = (params) => {
  return request({
    url: '/user/getUserRoles',
    method: 'get',
    params
  })
}

