import { defineStore } from 'pinia'
import type { User } from '../../types/user'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'cp-user',
  () => {
    // 1.用户信息状态
    const user = ref<User>()
    // 2.设置用户信息的函数
    const setUser = (u: User) => {
      user.value = u
    }
    // 3.删除用户信息的函数
    const delUser = () => {
      user.value = undefined
    }

    const returnUrl = ref('')
    const setReturnUrl = (url: string) => {
      returnUrl.value = url
    }

    // *定义的所有数据、方法都需return
    return { user, setUser, delUser, returnUrl, setReturnUrl }
  },
  {
    persist: true, // *本地持久化
  },
)
