import axios from 'axios'

export interface LoginData {
  username: string
  password: string
}

export interface LoginRes {
  token: string
}

export function LOGIN(data: LoginData) {
  axios.post<LoginRes>('/api/user/login', data)
}
