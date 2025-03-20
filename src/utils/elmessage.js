import { ElMessage } from 'element-plus'

export const openMessage = (message, type) => {
  if (type === 'success'){
    ElMessage.success({
      message: message,
      type: type
    })
  }else {
    ElMessage.error({
      message: message,
      type: type
    })
  }
}
