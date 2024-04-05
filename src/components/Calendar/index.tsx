import { CalendarProps, Popup, Calendar as _Calendar } from 'antd-mobile'
import React, { ReactNode, useState } from 'react'

type Props = Partial<{
  value: CalendarProps['value']
  selectionMode: CalendarProps['selectionMode']
  onChange: CalendarProps['onChange']
  children: ReactNode
}>

const Calendar = ({ children, ...props }: Props) => {
  const [vis, setVis] = useState(false)

  return <>
    <div onClick={() => setVis(true)}>{ children }</div>
    <Popup visible={vis} bodyClassName='p-12' onClose={() => setVis(false)} position='bottom' closeOnMaskClick>
      {/* @ts-ignore */}
      <_Calendar {...props} onChange={(...args) => {props.onChange?.(...args); setVis(false);}} />
    </Popup>
  </>
}

export default Calendar