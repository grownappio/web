import React, { useEffect, useRef, useState } from 'react'
import Emoji from './Emoji'

import expressionImg from '@/assets/img/growDetail/expression.svg'
import { isAndroid, isIOS } from '@/units/platform'
import SeedButton from '../SeedButton'
import { myMessage } from '../Message'
import { getImgSrc } from '@/units'

type Props = Partial<{
  placeholder: string
  onConfirm(input: HTMLDivElement, text: string): Promise<any>
  onSucceed(): void
  className: string
}>

const tabs = [
  { value: 'emoji', icon: expressionImg }
]

const formatInputCon = (input: HTMLElement) => {
  let html = input.innerHTML
  html = html.replace(/<img.*?(?:>|\/>)/gi, (val) => {
      if (val.indexOf('icon') === -1) return val
      if (val.indexOf('icon') !== -1 && val.indexOf('icon') !== 9) return ''
      let unicode = val.match(/unicode=['"]?(.*?)['"]/i)![1]
      return unicode
  })
  return html
}

const RichInput = (props: Props) => {
  const elRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState('')
  const panel = useState('')

  const isDiabled = !(inputRef.current?.textContent?.trim().length || getImgSrc(value).length)

  function onInput() {
    setValue(inputRef.current!.innerHTML)
  }

  function onBlur() {

  }

  function onFocus(e: any) {
    
  }

  let text: string

  function onBeforeRequest() {
    let html = inputRef.current!.innerHTML
		if (html.replace(/<img.*?(?:>|\/>)/gi, '').length >= 1000) {
				myMessage({ type: 'warn', message: 'Over the word limit' })
				return false
		}
		text = formatInputCon(inputRef.current!)
		text = document.createRange().createContextualFragment(text).textContent?.trim()!
		text = text.replaceAll('<', '&lt;').replaceAll('>', '&gt;')
		if (!text) return false
    
    return true
  }

  async function onConfirm() {
    return await props.onConfirm?.(inputRef.current!, text)
  }

  function onClick(e: Event) {
    e.stopPropagation()
    // e.preventDefault()
    inputRef.current!.blur()
    panel[1]('')
    ;(elRef.current!.querySelector('#panel')! as HTMLElement).style.display = 'none'
    inputRef.current!.focus()
  }

  function onIconClick(e: any) {
    if (e.value === panel[0]) {
      panel[1]('')
      ;(elRef.current!.querySelector('#panel')! as HTMLElement).style.display = 'none'
      inputRef.current!.focus()
    } else {
      panel[1](e.value)
      ;(elRef.current!.querySelector('#panel')! as HTMLElement).style.display = ''
      inputRef.current!.blur()
    }
  }

  useEffect(() => {
    inputRef.current!.addEventListener('touchstart', onClick, { passive: false })
    inputRef.current!.addEventListener('touchend', e => (e.stopPropagation(), e.preventDefault()), { passive: false })
  }, [])

  useEffect(() => {
    inputRef.current!.focus()
    // autoAnimate(elRef.current!, { duration: 300 })
    if (isIOS) window.addEventListener('focusin', onResize)
    if (isAndroid) window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('focusin', onResize)
    }
  }, [])
  
  function onResize() {
    // scrollIntoViewIfNeeded
    // if (document.activeElement === inputRef.current) {
    //   setTimeout(() => {
    //     // elRef.current!.scrollIntoView(true)
    //     elRef.current!.querySelector('#bottom')!.scrollIntoView()
    //   }, 100);
    // }
  }

  useEffect(() => {
    setTimeout(() => {
      // elRef.current?.querySelector('#bottom')!.scrollIntoView()
    }, 100);
  }, [panel])

  function onPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    // 获取剪贴板数据
    const text = e.clipboardData.getData('text/plain');
    // 过滤 HTML 标记
    const doc = new DOMParser().parseFromString(text, "text/html");
    const sanitizedText = doc.body.textContent || ""
    // 在元素中插入过滤后的纯文本
    document.execCommand("insertText", false, sanitizedText);
  }

  return (
    <div ref={elRef} className={`bg-white !transform-none !top-[unset] ${props.className}`}>
      {/* textarea */}
      <div
        ref={inputRef}
        className='!top-[unset] py-14 px-16 bg-white before:opacity-30 empty:before:content-[attr(placeholder)] leading-1.5 min-h-[4.5em] outline-none box-content'
        placeholder={props.placeholder}
        contentEditable
        onInput={onInput}
        onPaste={onPaste}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      {/* toolbar */}
      <div className='!top-[unset] flex items-center px-16 h-50 bg-[#F5F6F7] b-t-1 border-text/5'>
        { tabs.map(e => <img key={e.value} className='w-32 h-32 rounded-full active-shadow' src={expressionImg} onClick={() => onIconClick(e)} />) }
        <SeedButton className='btn-primary w-64 h-30 ml-auto' disabled={isDiabled} animated onBeforeRequest={onBeforeRequest} onRequest={onConfirm} onSucceed={props.onSucceed}>Reply</SeedButton>
      </div>

      {/* panel */}
      <div id='panel'>
        { panel[0] === 'emoji' && <Emoji className='!top-[unset]' inputRef={inputRef} onSelect={() => onInput()} /> }
      </div>
      <div id='bottom' className='h-0' />
    </div>
  )
}

export default RichInput