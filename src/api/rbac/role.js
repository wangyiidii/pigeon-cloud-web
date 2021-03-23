import request from '@/utils/request'
import qs from 'qs'

export function list(data) {
  return request({
    url: '/rbac/role/list',
    method: 'get',
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
  console.log({
    url: '/rbac/role/delBatch',
    method: 'delete',
    data: data,
  })
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

export function bindMenu(data) {
  return request({
    url: '/rbac/role/bindMenu',
    method: 'post',
    data,
  })
}
