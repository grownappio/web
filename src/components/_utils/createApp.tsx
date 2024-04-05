import React, { ReactNode } from "react"
import { createRoot } from "react-dom/client"
import { useHistory } from "react-router-dom"

type Options = {
  history?: ReturnType<typeof useHistory>
}

export function createApp(Children: ReactNode | (() => ReactNode), opt: Options = {}) {
  const div = document.createElement('div')

  const app = createRoot(div)
  // @ts-ignore
  app.render(typeof Children === 'function'? <Children /> : Children)

  document.body.append(div)

  // 监听路由
  const unlisten = opt.history?.listen(() => {
    unlisten!()
    app.unmount()
    div.remove()
  })

  let resolve: (v: unknown) => void
  const unmounted = new Promise(s => resolve = s)

  return {
    unmount() {
      resolve(undefined)
      app.unmount()
      div.remove()
    },
    unmounted
  }
}