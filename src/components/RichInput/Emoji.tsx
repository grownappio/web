import React, { RefObject, forwardRef, memo, useRef, Ref, useState, useEffect } from 'react'

import BSImg from '@/assets/img/bs.svg'
import { sleep } from '@tanstack/query-core/build/lib/utils'

const ms = require.context('@/assets/emoji/icon', false)

// emoji 图标
export const EMOJIS = ms.keys().reduce((o, e) => {
  const [name] = e.split('/').at(-1)!.split('.')
  o[name] = ms(e)
  return o
}, {} as Record<string, string>)

// ==========================================================================================================

export function getImg(code: string, src: string) {
  return `<img  id='icon' src='${src}' unicode='${code}' alt='${code}' class='iconImgDiv' />`
}

type Props = {
  inputRef?: RefObject<HTMLDivElement> | (() => HTMLDivElement | undefined)
  className?: string
  onSelect?(code: string, src: string): void
}

const range = {value:null as Range | null}

const Emoji = (props: Props) => {
  const unref = (e: Props['inputRef']) => typeof e === 'function' ? e() : e?.current
  // const [range] = useState<{value: Range | null}>({ value: null })
  
  function onSelect(code: string, src: string) {
    const input = unref(props.inputRef)
    if (input) {
      input.focus()
      const sel = window.getSelection()!
      let _range = sel.getRangeAt(0)
      _range.deleteContents()
      const frag = document.createRange().createContextualFragment(getImg(code, src))
      const img = frag.firstChild!
      
      _range.insertNode(img)
      _range.setStartAfter(img)
      range.value = _range
      input.blur()
    }
    props.onSelect?.(code, src)
  }

  async function onBs() {
    const input = unref(props.inputRef)
    if (!input) return
    // const range = window.getSelection()?.getRangeAt(0)!
    const _range = range.value
    if (!_range) return
    if (_range.startOffset === 0) return
    // const prev = _range.startOffset > 1 ? _range.startContainer : _range.startContainer.parentElement
    const prev = _range.startContainer.nodeType === Node.ELEMENT_NODE ? _range.startContainer.childNodes[_range.startOffset - 2] : _range.startContainer
    console.log(_range.startOffset, prev, _range.cloneRange());
    
    _range.setStart(_range.startContainer, _range.startOffset - 1)
    _range.deleteContents()
    console.log(_range.cloneRange());
    window.getSelection()?.removeAllRanges()
    const r = document.createRange()
    r.setStartAfter(prev)
    // r.setStart(prev, prev.length)
    window.getSelection()?.addRange(r)
    range.value = r.cloneRange()
    console.log(range.value.startContainer);
  } 
  
  useEffect(() => {
    // range.value = 
    const input = unref(props.inputRef)
    if (!input) return
    const onInput = () => range.value = window.getSelection()!.getRangeAt(0)
    input.addEventListener('input', onInput)
    return () => input.removeEventListener('input', onInput)
  }, [unref(props.inputRef)])
  
  return (
    <div className={props.className}>
      <div className='grid grid-cols-4 p-24 gap-32 overflow-auto'>
        {
          Object.entries(EMOJIS).map(([code, src]) => (
            <img key={code} src={src} alt={code} onClick={() => onSelect(code, src)} />
          ))
        }
      </div>
      {/* todo */}
      {/* <div className='px-16 text-right bg-[#F5F6F7]'>
        <img className='p-6 w-36 h-36 opacity-60 active-bg' src={BSImg} alt='' onClick={onBs} />
      </div> */}
    </div>
  )
}

export default memo(Emoji)