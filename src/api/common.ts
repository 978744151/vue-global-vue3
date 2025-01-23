import request from '@/server/axios'
/**
 * @...reset
 */
const common = {
  getList: (params: {}, { url = '', id = '' }) => {
    return request({
      url: url + id,
      method: 'get',
      params
    })
  },

  post: (data: {}, { url = '', postMethod = 'post' }) => {
    return request({
      url,
      method: postMethod,
      data
    })
  },
  postDesk: (url = '',data: {},method='post') => {
    return request({
      url,
      method,
      data
    })
  },
  del: (id: string, { url = '', delMethod = 'delete' }, params = {}) => {
    return request({
      url: url + id,
      method: delMethod,
      params
    })
  },
  put: (data: {}, { url = '', putMethod = 'put' }) => {
    return request({
      url: url,
      method: putMethod,
      data
    })
  }
}
export default common
