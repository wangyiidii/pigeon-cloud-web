import request from '@/utils/request'

export function getRouterList(data) {
  return request({
    url: '/rbac/user/router',
    method: 'get',
    data,
  })
}
