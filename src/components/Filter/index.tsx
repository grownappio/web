import React, { Fragment, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { copy, isSelected, remove, toggle } from '@/units'
import { Popup } from 'antd-mobile'
import { NativeProps, withNativeProps } from 'antd-mobile/es/utils/native-props'
import autoAnimate from '@formkit/auto-animate'

import filterIcon from './filter.svg'
import { CloseCircleOutlined } from '@ant-design/icons'

type Option = {
  label: string
  value: any
}

type Props = {
  value: Record<string, any[]>
  items: { label: string; value: any; options: Option[] }[]
  onChange(val: Props['value']): void
} & NativeProps

const Filter = (props: Props) => {
  const elRef = useRef<HTMLDivElement>(null)
  const initial = useMemo(() => copy(props.value), [])
  const [val, setVal] = useState(copy(props.value))

  const allSelected = (val: typeof props.value) =>
    Object.entries(val)
    .map(([k, v]) => (
      v.map(cell => (
        props.items.find(e => e.value === k)?.options.find(e => e.value === cell)
      ))
    ))
    .flat()

  const [, update] = useReducer(x => x + 1, 0)

  const [visible, setVisible] = useState(false)

  function show() {
    setVal(JSON.parse(JSON.stringify(props.value)))
    setVisible(true)
  }

  function onConfirm() {
    props.onChange(val)
    setVisible(false)
  }

  useEffect(() => {
    setVal(JSON.parse(JSON.stringify(props.value)))
  }, [props.value])

  useEffect(() => {
    const ain = autoAnimate(elRef.current!)
    return () => ain.destroy?.()
  }, [elRef.current])

  return (
    <>
      {
        withNativeProps(props,
          <div ref={elRef} className='flex space-x-8 pt-4 overflow-auto [&>*]:shrink-0 scrollbar-hidden'>
            <div className='flex-center py-5 px-12 leading-[1] rounded-6 b-1 border-text/8 text-primary active-shadow' onClick={show}>
              <img className='mr-6 w-20 h-20' src={filterIcon} alt='' />
              Filter
            </div>
            {
              Object.entries(props.value).map(([k, v]) => (
                v.map(e => (
                  <div key={k+e} className='relative py-5 px-15 b-1 text-primary border-primary rounded-6'>
                    { props.items.find(e => e.value === k)?.options.find(opt => opt.value == e)?.label ?? e }
                    <CloseCircleOutlined className='absolute top-0 right-0 translate-x-4 -translate-y-4 text-16 rounded-full bg-white' onClick={() => {remove(val[k], e); props.onChange(val)}} />
                  </div>
                ))
              ))
            }
          </div>
        )
      }

      <Popup visible={visible} position='top' bodyClassName='px-16 pb-16' closeOnMaskClick onClose={() => setVisible(false)}>
        {
          props.items.map(({ label, value: k, options }) => (
            <Fragment key={k}>
              <div className='font-medium mt-14 mb-10' key={k}>{ label }</div>
              <div className='flex flex-wrap -mr-8 -mb-8'>
                {
                  options.map(e => (
                    <div key={e.value} className={`mr-8 mb-8 py-5 px-15 b-1 text-text/60 border-text/8 rounded-6 active-shadow ${val[k]?.includes(e.value) && '!border-primary !text-primary'}`} onClick={() => {val[k] = toggle(val[k], e.value); update()}}>
                      { e.label }
                    </div>
                  ))
                }
              </div>
            </Fragment>
          ))
        }

        <div className='flex items-center mt-24'>
          <button className='btn-outline flex-1 py-14 text-16 font-semibold outline-text/8 text-text' onClick={() => setVal(JSON.parse(JSON.stringify(initial)))}>Reset</button>
          <button className='btn-primary flex-1 py-14 ml-16 text-16 font-semibold' onClick={onConfirm}>
            Confirm <span>{allSelected(val).length ? `(${allSelected(val).length})` : ''}</span>
          </button>
        </div>
      </Popup>
    </>
  )
}

export default Filter