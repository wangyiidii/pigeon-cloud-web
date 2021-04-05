import request from '@/utils/request'

export function getUserInfo() {
  return request({
    url: '/rbac/user',
    method: 'get',
  })
}

export function createUser(data) {
  return request({
    url: '/rbac/user',
    method: 'post',
    data,
  })
}

export function updateUserInfo(data) {
  return request({
    url: '/rbac/user/' + data.id,
    method: 'put',
    data,
  })
}

export function deleteUser(data) {
  return request({
    url: '/rbac/user/delBatch',
    method: 'delete',
    data,
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
    method: 'post',
    data,
  })
}
