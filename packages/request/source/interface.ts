/**
 * 请求客户端的配置项
 */
export type ClientConfig = {
  /**
   * 基础 URL
   */
  base?: string;

  /**
   * 跨域请求时是否需要使用凭证
   */
  withCredentials?: boolean;

  /**
   * 请求超时时间，为 0 永不超时
   */
  timeout?: number;

  /**
   * 自定义请求头
   */
  headers?: Record<string, string>;

  /**
   * 请求负载的数据类型，如果是 json 的话，会默认进行一些处理
   */
  contentType?: "json" | "text" | "";

  /**
   * 浏览器将要响应的数据类型
   */
  responseType?: XMLHttpRequestResponseType;

  /**
   * 请求前的回调，一般用于通用配置处理，比如统一添加 Token 等
   * @param options 请求配置项
   */
  onBeforeRequest?(
    options: RequestOptions
  ): RequestOptions | Promise<RequestOptions>;

  /**
   * 响应数据获取后的回调，一般用于统一数据格式话等
   * @param response 响应数据
   */
  onResponse?(response: Response): unknown;

  /**
   * HTTP Basic 认证
   */
  // auth?: { username?: string; password?: string };
};

/**
 * HTTP 请求方式
 */
export type RequestMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "GET"
  | "POST"
  | "POST"
  | "HEAD"
  | "OPTIONS";

/**
 * 请求查询参数，URL 地址参数
 */
export type RequestSearch = Record<string | number, unknown>;

/**
 * 请求配置项
 */
export type RequestOptions = Required<
  Omit<ClientConfig, "onBeforeRequest" | "onResponse">
> & {
  /**
   *  创建请求时使用的方法
   */
  method: RequestMethod;

  /**
   * 用于请求的服务器 URL
   */
  url: string;

  /**
   *
   * 与请求一起发送的 URL 参数，应当是一个简单对象
   */
  search: RequestSearch;

  /**
   * 请求负载 仅适用 'PUT', 'POST', 'DELETE' 和 'PATCH' 请求方法, 'DELETE' 不建议使用
   */
  payload?: unknown;

  /**
   * 信号，用于取消请求任务
   */
  signal?: AbortSignal;

  /**
   * 上载进度回调
   */
  onUploadProgress?(event: ProgressEvent): unknown;

  /**
   * 下载进度回调
   */
  onDownloadProgress?(event: ProgressEvent): unknown;

  /**
   * 覆写 MIME 类型
   */
  overrideMime?: string;
};

/**
 * 响应数据
 */
export type Response = {
  status: number;
  headers: Record<string, string>;
  body: unknown;
  options: RequestOptions;
  error?: unknown;
};
