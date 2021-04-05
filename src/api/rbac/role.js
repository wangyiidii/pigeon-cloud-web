import request from '@/utils/request'
import qs from 'qs'

export function list(data) {
  return request({
    url: '/rbac/role/list',
    method: 'post',
    data,
  })
}

export function createRole(data) {
  return request({
    url: '/rbac/role',
    method: 'post',
    data,
  })
}

export function updateRole(data) {
  return request({
    url: '/rbac/role',
    method: 'put',
    data,
  })
}
export function deleteRole(data) {
  return request({
    url: '/rbac/role/delBatch',
    method: 'delete',
    data: data,
  })
}

export function getRoleUserIdList(rid) {
  return request({
    url: '/rbac/role/user/' + rid,
    method: 'get',
  })
}

export function bindUser(data) {
  return request({
    url: '/rbac/role/bindUser',
    method: 'post',
    data,
  })
}

export function getRoleMenu(rid) {
  return request({
    url: '/rbac/role/menu/' + rid,
    method: 'get',
  })
}

export function getRolePermission(rid) {
  return request({
    url: '/rbac/role/perms/' + rid,
    method: 'get',
  })
}

export function bindResource(data) {
  return request({
    url: '/rbac/role/bindResource',
    method: 'post',
    data,
  })
}
