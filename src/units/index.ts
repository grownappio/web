import { message } from "antd";
import emoji from "@/assets/emoji/emoji.json";
import createBrowserHistory from "@/units/history";
// 判断当前环境
export const isApp = () => {
  var sUserAgent = navigator.userAgent.toLowerCase();
  if (/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(sUserAgent)) {
    //跳转移动端页面
    return true
  } else {
    //跳转pc端页面
    return false
  }
};

// 判断是否未safari环境
export const isSafari = () => {
  if ((/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent))) {
    return true;
  } else {
    return false;
  }
}

export const setToken = (token: string) => {
  localStorage.setItem('x-token', token);
}

export const getToken = () => {
  const token = localStorage.getItem('x-token');
  if (token === 'null' || token === 'undefined' || token === null) {
    return '';
  }
  return token;
}

export const setWalletToken = (token: string) => {
  localStorage.setItem('wallet-token', token);
}

export const getWalletToken = () => {
  const token = localStorage.getItem('wallet-token');
  if (token === 'null' || token === 'undefined' || token === null) {
    return '';
  }
  return token;
}

export const removeToken = () => {
  localStorage.setItem('x-token', '');
}

export const getUrlHashParam = (decode?: (s: string) => string) => {
  const obj: any = {};
  const keyAndValArr = window.location.hash.split('?').length > 1 ? window.location.hash.split('?')[1].split('&') : [];
  keyAndValArr.filter(e => e).forEach(item => {
    const keyAndVal = item.split('=');
    obj[keyAndVal[0]] = decode ? decode(keyAndVal[1]) : keyAndVal[1]
  })
  return obj;
}

export const calcuTime = (time: string | number | Date) => {
  const tempTime = typeof time === 'string' ? time.replace(/-/g, '/') : time;
  const publicDate = new Date(tempTime);
  const timeSpan = new Date().getTime() - publicDate.getTime();
  const second = timeSpan / 1000;
  const min = timeSpan / 1000 / 60;
  const hour = timeSpan / 1000 / 60 / 60;
  const currentDay = (timeSpan / 1000 / 60 / 60) / 24;

  if (second < 60) {
    return `${Math.floor(second < 0 ? 0 : second)}s ago`;
  } else if (min < 60) {
    return `${Math.floor(min)} mins ago`;
  } else if (hour < 24) {
    return `${Math.floor(hour)} hours ago`;
  } else if (currentDay < 3) {
    return `${Math.floor(currentDay)} days ago`
  } else if (currentDay < 365) {
    return `${publicDate.getMonth() + 1}-${publicDate.getDate()}`
  } else {
    return `${publicDate.getFullYear()}-${publicDate.getMonth() + 1}-${publicDate.getDate()}`
  }
}

const timeFormat = (num: number) => num > 9 ? String(num) : `0${num}`
export const timeTransform = (time: string | number | Date) => {
  const publicDate = new Date(time);
  return `${publicDate.getFullYear()}-${timeFormat(publicDate.getMonth() + 1)}-${timeFormat(publicDate.getDate())} ${timeFormat(publicDate.getHours())} : ${timeFormat(publicDate.getMinutes())}`
}


/**
 * 脱敏公用
 * @param str 脱敏字符串
 * @param begin 起始保留长度，从0开始
 * @param end 结束保留长度，到str.length结束
 * @returns {string}
 */
export const desensitizedCommon = (str: string, begin: number, end: number) => {
  if (!str) return ''
  if (!str && (begin + end) >= str.length) {
    return "";
  }

  let leftStr = str.substring(0, begin);
  let rightStr = str.substring(str.length - end, str.length);

  let strCon = '...'
  return leftStr + strCon + rightStr;
}

/**
*
* */

export const strToBinary = (str: string) => {
  let res = '';
  res = str.split('').map(char => {
    return char.charCodeAt(0).toString(2);
  }).join(' ');
  return res;
}


export const changeTimeFormat = (time: number) => {
  const date = new Date(time);
  const month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  const currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  const hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  return date.getFullYear() + "-" + month + "-" + currentDate + " " + hh + ":" + mm;
}


export const composedPath = (e: any) => {
  // 存在则直接return
  if (e.path) { return e.path }
  // 不存在则遍历target节点
  let target = e.target;
  e.path = []
  while (target.parentNode !== null) {
    e.path.push(target)
    target = target.parentNode
  }
  // 最后补上document和window
  e.path.push(document, window)
  return e.path
}

export const calculationThousand = (value: number) => {
  return value <= 999 ? value : `${(value / 1000).toFixed(1)}k`
}

