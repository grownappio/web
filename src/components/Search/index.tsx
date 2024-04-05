import React, { useState} from "react";
import styles from "./index.module.less";
const Search=(props: {Width?:number,searchAction?:Function})=>{
    const {searchAction,Width=220} = props;
    const [optionItems,setOptions]=useState<{id:number|string,content:number|string,color:string}[]>()
    const [showOption,setShowOption]=useState<boolean>(false)
    const handelSearchAction=(value:any)=>{
        searchAction?.(value)
        const tempList:{id:number|string,content:number|string,color:string}[] = [
            {
                id: 1,
                content:'无法平静的心',
                color:''
            },
            {
                id: 2,
                content:'混账东西',
                color:''
            },
            {
                id: 1,
                content:'与日具增的功力',
                color:''
            },
            {
                id: 2,
                content:'得不到的-是最好的------------------------',
                color:''
            },
        ]
        if(tempList.length>0){
          setOptions(tempList)
        }else {
            setOptions([{
                id:0,
                content:'未搜到结果',
                color:'red'
            }])
        }
    }

    return(
        <div className={styles['search-body']}
             style={{width:Width}}
        >
         <input className={styles['search-content']}
                style={{paddingLeft:30}}
                onChange={(e)=>{handelSearchAction(e.target.value)}}
                onBlur={()=>{setShowOption(false)}}
                onFocus={()=>{setShowOption(true)}}
         />
        <div className={styles['search-result']}
        >
            {
                showOption
                &&
                optionItems?.map((item,index)=>{
                    return(
                        <span key={index}
                              style={{width: 160, overflow: "hidden", whiteSpace: "nowrap", textOverflow: 'ellipsis',color:item.color}}
                        >{item.content}</span>
                    )
                })
            }
        </div>
        </div>
    )
}
export default Search