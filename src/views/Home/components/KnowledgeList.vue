<script setup lang="ts">
import { getKnowledgePage } from '@/services/consult'
import type { KnowledgeList, KnowledgeParams, KnowledgeType } from '@/types/consult'
import KnowledgeCard from '@/views/Home/components/KnowledgeCard.vue'

import { ref } from 'vue'

const props = defineProps<{
  type: KnowledgeType
}>()

const list = ref<KnowledgeList>([])
const loading = ref(false)
const finished = ref(false)
const params = ref<KnowledgeParams>({
  type: props.type,
  current: 1,
  pageSize: 10,
})
const onLoad = async () => {
  const res = await getKnowledgePage(params.value)
  list.value.push(...res.data.rows)
  if (params.value.current >= res.data.pageTotal) {
    finished.value = true
  } else {
    params.value.current++
  }
  loading.value = false
}
</script>

<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <knowledge-card v-for="(item, index) in list" :key="index" :item="item"></knowledge-card>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
