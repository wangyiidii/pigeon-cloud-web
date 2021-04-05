import request from '@/utils/request'

/**
 * 组织树
 * @returns
 */
export function orgTree() {
  return request({
    url: '/rbac/org/tree',
    method: 'get',
  })
}
