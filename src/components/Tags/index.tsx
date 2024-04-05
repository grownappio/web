import { remove } from '@/units'
import { CloseOutlined } from '@ant-design/icons'
import { NativeProps, withNativeProps } from 'antd-mobile/es/utils/native-props'
import React from 'react'
import { Prompt } from '../_utils/Confirm'

type Props = Partial<{
  value: string[]
  closable: boolean
  addable: boolean
  onChange: (list: string[]) => void
}> & NativeProps

const Tags = ({ onChange, ...props }: Props) => {
  async function onAdd() {
    const val = await Prompt('Input Label', { placeholder: 'Add new label' })
    onChange?.([...props.value!, val])
  }

  return withNativeProps(props,
    <div {...props} className='flex text-primary space-x-8 font-medium whitespace-nowrap'>
      {props.value?.map((e, i) => <div key={i} className='flex items-center py-6 px-14 b-1 border-primary rounded-4'>{ e } <CloseOutlined className='pl-8 text-10' onClick={() => onChange?.(remove(props.value!.slice(), e))} /></div>)}
      {props.addable && <div className='flex items-center py-6 px-14 b-1 border-primary rounded-4 active-shadow' onClick={onAdd}>Add +</div>}
    </div>
  )
}

export default Tags