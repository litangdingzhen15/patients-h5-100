import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate' // * pinia本地持久化插件

const pinia = createPinia()
pinia.use(persist) // * 注册持久化插件

export default pinia

export * from './modules/user'
export * from './modules/consult'
