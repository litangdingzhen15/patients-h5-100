import cpNavBar from '@/components/cpNavBar.vue'
import cpIcon from '@/components/cpIcon.vue'

declare module 'vue' {
  interface Globalcompents {
    cpNavBar: typeof cpNavBar
    cpIcon: typeof cpIcon
  }
}
