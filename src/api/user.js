import request from '@/utils/request'

/**密码登陆 */
export async function login(data) {
  return request({
    url: '/auth/oauth/token',
    method: 'post',
    params: {
      username: data.username,
      password: data.password,
      client_id: 'system',
      client_secret: 'system',
      grant_type: 'password',
    },
  })
}

export async function loginBySocial(data) {
  return request({
    url: '/auth/oauth/token',
    method: 'post',
    params: {
      client_id: 'system',
      client_secret: 'system',
      grant_type: 'social',
      source: data.source,
      code: data.code,
      state: data.state,
    },
  })
}

/**注销登录 */
export function logout() {
  return request({
    url: '/logout',
    method: 'post',
  })
}

/**注册 */
export function register() {
  return request({
    url: '/register',
    method: 'post',
  })
}
