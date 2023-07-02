# HTTP 请求库（浏览器端） [![npm](https://img.shields.io/npm/v/@j-l/request.svg)](https://www.npmjs.com/package/@j-l/request)

[![](https://img.shields.io/badge/Give%20me%20a%20star-8A2BE2)](https://github.com/jiluo-cc/j-l)

一个简单但是足够的，基于 `Promise` 和 `XMLHttpRequest` 的网络请求库。

## 介绍

### 特性

- 在浏览器使用 [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) 发起请求
- 支持 [`Promise API`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- 拦截请求和响应
- 转换请求和响应数据
- 取消请求
- 超时处理
- 查询参数序列化支持嵌套项处理
- 自动将请求体序列化为 `JSON`
- 兼容符合规范的 `FormData` 和 `Blob`

### 安装

使用 npm：

```shell
npm add @j-l/request
```

使用 pnpm：

```shell
pnpm add @j-l/request
```

使用 unpkg CDN：

```html
<script src="https://unpkg.com/@j-l/request@1.0.0-beta.5/dist/index.global.js"></script>
script
```

## API

配置缺省请求参数

client.config(config)

```ts
client.config({
  base: "",
  contentType: "json",
  responseType: "json",
  onResponse(response) {
    return response.body;
  },
});
```

其他方法：

- client.get(url[, search[, options]])
- client.delete(url[, search[, options]])
- client.head(url[, search[, options]])
- client.options(url[, search[, options]])
- client.post(url[, payload[, options]])
- client.put(url[, payload[, options]])
- client.patch(url[, payload[, options]])

## 用例

发起一个 `GET` 请求

```ts
import client from "@j-l/request";

async function getUser() {
  try {
    // 向给定 ID 的用户发起请求
    const response = await client.get("/user", {
      id: "123",
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
```

发起一个 `PUT` 请求

```ts
import client from "@j-l/request";

async function addUser() {
  // 添加一个用户
  const response = await client.put("/user", {
    name: "张三",
  });
}
```
