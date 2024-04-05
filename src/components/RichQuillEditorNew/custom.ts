import { Quill } from 'react-quill'
// 自定义图标
const BlockEmbed = Quill.import('blots/embed')

class EmojiBlot extends BlockEmbed {
  static blotName = 'simpleImg'
  static tagName = 'img'

  static create(value: any) {
    let node = super.create()
    node.setAttribute('id', value.id)
    node.setAttribute('src', value.url)
    node.setAttribute('class', value.class)
    node.setAttribute('unicode', value.unicode || value.alt)
    node.setAttribute('alt', value.alt || value.unicode)
    return node
  }

  static value(node: any) {
    return {
      width: node.width,
      id: node.getAttribute('id'),
      url: node.getAttribute('src'),
      class: node.getAttribute('class'),
      unicode: node.getAttribute('unicode') || node.getAttribute('alt'),
      alt: node.getAttribute('alt') || node.getAttribute('unicode')
    }
  }
}

// 自定义话题
const Inline = Quill.import('blots/inline')
class RichTopicBlot extends Inline {
  static blotName = 'TopicEmbed'
  static className = 'rich-topic'
  static id = 'rich-topic'
  static tagName = 'div'

  static create(value: string) {
    const node = super.create(value)
    return node
  }
}

// 自定义分割线
// 引入源码中的BlockEmbed
// 定义新的blot类型
class AppDividerEmbed extends BlockEmbed {
  static blotName = 'AppDividerEmbed'
  static className = 'divider'
  static tagName = 'div'

  static create(value: string) {
    const node = super.create(value)
    return node
  }

  static value(node: any) {
    return node.innerHTML
  }
}

export { RichTopicBlot, AppDividerEmbed, EmojiBlot }
