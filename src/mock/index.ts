// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Mock from 'mockjs'

export default [
  {
    url: '/test',
    method: 'GET',
    timeout: 500,
    response: () => {
      return {
        code: 10000,
        message: '模拟数据成功',
        data: [1]
      }
    }
  }
]
