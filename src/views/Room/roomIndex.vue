<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
import io, { Socket } from 'socket.io-client'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import type { Message, TimeMessages } from '@/types/room'
import { MsgType, OrderType } from '@/enums'
import type { ConsultOrderItem } from '@/types/consult'
import { getConsultOrderDetail } from '@/services/consult'

const store = useUserStore()
const route = useRoute()

const list = ref<Message[]>([])

let socket: Socket

const consult = ref<ConsultOrderItem>()
const loadConsult = async () => {
  const res = await getConsultOrderDetail(route.query.orderId as string)
  consult.value = res.data
}

onMounted(() => {
  loadConsult()
  socket = io(baseURL, {
    auth: {
      token: `Bearer ${store.user?.token}`,
    },
    query: {
      orderId: route.query.orderId,
    },
  })

  socket.on('connect', () => {
    // 建立连接成功
    console.log('connect')
  })

  socket.on('error', () => {
    console.log('error')
  })

  socket.on('disconnect', () => {
    // 已经断开连接
    console.log('disconnect')
  })

  // 聊天记录
  socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
    // 准备转换常规消息列表
    const arr: Message[] = []
    data.forEach((item) => {
      arr.push({
        msgType: MsgType.Notify,
        msg: { content: item.createTime },
        createTime: item.createTime,
        id: item.createTime,
      })
      arr.push(...item.items)
    })
    // 追加到聊天消息列表
    list.value.unshift(...arr)
  })

  socket.on('statusChange', () => loadConsult())

  socket.on('receiveChatMsg', async (e) => {
    list.value.push(e)
    await nextTick()
    window.scrollTo(0, document.body.scrollHeight)
  })
})

onUnmounted(() => {
  socket.close()
})

const onSendText = (text: string) => {
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: {
      content: text,
    },
  })
}
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <room-status :status="consult?.status" :countdown="consult?.countdown"></room-status>
    <room-message v-for="item in list" :key="item.id" :item="item"></room-message>
    <room-action
      @send-text="onSendText"
      :disabled="consult?.status !== OrderType.ConsultChat"
    ></room-action>
  </div>
</template>

<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
