import cpNavBar from '@/components/cpNavBar.vue'
import cpIcon from '@/components/cpIcon.vue'
import cpRadioBtn from '@/components/cpRadioBtn.vue'


declare module 'vue' {
  interface Globalcompents {
    cpNavBar: typeof cpNavBar
    cpIcon: typeof cpIcon
    cpRadioBtn: typeof cpRadioBtn
  }
}
