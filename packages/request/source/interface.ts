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

export type RequestSearch = Record<string | number, unknown>;

export type ConfigOptions = {
  /**
   * 基础 URL
   */
  base?: string;
  withCredentials?: boolean;
  timeout?: number;
  headers: Record<string, string>;
  contentType?: "json" | "text";
  responseType: XMLHttpRequestResponseType;
  onBeforeRequest(
    options: RequestOptions
  ): RequestOptions | Promise<RequestOptions>;
  onResponse(response: Response): unknown;
};

export type RequestOptions = {
  // 创建请求时使用的方法
  method: RequestMethod;
  // 用于请求的服务器 URL
  url: string;
  // 与请求一起发送的 URL 参数，应当是一个简单对象
  search: RequestSearch;
  // 自定义的 URL 参数序列化方法
  // searchSerializer: () => string
  // 基础路径
  base: ConfigOptions["base"];
  // 自定义请求头
  headers: ConfigOptions["headers"];
  // 跨域请求时是否需要使用凭证
  withCredentials: ConfigOptions["withCredentials"];
  // 请求超时时间，为 0 永不超时
  timeout: ConfigOptions["timeout"];
  // 请求负载的数据类型，如果是 json 的话，会默认进行一些处理
  contentType: ConfigOptions["contentType"];
  // 浏览器将要响应的数据类型
  responseType: ConfigOptions["responseType"];
  // 请求负载 仅适用 'PUT', 'POST', 'DELETE' 和 'PATCH' 请求方法, 'DELETE' 不建议使用
  payload?: unknown;
  // 信号，用于取消请求任务
  signal?: AbortSignal;
  // 上载进度回调
  onUploadProgress?(event: ProgressEvent): unknown;
  // 下载进度回调
  onDownloadProgress?(event: ProgressEvent): unknown;
  // 覆写 MIME 类型
  overrideMime?: string;
  // HTTP Basic Auth
  // auth?: { username?: string; pasword?: string };
};

export type ResponseType = XMLHttpRequestResponseType;

export type Response = {
  status: number;
  headers: Record<string, string>;
  body: unknown;
  options: RequestOptions;
  // xhr: XMLHttpRequest;
  error?: unknown;
};
