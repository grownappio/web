import React, { InputHTMLAttributes, ReactNode, memo, useEffect, useState } from 'react'
import { NativeProps, withNativeProps } from "antd-mobile/es/utils/native-props"
import { CloseCircleFilled } from '@ant-design/icons';
import { castArray } from '@/units';
import { Field } from 'rc-field-form';
// import Schema from 'async-validator'

import eye1Img from './eye1.svg'
import eye2Img from './eye2.svg'

type FieldProps = Parameters<typeof Field>[0]

type Props = Assign<InputHTMLAttributes<HTMLInputElement>, Partial<{
  label: ReactNode
  value: string
  name: string
  clearable: boolean
  right: ReactNode | ((v: string) => ReactNode)
  onInput(s: string): void
  onChange(s: string): void
  validator(s: string): Promisable<any>
  rules: FieldProps['rules']
  trigger: Arrayable<'onChange' | 'onBlur'>
}> & NativeProps>

const Input = (props: Props) => {
  const [error, setError] = useState('')
  const [val, setVal] = useState({ value: props.value || '' })
  const [focused, setFocused] = useState<any>(false)
  const [type, setType] = useState(props.type)

  const triggers = castArray(props.trigger || ['onChange', 'onBlur'])

  function onChange(type: string, e: React.FormEvent<HTMLInputElement>) {
    // @ts-ignore
    val.value = e.target.value
    // @ts-ignore
    props[type]?.(val.value)

    if (triggers.includes('onChange')) validate()
  }

  function onBlur() {
    if (triggers.includes('onBlur')) validate()
  }

  function onClear() {
    props.onInput?.('')
    props.onChange?.('')
    val.value = ''
    setError('')
  }

  async function validate() {
    if (!props.validator) return
    const handle = (error: unknown) => setError(
      typeof error === 'string' ? error :
      error instanceof Error ? error.message :
      ''
    )
    try {
      handle(await props.validator?.(val.value))
    } catch (e) {
      handle(e)
    }
  }

  const onMetaChange: FieldProps['onMetaChange'] = ({ errors }) => {
    setError(errors[0])
  }

  useEffect(() => {
    setVal({ value: props.value || '' })
  }, [props.value])

  return withNativeProps(props,
    <div
      className={`
        relative flex items-center mt-10 mb-32 px-16 b-1
        border-text/8 rounded-8
        ${!error && focused && '!border-primary !text-primary'}
        ${error && '!border-[#FF3D00] !text-[#FF3D00]'}
      `}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
  
      {/* label */}
      { !!props.label && <div className='label absolute left-0 top-0 px-8 -translate-y-[1em] translate-x-8 bg-white'>{ props.label }</div> }
      
      {
        ((children: any) => (
          props.name
            ? <Field name={props.name} rules={props.rules} onMetaChange={onMetaChange} validateTrigger={triggers}>{children}</Field>
            : children
        ))
        (<input className='input flex-1 w-0 text-text leading-[47px] bg-transparent placeholder:text-text/30' value={val.value} type={type} placeholder={props.placeholder} onInput={e => onChange('onInput', e)} onChange={e => onChange('onChange', e)} onBlur={onBlur} />)
      }
      
      { typeof props.right === 'function' ? props.right(val.value) : props.right }
  
      {/* clear */}
      { val.value && props.clearable && <CloseCircleFilled className='-mr-8 p-8 text-16 text-text/20' onClick={onClear} /> }
  
      {/* password eye */}
      { val.value && props.type === 'password' && <img className='-mr-4 w-24 h-24 opacity-60' src={type ? eye1Img : eye2Img} onClick={() => setType(type === 'password' ? '' : 'password')} /> }
  
      {/* error */}
      <p className='error absolute top-full left-0 bottom-0 mt-2'>{ error }</p>
    </div>
  )
}

export default memo(Input)