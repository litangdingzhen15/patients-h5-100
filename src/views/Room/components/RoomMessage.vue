<script setup lang="ts">
import { IllnessTime, MsgType } from '@/enums'
import { flagOptions, timeOptions } from '@/services/constants'
import { useUserStore } from '@/stores'
import type { Image } from '@/types/consult'
import type { Message } from '@/types/room'
import { showImagePreview, showToast } from 'vant'
import dayjs from 'dayjs'

defineProps<{ item: Message }>()

const getIllnessTimeText = (time: IllnessTime) =>
  timeOptions.find((item) => item.value === time)?.label

const getConsultFlagText = (flag: 0 | 1) => flagOptions.find((item) => item.value === flag)?.label

const onPreviewImage = (images?: Image[]) => {
  if (images && images.length) showImagePreview(images.map((item) => item.url))
  else showToast('暂无图片')
}

const store = useUserStore()

const formatTime = (time: string)=>dayjs(time).format('HH:mm')
</script>

<template>
  <!-- 病情描述 -->
  <div class="msg msg-illness" v-if="item.msgType === MsgType.CardPat">
    <div class="patient van-hairline--bottom" v-if="item.msg.consultRecord">
      <p>
        {{ item.msg.consultRecord?.patientInfo.name }}
        {{ item.msg.consultRecord?.patientInfo.genderValue }}
        {{ item.msg.consultRecord?.patientInfo.age }}岁
      </p>
      <p v-if="item.msg.consultRecord">
        {{ getIllnessTimeText(item.msg.consultRecord?.illnessTime) }} |
        {{ getConsultFlagText(item.msg.consultRecord?.consultFlag) }}
      </p>
    </div>
    <van-row>
      <van-col span="6">病情描述</van-col>
      <van-col span="18">{{ item.msg.consultRecord?.illnessDesc }}</van-col>
      <van-col span="6">图片</van-col>
      <van-col span="18" @click="onPreviewImage(item.msg.consultRecord?.pictures)">
        点击查看
      </van-col>
    </van-row>
  </div>
  <!-- 通用通知 -->
  <div class="msg msg-tip" v-if="item.msgType === MsgType.Notify">
    <div class="content">
      <span>{{ item.msg.content }}</span>
    </div>
  </div>
  <!-- 温馨提示 -->
  <div class="msg msg-tip" v-if="item.msgType === MsgType.NotifyTip">
    <div class="content">
      <span class="green">温馨提示：</span>
      <span>{{ item.msg.content }}</span>
    </div>
  </div>
  <div class="msg msg-to" v-if="item.msgType === MsgType.MsgText && item.from === store.user?.id">
    <div class="content">
      <div class="time">{{ formatTime(item.createTime) }}</div>
      <div class="pao">{{ item.msg.content }}</div>
    </div>
    <van-image :src="item.fromAvatar" />
  </div>
  <div class="msg msg-from" v-if="item.msgType === MsgType.MsgText && item.from !== store.user?.id">
    <van-image :src="item.fromAvatar" />
    <div class="content">
      <div class="time">{{ formatTime(item.createTime) }}</div>
      <div class="pao">{{ item.msg.content }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/room.scss';
</style>
