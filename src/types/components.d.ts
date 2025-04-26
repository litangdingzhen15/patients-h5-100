import cpNavBar from '@/components/cpNavBar.vue'
import cpIcon from '@/components/cpIcon.vue'
import cpRadioBtn from '@/components/cpRadioBtn.vue'


declare module 'vue' {
  // * 为自定义组件添加类型
  interface Globalcompents {
    cpNavBar: typeof cpNavBar
    cpIcon: typeof cpIcon
    cpRadioBtn: typeof cpRadioBtn
  }
}
