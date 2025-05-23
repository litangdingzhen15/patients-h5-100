import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

import { createHtmlPlugin } from 'vite-plugin-html'

import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig({
  server: {
    // * 捕获consult-patients.itheima.net地址与80端口，映射到本机地址
    port: 80,
    host: '0.0.0.0',
    allowedHosts: ['consult-patients.itheima.net'],
  },
  plugins: [
    viteMockServe({
      // 在哪个文件里编写模拟接口
      mockPath: './src/mock',
      // 开发环境开启mock
      localEnabled: true
    }),
    createHtmlPlugin(),
    vue(),
    vueDevTools(),
    // 自动导入的插件，解析器可以是 vant element and-vue
    Components({
      dts: false, // * 避免重复生成文件
      // * 原因：Toast Confirm 这类组件的样式还是需要单独引入，样式全局引入了，关闭自动引入
      resolvers: [VantResolver({ importStyle: false })],
    }),
    createSvgIconsPlugin({
      // 指定图标文件夹，绝对路径（NODE代码）
      iconDirs: [path.resolve(process.cwd(), 'src/icons')],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
