<script setup lang="ts">
import { useRouter } from 'vue-router'

const prop =  defineProps<{
  title?: string
  rightText?: string
  back?: () => void
}>()

const emit = defineEmits<{ (e: 'click-right'): void }>()
const onClickRight = () => {
  emit('click-right')
}

const router = useRouter()
const onClickLeft = () => {
  if (prop.back) return prop.back()
  if (history.state?.back) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>
<template>
  <van-nav-bar
    fixed
    left-arrow
    :title="title"
    :right-text="rightText"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  ></van-nav-bar>
</template>
<style scoped lang="scss">
:deep() {
  .van-nav-bar {
    &__arrow {
      color: var(--cp-text1);
    }
    &__title {
      font-size: 15px;
    }
  }
}
</style>