export const checkIsIos = () => {
  const u = navigator.userAgent;
  const isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  return isIos;
}



export interface MoreThanLineParams {
  containerClassName: string; // 父元素类名，需包含字号属性
  width: string; // 行宽度
  content: string; // 内容
  line?: number; // 行数
}

export const moreThanLines = ({
  containerClassName,
  content,
  width,
  line = 2,
}: MoreThanLineParams) => {
  let result = false;
  // 用于存放内容的元素
  if (!content) return false
  const tempNode = document.createElement('div');
  tempNode.setAttribute('id', 'temp-node');
  tempNode.style.position = 'absolute';
  tempNode.style.wordBreak = 'break-word';
  tempNode.style.visibility = 'hidden';
  // 将传递进来的类名和文本内容赋值
  tempNode.classList.add(containerClassName);
  tempNode.style.width = width;
  tempNode.innerHTML = content;
  const containerNode = document.body.appendChild(tempNode);
  // 用于计算行高的元素
  const dupNode = document.createElement('div');
  dupNode.classList.add(containerClassName);
  dupNode.style.width = width;
  dupNode.style.wordBreak = 'keep-all';
  dupNode.style.overflowWrap = 'normal';
  dupNode.style.whiteSpace = 'nowrap';
  dupNode.style.position = 'absolute';
  dupNode.innerHTML = '<p>222</p><p>111</p>';
  dupNode.setAttribute('id', 'copy-node');
  const getLineHeightNode = document.body.appendChild(dupNode);
  if (containerNode.offsetHeight > getLineHeightNode.offsetHeight * (line / 2)) {
    result = true;
  }
  document.body.removeChild(containerNode);
  document.body.removeChild(getLineHeightNode);
  return result;
};

/* 判断登录白名单 */
export function checkLoginWhiteList(pathname: string) {
  const whiteList = [
    '/login',
    '/404',
    '/403',
  ];
  let flag = false;
  whiteList.forEach((item: string) => {
    if (pathname.indexOf(item) >= 0) {
      flag = true
    }
  })
  return flag;
}

// 重定向到登录页面
export function redirectToLoginPage(queryString = '') {
  window.location.replace(`/#/login${(queryString ? `?redirect=${queryString}` : '')}`);
}

// 将字符创中图标转化成特殊字符保存数据库
export const iconConversionCharacter = (str: string) => {
  str = str.replace(/<img.*?(?:>|\/>)/gi, (val: any) => {
    if (val.indexOf("icon") === -1) {
      return val
    }
    if (val.indexOf("icon") !== -1 && val.indexOf("icon") !== 9) {
      return ''
    }
    let unicode: any = val?.match(/unicode=['"]?([^'"]*)['"]?/i)[1];
    let icon = emoji.icon;
    let iPic = ''

    // 遍历查找Unicode表情

    for (let index = 0; index < icon.length; index++) {
      const element = icon[index]

      if (element.unicode === unicode) {
        iPic = element.unicode
        break
      }
    }
    return iPic;
  })
  return str
}

// 将字符串中特殊字符化成图标
export const characterConversionIcon = (str: string) => {
  if (!str) return ''
  emoji.icon.forEach((item: any) => {
    const index = str.indexOf(item.unicode);
    if (index !== -1) {
      const imgUrl = require(`../assets/emoji/icon/${item.unicode}.png`)
      str = str.replaceAll(item.unicode, `<img id='icon' unicode='${item.unicode}' class='iconImgDiv' src='${imgUrl}' />`)
    }
  });
  return str
}

const convertIdeogramToNormalCharacter = (val: string) => {
  const arrEntities: { [key: string]: string } = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
  return val.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
}
// 获取富文本中所有文字字符
export const getPlainText = (richCont: string, trim = true) => {
  let value = richCont;
  if (richCont) {
    // 方法一： 
    value = value.replace(/<[^>]+>/g, ""); //去掉所有的html标记
    if (trim) {
      value = value.replace(/\s*/g, "");  //去掉空格
      value = value.replace(/↵/g, "");     //去掉所有的↵符号
      value = value.replace(/[\r\n]/g, "") //去掉回车换行
      value = value.replace(/&nbsp;/g, "") //去掉空格
    }
    value = convertIdeogramToNormalCharacter(value);
    return value;
  } else {
    return '';
  }
}

// 去除字符串中的图片内容
export const getText = (str?: string) => {
  return !str ? '' : characterConversionIcon(str.replace(/<img(?:.|\s)*?>/g, ''))
}

