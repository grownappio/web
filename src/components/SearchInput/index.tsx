import React from 'react'

import SearchImg from "@/assets/img/grow/tab-search.svg";
import { CloseCircleFilled } from '@ant-design/icons';
import { ReactSVG } from 'react-svg';

type InputProps = Partial<{
  clearable: boolean
  left: JSX.Element
  value: string
  placeholder: string
  onInput: (s: string) => void
  onEntry: (s: string) => void
  [k: string]: any
}>

// todo
const Input = ({ value, clearable = true, left, placeholder, onEntry, onInput, ...props }: InputProps) => {
  return (
    <div { ...props } className={'group flex flex-row items-center px-12 py-6 b-1 border-text/8 hover:border-[#34D026] hover:bg-[#34D0260A] text-[#112438] hover:text-[#34D026] ' + props.className}>
      { left || <ReactSVG className='w-20 h-20 mr-8 opacity-60 group-hover:opacity-100' src={SearchImg} /> }
      <input className='flex-1 self-stretch bg-[unset] text-[#112438]' type='search' value={value} placeholder={placeholder} onInput={e => onInput?.((e.target as HTMLInputElement).value)} onKeyDown={e => (e.key === 'Enter' && onEntry?.((e.target as HTMLInputElement).value))} />
      { value && <CloseCircleFilled className='text-16 text-[#11243833]' onClick={() => onInput?.('')} />}
    </div>
  )
}

export default Input
