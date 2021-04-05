import request from '@/utils/request'

export function menuTree(data) {
  return request({
    url: '/rbac/resource/menuTree',
    method: 'get',
    data,
  })
}

export function menuPermsMap(data) {
  return request({
    url: '/rbac/resource/menuPermsMap',
    method: 'get',
    data,
  })
}