// 提取字符串中的图片内容
export const getImgSrc = (rich?: string) => {
  if (!rich) return [];
  const imgList: any = [];
  // @ts-ignore
  rich.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, (match: any, capture: string) => {
    imgList.push(capture);
  });
  return imgList;
}

// 去除前面的空格
const removeSpaceHead = (str: string) => {
  const reg2 = /^\s*/
  return str.replace(reg2, "")

}

// 去除结尾的空格
const removeSpaceTail = (str: string) => {
  const reg4 = /\s*$/
  return str.replace(reg4, "");
}

// 获取p标签内容
const getPtagContent = (str: string) => {
  const div = document.createElement("div");
  div.innerHTML = str;
  const p = div.getElementsByTagName("p")[0];
  return p.innerHTML;
}

// 去除富文本首尾空格或者换行
export const format_rich_text__br = (rich_text: string) => {
  let reg = /<p><br><\/p>/gim;
  let t: any = [];
  let arr = [];
  while (t = reg.exec(rich_text)) {
    arr.push(t.index)
  }
  let start = 0;
  let end = rich_text.length;
  let m = 11; //空行的标签字符长度
  for (let n = 0; n < arr.length; n++) {
    if (arr[n] === n * m) {
      start = (n + 1) * m
    }
  }
  for (let n = arr.length; n > 0; n--) {
    if (arr[n - 1] === rich_text.length - ((arr.length - (n - 1)) * m)) {
      end = arr[n - 1]
    }
  }
  // 去除换行
  let tempStr = rich_text.slice(start, end);
  // 去除空格
  let pArr: string[] = []
  const regP = new RegExp(`<p(?:(?!</p>).|\n)*?</p>`, 'gm');
  // @ts-ignore
  tempStr.replace(regP, (str: string) => {
    pArr.push(str)
  })
  // 只有一个p标签是 去除p标签首尾空白
  if (pArr.length === 1) {
    tempStr = tempStr.replace(getPtagContent(pArr[0]), getPtagContent(pArr[0]).trim());
    console.log(getPtagContent(pArr[0]).trim())
  }

  // 大于等于两个p标签时
  if (pArr.length >= 2) {
    // 第一个p标签去除前面的空格 最后一个p标签去除后面的空格
    tempStr = tempStr.replace(getPtagContent(pArr[0]), removeSpaceHead(getPtagContent(pArr[0])));
    tempStr = tempStr.replace(getPtagContent(pArr[pArr.length - 1]), removeSpaceTail(getPtagContent(pArr[pArr.length - 1])));
  }
  return tempStr;
}

export const checkTextHaveContent = (str: string) => { // 判断富文本是否有实际内容
  return (getPlainText(str) || getImgSrc(str).length);
}

// 获取关注人数单位
const intlFormat = (num: number) => {
  return new Intl.NumberFormat().format(Math.round(num * 10) / 10);
}
// 金额转化单位
export const getPeopleNum = (num: number) => {
  if (num > 1000000000) {
    return Number((num / 100000000).toString().match(/^\d+(?:\.\d{0,1})?/)).toFixed(1) + 'B';
  }
  if (num > 1000000) {
    return Number((num / 1000000).toString().match(/^\d+(?:\.\d{0,1})?/)).toFixed(1) + 'M';
  }
  if (num >= 10000) {
    return Number((num / 1000).toString().match(/^\d+(?:\.\d{0,1})?/)).toFixed(1) + 'k';
  }
  return intlFormat(num);
}

// 长时间添加数字分隔符
export const addNumberSeparator = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const getAgeByBirthDatyTimeStamp = (birth: number) => {
  const birthDate = new Date(birth * 1000);
  const now = new Date();

  const diffSeconds = (now.getTime() - birthDate.getTime()) / 1000;
  return Math.floor(diffSeconds / (365 * 24 * 60 * 60));
}

// 防抖
export const debounce = (func: any, time: number) => {
  let timer: any = null;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(func, time)
  }
}

export const delay = (time = 0) => new Promise((resolve) => setTimeout(() => resolve(1), time));

// 复制文本内容 
export const copyTest = (value: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(value)
  } else {
    let el = Object.assign(document.createElement('input'), { value })
    document.body.appendChild(el)
    el.focus()
    el.select()
    document.execCommand('copy')
    el.remove()
  }
  message.success('Copy Success')
}
// 截取小数点后面位数 index: 截取小数点后面多少位
export const retainDecimals = (value: string | number, index: number) => {
  const tempValue = value.toString();
  return tempValue.substring(0, tempValue.indexOf(".") + index + 1);
}

