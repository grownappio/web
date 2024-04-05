import React, {useState} from "react";
import styles from "./index.module.less";

let tempList:{id:number,content:string}[]=[]
const List=()=>{
    const [listArr,setListArr]=useState<{id:number,content:string}[]>()
    const handerAdditem=()=>{
        for (let i = 0; i < 222; i++) {
            tempList.push(
                {
                    id:i,
                    content:`${i}天上天下唯朕独尊`
                }
            )
        }
    }

    return(
        <div className={styles['list-body']}>
            <div className={styles['list-content']}
            >
            {
                listArr?.map((item,index)=>{
                    console.log('----------index',index)
                    return(
                        <span key={index}>{item.content}</span>
                    )
                })
            }
            </div>
            <div  onClick={(e)=>{
                handerAdditem()
                setListArr(tempList)
            }}>上拉加载</div>
        </div>
    )
}
export default List