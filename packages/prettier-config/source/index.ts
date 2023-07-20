import { type Config } from "prettier";

// const printWidth: Config["printWidth"] = 80;

// const tabWidth: Config["tabWidth"] = 2;

// const useTabs: Config["useTabs"] = false;

// 不添加非必要分号
const semi: Config["semi"] = false;

// 使用单引号
const singleQuote: Config["singleQuote"] = true;

// const quoteProps: Config["quoteProps"] = "as-needed";

// const jsxSingleQuote: Config["jsxSingleQuote"] = false;

// const trailingComma: Config["trailingComma"] = "all";

// const bracketSpacing: Config["bracketSpacing"] = true; 

// const bracketSameLine: Config["bracketSameLine"] = false;

// 尽可能省略箭头函数括号
const arrowParens: Config["arrowParens"] = "avoid";

// const rangeStart: Config["rangeStart"] = 0;

// const rangeEnd: Config["rangeEnd"] = Infinity;

// const parser: Config["parser"];

// const filepath: Config["filepath"];

// const requirePragma: Config["requirePragma"] = false; 

// const insertPragma: Config["insertPragma"] = false;

// 修改 Markdown 样式
const proseWrap: Config["proseWrap"] = "never";

// 忽略 HTML 中空白字符
const htmlWhitespaceSensitivity: Config["htmlWhitespaceSensitivity"] = "ignore";

// const vueIndentScriptAndStyle: Config["vueIndentScriptAndStyle"] = false;

// const endOfLine: Config["endOfLine"] = "lf";

// const embeddedLanguageFormatting: Config["embeddedLanguageFormatting"] = "auto";

// const singleAttributePerLine: Config["singleAttributePerLine"] = false;

const overrides: Config["overrides"] = [
  {
    files: ["*.css", "*.less", "*.scss", "*.sass"],
    options: {
      singleQuote: false,
    },
  },
];

export default {
  // printWidth,
  // tabWidth,
  // useTabs,
  semi,
  singleQuote,
  // quoteProps,
  // jsxSingleQuote,
  // trailingComma,
  // bracketSpacing,
  // bracketSameLine,
  arrowParens,
  // rangeStart,
  // rangeEnd,
  // requirePragma,
  // insertPragma,
  proseWrap,
  htmlWhitespaceSensitivity,
  // vueIndentScriptAndStyle,
  // endOfLine,
  // embeddedLanguageFormatting,
  // singleAttributePerLine,
  overrides,
};
