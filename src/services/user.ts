import type { CodeType, User } from '@/types/user'
import { request } from '@/utils/request'

export const loginByPassword = (mobile: string, password: string) =>
  request<User>('login/password', 'POST', { mobile, password })

export const sendMobileCode = (mobile: string, type: CodeType) =>
  request<User>('code', 'GET', { mobile, type })

export const loginByMobile = (mobile: string, code: string) =>
  request<User>('login', 'POST', { mobile, code })
