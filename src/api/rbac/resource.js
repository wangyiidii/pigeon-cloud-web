import request from '@/utils/request'

export function resourceTree(data) {
  return request({
    url: '/rbac/resource/tree',
    method: 'get',
    data,
  })
}
