import { getUrlHashParam } from "@/units";
import { queueJob } from "@/units/scheduler";
import { useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

const proxyMap = new WeakMap()

const map = {
  number: (e: any) => parseInt(e),
  object: (e: any) => e && typeof e === 'string' ? JSON.parse(e) : e,
  boolean: (e: any) => e && e !== 'false' ? true : false
}

const stringify = (val: any) => typeof val === 'string' ? val : JSON.stringify(val)

// url query 双向绑定
export function useSearchQuerys<T extends Record<string, any>>(init?: T): T & Record<string, any> {
  const history = useHistory()
  const cached = useMemo(() => ({}), []) as any
  return useMemo(() => {
    const querys = { ...init, ...getUrlHashParam(decodeURIComponent) }
    const _setQuery = () => setQuery(history, querys)
    const queueQuery = () => queueJob(_setQuery)
    return new Proxy(querys, {
      get(o, k: string, r) {
        let val = Reflect.get(o, k, r)
        if (cached[k]?.[0] === val) {
          val = cached[k]?.[1]
        } else {
          val = init?.[k] != null
            // @ts-ignore
            ? map[typeof init![k]]?.(val) ?? val
            : val || init?.[k]
          val = val && typeof val === 'object' ? deepSetter(val, queueQuery) : val
          cached[k] = [stringify(val), val]
        }
        return val
      },
      set(o, k: string, val, r) {
        if (o[k] === val) return true
        cached[k] = [stringify(val), val]
        queueQuery()
        return Reflect.set(o, k, val, r)
      }
    })
  }, [useLocation()])
}

// 深度监听
function deepSetter<T extends Record<string, any>>(o: T, cb: () => void) {
  if (proxyMap.has(o)) return proxyMap.get(o)
  const proxy = new Proxy(o, {
    get(o, k: string, r) {
      let val = Reflect.get(o, k, r)
      if (val && typeof val === 'object') val = deepSetter(val, cb)
      return val
    },
    set(o, k: string, val, r) {
      cb()
      console.log(o, k ,val);
      return Reflect.set(o, k, val, r)
    }
  })
  proxyMap.set(o, proxy)
  return proxy
}

// 设置 url query
function setQuery(history: ReturnType<typeof useHistory>, query: any) {
  const usp = new URLSearchParams(history.location.search.slice(1))
  for (const key in query) {
    usp.set(key, stringify(query[key]))
  }
  history.replace({ search: '?' + usp.toString() })
}