// PublishTime 发布时间
// 发布时间：规则如下
// a、当前时间 - 发布时间 < 1 min，显示 xx s ago，例如 50s ago；
// b、当前时间 - 发布时间 < 1 hour，显示 XX min(s) ago；
// c、1 hour ≤ 当前时间 - 发布时间 < 24 hours，显示 XX hour(s) ago；
// d、1 day ≤ 当前时间 - 发布时间 < 3 days，显示 XX day(s) ago；
// e、3 day ≤ 当前时间 - 发布时间，显示具体月日，如果不在当年，显示年月日，例如 Dec 21, 2021
export const formatPublishTime = (timeStampStr: string) => {//这里的时间戳是秒数，不是毫秒
  const timestamp = Number(timeStampStr)
  const now = new Date().getTime();
  const diff = (now - timestamp * 1000) / 1000; // 计算时间差，单位为秒
  if (diff < 60) {
    return `${Math.floor(diff)}s ago`;
  } else if (diff < 3600) {
    const min = Math.floor(diff / 60)
    if (min === 1) {
      return `${min} min ago`;
    } else {
      return `${min} mins ago`;
    }
  } else if (diff < 86400) {
    const hour = Math.floor(diff / 3600)
    if (hour === 1) {
      return `${hour} hour ago`;
    } else {
      return `${hour} hours ago`;
    }
  } else if (diff < 259200) {
    const day = Math.floor(diff / 86400)
    if (day === 1) {
      return `${day} day ago`;
    } else {
      return `${day} days ago`;
    }
  } else {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const hour = date.getHours()
    const min = date.getMinutes()
    const thisYear = new Date().getFullYear();
    if (year === thisYear) {
      if (hour < 10 || min < 10) {
        if (hour < 10 && min >= 10) {
          return `0${hour}:${min} · ${month} ${day}`;
        } else if ((min < 10 && hour >= 10)) {
          return `${hour}:0${min} · ${month} ${day}`;
        } else {
          return `0${hour}:0${min} · ${month} ${day}`;
        }
      } else {
        return `${hour}:${min} · ${month} ${day}`;
      }
    } else {
      return `${month} ${day}, ${year}`;
    }
  }
}

// 不显示时分秒
export const formatDate = (timeStamp: number) => {
  const t = new Date(timeStamp * 1000)
  const now = new Date()
  const year = t.getFullYear();
  const month = t.toLocaleString('en-US', { month: 'short' });
  const day = t.getDate();
  if (now.getFullYear() === year) {
    return `${month} ${day}`
  } else {
    return `${month} ${day} ${year}`
  }
}

// 本地时间
export const formatToLocalTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1
  const day = date.getDate();
  const hour = date.getHours()
  const min = date.getMinutes()
  const sec = date.getSeconds()
  return `${year}/${month}/${day} ${hour < 10 ? 0 : ''}${hour}:${min < 10 ? 0 : ''}${min}:${sec < 10 ? 0 : ''}${sec}`;
}

//获得评论数
export const getEmojiConNum = (str: string) => {
  let EmojiConNum = 0
  if (!str) return EmojiConNum
  return str.replace(/<img.*?(?:>|\/>)/gi, (val: any) => {
    EmojiConNum++
    return '';
  }).trim().length + EmojiConNum
}

// 拷贝
export const copy = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

type Arrayable<T> = T | T[]

// 转换为数组
export function castArray<T>(val: Arrayable<T>) {
  return Array.isArray(val) ? val : (val != null ? [val] : [])
}

// 删除数组元素
export function remove<T>(arr: T[], e: T) {
  const i = arr.indexOf(e)
  ~i && arr.splice(i, 1)
  return arr
}

// 判断数组是否存在元素
export function isSelected<T>(arr: T[], val: Arrayable<T>) {
  if (arr.length === 0 && val === null) return true
  return castArray(val).every(e => arr.includes(e))
}

// 切换数组元素
export function toggle<T>(arr: T[] | undefined, val: Arrayable<T> | null) {
  if (val == null) return []
  const list = (arr || []).slice(0);
  if (isSelected(list, val)) {
    castArray(val).forEach(e => remove(list, e))
  } else {
    list.push(...castArray(val))
  }
  return list
}

export const fillterAllSpace = (str: string) => {
  return str.replaceAll(" ", "")
}

export const random = (min: number, max: number) => min + Math.floor(Math.random() * (max - min))

export const toProfilePage = (id: number) => {
  const path = `/profile?id=${id}`;
  createBrowserHistory.push(path);
}