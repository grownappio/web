import emoji from "@/assets/emoji/emoji.json";
export const addTopic = (value: string, type: string, ref: any) => {
  const quill = ref.current?.getEditor();
  quill.focus();
  const currentPosition = quill.getSelection()?.index || 0;
  quill.insertText(currentPosition, value);
  quill.setSelection(type === 'button' ? currentPosition + 1 : currentPosition);
}

export const checkCompletionTopic = (ref: any) => {
  const quill = ref.current?.getEditor();
  const currentPosition = quill.getSelection()?.index || 0;
  const content = quill.getText(currentPosition);
  if (content.indexOf('#') === -1) {
    addTopic('# ', 'completion', ref);
  }
}

const countSpecial = (ref: any, index: number, lastIndex: number) => {
  const quill = ref?.current.getEditor();
  const delta = quill.getContents();
  // 获取上一个节点到当前节点的 delta
  const restDelta = delta.slice(lastIndex, index);
  let specialArray: any = [];
  const initValue = specialArray.length
    ? specialArray[specialArray.length - 1]
    : 0;
  const num = restDelta.reduce((num: any, op: any) => {
    if (typeof op.insert === 'object') {
      return num + 1;
    }
    return num;
  }, initValue);
  specialArray.push(num);
  return num;
};

const emoticonConversionSingle = (ref: any, unicode: string) => {
  const quill = ref?.current.getEditor();
  quill.focus();
  const totalText = quill.getText();
  const indices = [];
  let specialNum = 0
  let index = totalText.indexOf(unicode);
  while (index !== -1) {
    // 计算 从最初到 index 有多少个特殊 insert
    const tempSpecialNum = countSpecial(ref, index, indices.length ? indices[indices.length - 1].index : 0);
    index = index + tempSpecialNum;
    indices.push({ index: index + specialNum, specialNum: tempSpecialNum });
    specialNum = specialNum + tempSpecialNum;
    // 最后记录搜索到的坐标
    index = totalText.indexOf(unicode, index + 1); // 从字符串出现的位置的下一位置开始继续查找
  }
  if (!indices.length) return
  indices.reverse();
  indices.forEach((item: any) => {
    quill.deleteText(item.index, 7);
    const imgUrl = require(`../../assets/emoji/icon/${unicode}.png`);
    quill.insertEmbed(item.index, 'simpleImg', {
      url: imgUrl,
      class: 'iconImgDiv',
      id: 'icon',
      unicode
    })
  });
}

export const emoticonConversion = (ref: any) => {
  const quill = ref?.current.getEditor();
  quill.focus();
  const totalText = quill.getText();
  emoji.icon.forEach((item: any) => {
    const index = totalText.indexOf(item.unicode);
    if (index !== -1) {
      emoticonConversionSingle(ref, item.unicode)
    }
  });
}