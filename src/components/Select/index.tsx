import React, {useEffect, useState} from "react";
import styles from "./index.module.less";
import down  from "@/assets/img/component/down.svg"
import { NativeProps, withNativeProps } from "antd-mobile/es/utils/native-props";

type params={
    list:{
        label:any;
        value:any;
    }[]
    onChange: (value: any) => void;
    placeholder?:string;
    height:number;
    listCap:number;
    defaultValue?:any;
    zIndex?:number;
    width?:number;
    thumb?:boolean;
    close?:boolean;
} & NativeProps

const Select=(props:params)=>{
    const {close=false,thumb,zIndex,list,placeholder,height,width,listCap,defaultValue,onChange} = props;
    const [selectActive, setSelectActive] = useState<boolean>(false);
    const [currentActive, setCurrentActive] = useState<{
        label:any;
        value:any;
    }>({
        label:"",
        value:"",
    });

    function intSelect(){
        list?.forEach((item)=>{
            if(item.value===defaultValue){
                setCurrentActive(item);
            }
        })
    }

    useEffect(()=>{
        intSelect()
    },[defaultValue])

    useEffect(()=>{
        if(close){
            setSelectActive(false)
        }
    },[close])

    return withNativeProps(props,
        <div className={[styles['select-body'], selectActive ? styles.active : ''].join(' ')}
             onClick={()=>{setSelectActive(!selectActive)}}
             style={{zIndex:zIndex}}>
            <div className={styles['content']}>
                {
                    placeholder&&
                    <span className={styles['placeholder']}>{placeholder}</span>
                }
                <span className={styles['value']}>{currentActive.label}</span>
            </div>
            <img className={[ selectActive ? styles.active : ''].join(' ')} src={down} alt={''}/>
                {

                    <div className={[styles['select-options'], thumb ? '' : styles.active].join(' ')}
                        // @ts-ignore
                         style={{height:selectActive?(list?.length<=listCap ?`${height*(list?.length||0)/100}rem`:`${height*listCap/100}rem`):0,display:width?'flex':'',flexWrap:width?'wrap':'',
                         border:selectActive?'':"none"}}
                         onScroll={(e)=>{e.stopPropagation();}}>
                    {
                        list?.map((item, index) => {
                            return (
                                <div key={index + item.value + item.label}
                                     style={{height:`${height/100}rem`,width:`${width}%`}}
                                     className={[styles['option'], item.value===defaultValue ? styles.active : ''].join(' ')}
                                     onClick={() => {
                                         setCurrentActive(item);
                                         onChange(item.value)
                                     }}>
                                    <span>{item.label}</span>
                                </div>
                            )
                        })
                    }
                    </div>
                }
        </div>
    )
}
export default Select