import request from '@/utils/request'

export function getUserInfo() {
  return request({
    url: '/rbac/user',
    method: 'get',
  })
}

/**
 * 用户路由
 * @returns
 */
export function getRouter(data) {
  return request({
    url: '/rbac/user/router',
    method: 'get',
    data,
  })
}

/**
 * 用户列表
 * @returns
 */
export function list(data) {
  return request({
    url: '/rbac/user/list',
    method: 'get',
    data,
  })
}
