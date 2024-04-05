import React, { useMemo, useRef, useCallback } from 'react';
import uploadImageIcon from "@/assets/img/publish/upload-image.svg";
import imgDelIcon from "@/assets/img/publish/img-del.svg";
import UploadImage from "@/components/UploadImage";
import styles from './index.module.less';
// 每行多少列
const COLUMN = 3;
// 每个元素宽度
const WIDTH = 80;
// 每个元素高度
const HEIGHT = 80;
// 图片左右 padding
const IMAGE_PADDING = 14;
interface ListItem {
  id: number;
  name: string;
  image: string;
}
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
export type DropPageProps = {
  showList: any[];
  setShowList: (value: any[]) => void;
  delImg: (index: number) => void;
  addImg: (value: any) => void;
}
const DragAndDropPage = (props: DropPageProps) => {
  const { showList = [], setShowList, addImg, delImg } = props;
  // const [list, setList] = useState<any[]>(showList);
  const dragItemRef = useRef<ListItem>();
  const dropAreaRef = useRef<HTMLDivElement>(null);

  const sortedList = useMemo(() => {
    return showList.slice().sort((a: any, b: any) => {
      return a.id - b.id;
    });
  }, [showList]);

  const listHeight = useMemo(() => {
    const size = showList.length + 1;
    return Math.ceil(size / COLUMN) * (HEIGHT + 10);
  }, [showList]);

  const handleDragStart = (e: any, data: ListItem) => {
    console.log(e)
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
        const fromIndex = showList.indexOf(dragItem);
        if (fromIndex < currentIndex) {
          // 从前往后移动
          currentIndex++;
        }
        const currentItem = showList[currentIndex];
        const ordered = insertBefore(showList, dragItem, currentItem);
        if (isEqualBy(ordered, showList, 'id')) {
          return;
        }
        setShowList(ordered);
      }
    },
    [showList]
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
      <div className={styles.list} style={{ height: listHeight }}>
        {sortedList.map((item: any) => {
          const index = showList.findIndex((i: any) => i === item);
          const row = Math.floor(index / COLUMN);
          const col = index % COLUMN;
          return (
            <div
              draggable={true}
              key={item.id}
              className={styles.item}
              style={{
                height: HEIGHT,
                left: col * (WIDTH + IMAGE_PADDING),
                top: row * (HEIGHT + 15),
                marginRight: `${IMAGE_PADDING}px`,
              }}
              data-id={item.id}
              onDragStart={(e) => handleDragStart(e, item)}
            >
              <img src={item.image} alt={item.name} width={WIDTH} />
              <img onClick={() => {
                delImg(index)
              }} className={styles['del-img']} src={imgDelIcon} alt="" />
            </div>
          );
        })}
        {
          showList.length < 9
          &&
          // <Draggable key={imgList.length} draggableId={`index`} index={imgList.length} isDragDisabled>
          <div style={{
            height: HEIGHT,
            left: showList.length % COLUMN * (WIDTH + IMAGE_PADDING),
            top: Math.floor(showList.length / COLUMN) * (HEIGHT + 15),
            marginRight: `${IMAGE_PADDING}px`,
          }}
          className={styles['upload-btn']}
          onClick={() => UploadImage().then(addImg)}
          >
            <img src={uploadImageIcon} alt="" />
          </div>
          // </Draggable>
        }
      </div>
    </div>
  );
};
export default React.memo(DragAndDropPage);