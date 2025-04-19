import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate' // pinia本地持久化插件

const pinia = createPinia()
pinia.use(persist)

export default pinia

export * from './modules/user'
export * from './modules/consult'
