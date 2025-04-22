import { onUnmounted, ref, type Ref } from 'vue'
import { followOrUnfollow } from '@/services/consult'
import type { FollowType } from '@/types/consult'
import { showToast, type FormInstance } from 'vant'
import { sendMobileCode } from '@/services/user'
import type { CodeType } from '@/types/user'

// 封装逻辑，规范 useXxx，表示使用某功能
export const useFollow = (type: FollowType = 'doc') => {
  const loading = ref(false)
  // {a, b} 类型，传值得时候 {a, b, c} 也可以，这是类型兼容：多的可以给少的
  const follow = async (item: { id: string; likeFlag: 0 | 1 }) => {
    loading.value = true
    try {
      await followOrUnfollow(item.id, type)
      item.likeFlag = item.likeFlag === 1 ? 0 : 1
    } finally {
      loading.value = false
    }
  }
  return { loading, follow }
}

export const useSendMobileCode = (mobile: Ref<string>, type: CodeType = 'login') => {
  const form = ref<FormInstance>()
  const time = ref(0)
  let timer: number
  const onSend = async () => {
    if (time.value > 0) return
    await form.value?.validate('mobile')
    await sendMobileCode(mobile.value, type)
    showToast('发送成功')
    time.value = 60
    if (timer) clearInterval(timer)
    timer = setInterval(() => {
      time.value--
      if (time.value <= 0) clearInterval(timer)
    }, 1000)
  }

  onUnmounted(() => {
    clearInterval(timer)
  })

  return { onSend, time, form }
}
