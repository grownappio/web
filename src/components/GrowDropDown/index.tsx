import React, { useRef } from "react";
import styles from "./index.module.less";
import { Dropdown } from "antd-mobile";

export type TypeDropItemGrow = {
  id: number;
  title: string;
}

export type DropDownRefType = {
  close: () => void;
}

interface PropDropDown {
  list: TypeDropItemGrow[];
  title: string;
  onChange?: (value: number) => void;
}
const GrowDropDown = (props: PropDropDown) => {
  const { list, onChange, title } = props;
  const dropDownRef = useRef<DropDownRefType>(null);
  const dropDownSelect = (id: number) => {
    dropDownRef?.current?.close();
    onChange && onChange(id);
  }
  const renderDropItem = () => {
    return <div className={styles['drop-down-item-list']}>
      {
        list.map((item: TypeDropItemGrow) => {
          return (
            <div onClick={() => dropDownSelect(item.id)} key={item.id} className={styles['drop-down']}>{item.title}</div>
          )
        })
      }
    </div>
  }
  return (
    <Dropdown ref={dropDownRef} closeOnClickAway>
      <Dropdown.Item key='hot' title={title}>
        {renderDropItem()}
      </Dropdown.Item>
    </Dropdown>
  )
}

export default GrowDropDown;