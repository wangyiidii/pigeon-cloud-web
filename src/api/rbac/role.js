import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/rbac/role/list',
    method: 'get',
    data,
  })
}
