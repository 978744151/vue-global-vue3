import request from '@/server/axios.ts'

// export const loginUser = (userInfo: {}) => {
//   return request({
//     url: '/api/passport/login',
//     method: 'GET',
//     data: userInfo
//   })
// }
export const getCategoryAll = (params: {}) => {
  return request({
    url: '/drawingCategory/getCategoryAll',
    method: 'GET',
    params
  })
}

export const getCategoryDetail = (id: number) => {
  return request({
    url: `/drawingCategory/queryDrawingCategoryById/${id}`,
    method: 'GET',
  })
}



export const queryGoodsAttrList = (params:{}) => {
  return request({
    url: `/drawingTemplate/queryGoodsAttrList`,
    method: 'GET',
    params
  })
}


export const queryDrawingTemplateById = (id: number) => {
  return request({
    url: `/drawingTemplate/queryDrawingTemplateById/${id}`,
    method: 'GET',
  })
}
export const register = (userInfo: {}) => {
  return request({
    url: '/api/v1/auth/register',
    method: 'post',
    data: userInfo
  })
}


export const loginOutApi = (params:any) => {
  return request({
    url: '/logout',
    method: 'post',
    params
  })
}

export const getUserDetail = (params:any) => {
  return request({
    url: '/user/getUserDetail',
    method: 'get',
    params
  })
}

export function updatePassword(data:any) {
  return request({
    url: '/user/updatePassword',
    method: 'post',
    data
  })
}


export function checkLogin(data:any) {
  return request({
    url: 'index/checkLogin',
    method: 'get',
    data
  })
}

export function getMenus(data:any) {
  return request({
    url: 'menu',
    method: 'get',
    data
  })
}

export function login(data:any) {
  return request({
    url: 'login',
    method: 'post',
    data
  })
}


export function insertCaByCheck(data:any) {
  return request({
    url: '/drawingCategory/insertCaByCheck',
    method: 'post',
    data
  })
}

export function updateCaByCheck(data:any) {
  return request({
    url: '/drawingCategory/updateCaByCheck',
    method: 'post',
    data
  })
}


export function updateGoodsDrawingTemplate(data:any) {
  return request({
    url: '/drawingTemplate/updateGoodsDrawingTemplate',
    method: 'post',
    data
  })
}