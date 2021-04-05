import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/file/attachment/list',
    method: 'get',
    data,
  })
}

export function deleteAttachment(data) {
  return request({
    url: '/file/attachment/' + data.id,
    method: 'delete',
    params: { isDeleteInBucket: data.isDeleteInBucket },
  })
}
