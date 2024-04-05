import React, { Fragment, useMemo } from "react";
import EmptyImg from '@/assets/img/empty.svg'
import BLoadingImg from '@/assets/img/bottom-loading.gif'
import { Empty, ErrorBlock, InfiniteScroll, Skeleton } from "antd-mobile";

interface ScrollProps<T> {
  list?: T[]
  item?: (e: T, i: number) => React.ReactNode
  itemKey?: keyof T
  empty?: React.ReactNode | boolean
  hasMore?: boolean
  loadingMore?: boolean
  refreshing?: boolean
  onLoadmore?: () => Promise<any>
  className?: string
  style?: React.CSSProperties | undefined
  [k: string]: any
  children?: any
}

const Scroll = <T,>(props: ScrollProps<T>) => {

  const loading = props.refreshing || props.loadingMore

  return (
    <div className={props.className} style={props.style}>
      {/* List */}
      { !props.refreshing && props.list && props.list.map((e, i) => <Fragment key={i}>{props.item!(e, i)}</Fragment>) }
      {/* Children */}
      { !props.refreshing && props.children }
      {/* skeleton */}
      { props.refreshing && <><Skeleton.Title animated /><Skeleton.Paragraph lineCount={5} animated /></> }
      {/* Empty */}
      { !loading && props.empty === true ? <wc-fill-remain class='flex-center'><ErrorBlock image={EmptyImg} title='No imformation temporary' description='' style={{'--image-height': '140px'}} /></wc-fill-remain> : props.empty }

      {
        (props.onLoadmore && !props.empty)
        &&
        <InfiniteScroll hasMore={!!props.hasMore} loadMore={props.onLoadmore!}>
          {/* bottom-loading */}
          { props.loadingMore ? <img className="my-12 mx-auto block" src={BLoadingImg} alt="" /> : undefined }
          {/* No more */}
          { !props.hasMore && !props.empty && !props.refreshing && !props.loadingMore && <div className="opacity-40 text-center text-[#112438]">No more content</div> }
        </InfiniteScroll>
      }
    </div>
  )
}

export default Scroll