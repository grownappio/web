import request from '@/units/request'
import { delay as sleep } from "@/units";
import { useMemo, useState } from 'react'

type Obj = Record<string, any>
type Mixin<T> = Partial<T> & Obj

type Config<T, Q> = {
  url: string
  list?: (data?: any) => T[] | null
  total?: (data: any, query: Q & Obj) => number
  hasMore?: (data: any, query: Q & Obj) => boolean
  numKey?: string
  sizeKey?: string
  delay?: number
};

const get = (data: any, path: string) => path.split('.').reduce((o, k) => o?.[k], data)
const set = (data: any, path: string, val: any) => path.split('.').reduce((o, k, i, arr) => (i === arr.length - 1 ? (o[k] = val) : o[k]), data)
const copy = <T>(data: T): T => JSON.parse(JSON.stringify(data))

export function useGetList<T = any, Q = Obj>(query: Q & Obj, config: Config<T, Q>) {
  const _total = config.total ?? ((data: any) => data?.num)
  const _list = config.list ?? ((data: any) => data?.list)
  const numKey = config.numKey ?? 'page_num', sizeKey = config.sizeKey || 'page_size'
  // 
  const initial = useMemo(() => copy(query), [])
  const [list, setList] = useState([] as T[])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [res, setRes] = useState<any>()
  const empty = useMemo(() => list.length === 0 && !loading, [list, loading])
  const hasMore = useMemo(() => config.hasMore ? config.hasMore(res?.data, query) : !empty && total > get(query, numKey) * get(query, sizeKey), [res, total, empty, get(query, numKey), get(query, sizeKey)])

  // 可打断
  const interruptible = useMemo(() => ({
    interrupt() { this._reject(); return Promise.all(this._queue.map(e => e.catch(() => {}))) },
    value: Promise.resolve<any>(null),
    _reject: () => {},
    _queue: [] as Promise<any>[],
    gen() { this.value = new Promise((s, j) => this._reject = j ); return this },
    promise<T>(e: Promise<T>) { return this.aaa(Promise.race([e, this.value])) },
    aaa<T>(a: Promise<T>) { this._queue.push(a); return a }
  }), [])
  
  // 请求列表
  const getList = (data: Q) => request({ url: config.url, method: 'POST', data })

  const post = (data: Partial<Q>) => {
    setLoading(true)
    Object.assign(query, data)
    return interruptible
      // @ts-ignore
      .promise(Promise.all([getList(data), sleep(config.delay)]))
      .then(e => e![0])
      .then((res) => {
        setRes(res)
        setTotal(_total(res.data, query))
        return _list(res.data) ?? []
      })
      .finally(() => {
        setLoading(false)
      })
  }
  // 重置分页
  const resetPage = async (data?: Mixin<Q>) => {
    await interruptible.interrupt()
    setRefreshing(true)
    data = { ...query, ...data }
    set(data, numKey, get(initial, numKey))
    set(data, sizeKey, get(initial, sizeKey))
    return interruptible
      .gen()
      .promise(post(data))
      .then(setList)
      .catch(() => {})
      .finally(() => setRefreshing(false))
  }
  // 刷新
  const refresh = async () => {
    await interruptible.interrupt()
    setRefreshing(true)
    return interruptible
      .gen()
      .promise(post(copy(initial)))
      .then(setList)
      .catch(() => {})
      .finally(() => setRefreshing(false))
  }
  // 加载更多
  const loadmore = async () => {
    if (!hasMore || loading) return
    await interruptible.interrupt()
    setLoadingMore(true)
    set(query, numKey, get(query, numKey) + 1)
    return interruptible
      .gen()
      .promise(post(query))
      .then(arr => (list.push(...arr), setList([...list]), setLoadingMore(false), arr))
      .catch(() => {})
  }

  return { list, setList, res, hasMore, empty, loading, refreshing, loadingMore, resetPage, refresh, loadmore }
}