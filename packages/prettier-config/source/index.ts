import { type Config } from 'prettier'

const config: Config = {
  // 不添加非必要分号
  semi: false,
  // 使用单引号
  singleQuote: true,
  // 修改 Markdown 样式
  proseWrap: 'never',
  // 尽可能省略箭头函数括号
  arrowParens: 'avoid',
  // 忽略 HTML 中空白字符
  htmlWhitespaceSensitivity: 'ignore',
  overrides: [
    {
      files: ['*.css', '*.less', '*.scss', '*.sass'],
      options: {
        singleQuote: false,
      },
    },
  ],
}

export const {
  semi,
  singleQuote,
  proseWrap,
  htmlWhitespaceSensitivity,
  overrides,
} = config
