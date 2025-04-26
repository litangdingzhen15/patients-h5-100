<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { loginByPassword, sendMobileCode, loginByMobile } from '@/services/user'
import { mobileRules, passwordRules, codedRules } from '@/utils/rules'
import { showSuccessToast, showToast, type FormInstance } from 'vant'
import { onUnmounted, ref } from 'vue'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'

const mobile = ref('')
const password = ref('')
const agree = ref(false)
const isPass = ref(true)
const code = ref('')

const route = useRoute()
const router = useRouter()

const store = useUserStore()
const onSubmit = async () => {
  if (!agree.value) return showToast('请勾选协议')
  const res = isPass.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginByMobile(mobile.value, code.value)
  store.setUser(res.data)
  showSuccessToast('登录成功')
  router.replace((route.query.returnUrl as string) || '/user')
}

const form = ref<FormInstance>()
const time = ref(0)
let timer: number
const onSend = async () => {
  if (time.value > 0) return
  await form.value?.validate('mobile')
  await sendMobileCode(mobile.value, 'login')
  showToast('发送成功')
  time.value = 60
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    time.value--
    if (time.value <= 0) clearInterval(timer)
  }, 1000)
}

const show = ref(false)

onUnmounted(() => {
  clearInterval(timer)
})
/* onMounted(() => {
  request(import.meta.env.VITE_APP_CALLBACK+'/test').then((res) => {
    console.log(res)
  })
}) */

const url = `https://graph.qq.com/oauth2.0/authorize?client_id=102015968&response_type=token&scope=all&redirect_uri=${encodeURIComponent(import.meta.env.VITE_APP_CALLBACK)}/login/callback`
</script>

<template>
  <div class="login-page">
    <cp-nav-bar right-text="注册" @click-right="$router.push('/register')"></cp-nav-bar>
    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;">
        <span @click="isPass = !isPass">{{ isPass ? '短信验证码登录' : '密码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 表单 -->
    <van-form autocomplete="off" @submit="onSubmit" ref="form">
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        type="tel"
        v-model="mobile"
        :rules="mobileRules"
      ></van-field>
      <van-field
        v-if="isPass"
        placeholder="请输入密码"
        :type="show ? 'text' : 'password'"
        v-model="password"
        :rules="passwordRules"
      >
        <template #button>
          <cp-icon
            @click="show = !show"
            :name="`login-eye-${show ? 'off' : 'on'}`"
            style="margin-right: 10px"
          ></cp-icon>
        </template>
      </van-field>
      <van-field v-else placeholder="短信验证码" v-model="code" :rules="codedRules">
        <template #button>
          <span class="btn-send" :class="{ active: time > 0 }" @click="onSend">{{
            time > 0 ? `${time}s后再次发送` : '发送验证码'
          }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit">登 录</van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>

    <!-- 底部 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <a @click="store.setReturnUrl(route.query.returnUrl as string)" class="icon" :href="url">
        <img src="@/assets/qq.svg" alt="" />
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/login.scss' as *;
</style>
