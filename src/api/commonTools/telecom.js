import request from '@/utils/request'

export function sendRandom(data) {
  return request({
    url: '/openapi/telecom/sendRandomNum',
    method: 'post',
    data,
  })
}

export function randomLogin(data) {
  return request({
    url: '/openapi/telecom/randomLogin',
    method: 'post',
    data,
  })
}
