import React, { useMemo, useState, useRef, useCallback } from 'react';
import styles from './index.module.less';
// 每行多少列
const COLUMN = 3;
// 每个元素宽度
const WIDTH = 120;
// 每个元素高度
const HEIGHT = 120;
// 图片左右 padding
const IMAGE_PADDING = 5;
interface ListItem {
  id: number;
  name: string;
  image: string;
}
const showList = [
  {
    id: 2,
    name: 'osmo pocket',
    image:
      'https://img1.baidu.com/it/u=3392898911,2253228200&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
  },
  {
    id: 4,
    name: 'mavic pro',
    image:
      'https://img1.baidu.com/it/u=2051155272,478750855&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
  },
  {
    id: 1,
    name: 'mavic mini2',
    image:
      'https://img2.baidu.com/it/u=3363447158,2768125899&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
  },
  {
    id: 3,
    name: '机甲大师s1',
    image:
      'https://img1.baidu.com/it/u=3338017301,3301238739&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281',
  },
  {
    id: 0,
    name: 'mavic 2',
    image:
      'https://img2.baidu.com/it/u=4115970543,1310161324&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
  },
];
// 将某元素查到数组中的某位置
export function insertBefore<T>(list: T[], from: T, to?: T): T[] {
  const copy = [...list];
  const fromIndex = copy.indexOf(from);
  if (from === to) {
    return copy;
  }
  copy.splice(fromIndex, 1);
  const newToIndex = to ? copy.indexOf(to) : -1;
  if (to && newToIndex >= 0) {
    copy.splice(newToIndex, 0, from);
  } else {
    // 没有 To 或 To 不在序列里，将元素移动到末尾
    copy.push(from);
  }
  return copy;
}

// 判断是否数组相等
export function isEqualBy<T>(a: T[], b: T[], key: keyof T) {
  const aList = a.map((item) => item[key]);
  const bList = b.map((item) => item[key]);
  let flag = true;
  aList.forEach((i, idx) => {
    if (i !== bList[idx]) {
      flag = false
    }
  })
  return flag;
}

const DragAndDropPage: React.FC = () => {
  const [list, setList] = useState(showList);
  const dragItemRef = useRef<ListItem>();
  const dropAreaRef = useRef<HTMLDivElement>(null);

  const sortedList = useMemo(() => {
    return list.slice().sort((a, b) => {
      return a.id - b.id;
    });
  }, [list]);

  const listHeight = useMemo(() => {
    const size = list.length;
    return Math.ceil(size / COLUMN) * HEIGHT;
  }, [list]);

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, data: ListItem) => {
    dragItemRef.current = data;
    const el = dropAreaRef.current?.querySelector(`[data-id="${data.id}"]`);
    if (el) {
      el.classList.add(styles.draggingItem);
    }
  }

  const handleDragEnd = useCallback(() => {
    const data = dragItemRef.current;
    if (data) {
      const el = dropAreaRef.current?.querySelector(`[data-id="${data.id}"]`);
      if (el) {
        el.classList.remove(styles.draggingItem);
      }
      dragItemRef.current = undefined;
    }
  }, []);

  const updateList = useCallback(
    (clientX: number, clientY: number) => {
      const dropRect = dropAreaRef.current?.getBoundingClientRect();
      if (dropRect) {
        const offsetX = clientX - dropRect.left;
        const offsetY = clientY - dropRect.top;
        const dragItem = dragItemRef.current;
        // 超出拖动区域
        if (
          !dragItem ||
          offsetX < 0 ||
          offsetX > dropRect.width ||
          offsetY < 0 ||
          offsetY > dropRect.height
        ) {
          return;
        }
        const col = Math.floor(offsetX / WIDTH);
        const row = Math.floor(offsetY / HEIGHT);
        let currentIndex = row * COLUMN + col;
        const fromIndex = list.indexOf(dragItem);
        if (fromIndex < currentIndex) {
          // 从前往后移动
          currentIndex++;
        }
        const currentItem = list[currentIndex];
        const ordered = insertBefore(list, dragItem, currentItem);
        if (isEqualBy(ordered, list, 'id')) {
          return;
        }
        setList(ordered);
      }
    },
    [list]
  );
  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      updateList(e.clientX, e.clientY);
    },
    [updateList]
  );
  return (
    <div
      className={styles.wrapper}
      ref={dropAreaRef}
      style={{ width: COLUMN * (WIDTH + IMAGE_PADDING) + IMAGE_PADDING }}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <ul className={styles.list} style={{ height: listHeight }}>
        {sortedList.map((item) => {
          const index = list.findIndex((i) => i === item);
          const row = Math.floor(index / COLUMN);
          const col = index % COLUMN;
          return (
            <li
              draggable={false}
              key={item.id}
              className={styles.item}
              style={{
                height: HEIGHT,
                left: col * (WIDTH + IMAGE_PADDING),
                top: row * HEIGHT,
                padding: `0 ${IMAGE_PADDING}px`,
              }}
              data-id={item.id}
              onDragStart={(e) => handleDragStart(e, item)}
            >
              <img src={item.image} alt={item.name} width={WIDTH} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default React.memo(DragAndDropPage);