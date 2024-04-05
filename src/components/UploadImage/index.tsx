import { message } from 'antd'
import ApiRequest from '@/units/request'

function fileSelect() {
  return new Promise<FileList | null>((resolve) => {
    const input = document.createElement('input')
    input.accept = 'image/*'
    input.type = 'file'
    input.onchange = () => {
      resolve(input.files)
    }
    input.click()
  })
}

const uploadImage = async () => {
  const files = (await fileSelect())!

  const isLt5M = files[0].size / 1024 / 1024 < 5
  if (!isLt5M) {
    message.warning('Image must smaller than 5MB!')
    throw 'Image must smaller than 5MB!'
  }
  const formData = new FormData()
  formData.append('file', files[0])

  const res = await ApiRequest({ url: 'app/file/upload', method: 'POST', data: formData })
  return res.data.url as string
}

export default uploadImage
