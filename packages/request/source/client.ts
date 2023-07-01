import type * as ITS from "./interface";
import {
  appendURLSearchParams,
  composeOptions,
  getHeaders,
  handleJSONOptions,
  joinURLFragment,
} from "./utils";

export class Client {
  #configOptions: Partial<ITS.ConfigOptions> = {
    base: "",
    headers: {},
    withCredentials: false,
    timeout: 0,
    responseType: "",
  };

  /**
   * 客户端 HTTP 请求库
   */
  constructor(options?: Partial<ITS.ConfigOptions>) {
    if (options) {
      this.config(options);
    }
  }

  #request<Response = unknown>(options: Partial<ITS.RequestOptions>) {
    return new Promise<Response>(async (resolve, reject) => {
      // 构建请求配置
      const compoundedOptions = composeOptions(this.#configOptions, options);

      let endOptions = compoundedOptions;
      if (this.#configOptions.onBeforeRequest) {
        endOptions = await this.#configOptions.onBeforeRequest?.(
          compoundedOptions
        );
      }

      handleJSONOptions(endOptions);

      const xhr = new XMLHttpRequest();

      // 添加监听器
      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.ontimeout = reject;
      xhr.onprogress = endOptions.onProgress ?? null;

      const url = joinURLFragment(endOptions.base!, endOptions.url);

      appendURLSearchParams(url.searchParams, endOptions.search);

      xhr.open(endOptions.method, url, true);

      // 设置请求头
      Object.entries(endOptions.headers).forEach(([key, value]) => {
        if (value === void 0) {
          return;
        }
        xhr.setRequestHeader(key, value);
      });

      xhr.responseType = endOptions.responseType;
      xhr.withCredentials = endOptions.withCredentials || false;
      xhr.timeout = endOptions.timeout || 0;

      xhr.onreadystatechange = () => {
        if (xhr.readyState === xhr.DONE) {
          const response: ITS.Response = {
            status: xhr.status,
            headers: getHeaders(xhr.getAllResponseHeaders()),
            body: xhr.response,
            options: endOptions,
            xhr,
          };
          if (xhr.status < 100) {
            reject(response);
          }
          try {
            const { onResponse } = this.#configOptions;

            resolve((onResponse ? onResponse(response) : response) as Response);
          } catch (error) {
            response.error = error;
            reject(response);
          }
        }
      };

      // 发送请求
      xhr.send((endOptions.payload as XMLHttpRequestBodyInit) ?? null);
    });
  }

  /**
   * 配置
   */
  config(options: Partial<ITS.ConfigOptions>) {
    this.#configOptions = composeOptions(
      this.#configOptions,
      options
    ) as Partial<ITS.ConfigOptions>;
  }

  /**
   * PUT 增加
   */
  put<Response = unknown, Payload = unknown>(
    url: string,
    payload?: Payload,
    options?: Partial<Omit<ITS.RequestOptions, "method" | "url" | "payload">>
  ) {
    return this.#request<Response>({ ...options, method: "PUT", url, payload });
  }

  /**
   * DELETE 删除，不建议删除使用使用请求体（Body），删除的参数默认放在查询参数中
   */
  delete<
    Response = unknown,
    Search extends ITS.RequestSearch = ITS.RequestSearch
  >(
    url: string,
    search?: Search,
    options?: Partial<Omit<ITS.RequestOptions, "method" | "url" | "search">>
  ) {
    return this.#request<Response>({
      ...options,
      method: "DELETE",
      url,
      search,
    });
  }

  /**
   * PATCH 更新
   */
  patch<Response = unknown, Payload = unknown>(
    url: string,
    payload?: Payload,
    options?: Partial<Omit<ITS.RequestOptions, "method" | "url" | "payload">>
  ) {
    return this.#request<Response>({
      ...options,
      method: "PATCH",
      url,
      payload,
    });
  }

  /**
   * GET 请求
   * @param url 请求路径
   * @param search 请求查询参数
   * @param options 请求额外配置
   */
  get<Response = unknown, Search extends ITS.RequestSearch = ITS.RequestSearch>(
    url: string,
    search?: Search,
    options?: Partial<
      Omit<ITS.RequestOptions, "method" | "url" | "search" | "payload">
    >
  ) {
    return this.#request<Response>({ ...options, method: "GET", url, search });
  }

  /**
   * POST 传递其它信息
   */
  post<Response = unknown, Payload = unknown>(
    url: string,
    payload?: Payload,
    options?: Partial<Omit<ITS.RequestOptions, "method" | "url" | "payload">>
  ) {
    return this.#request<Response>({
      ...options,
      method: "POST",
      url,
      payload,
    });
  }

  /**
   * HEAD 查询头部信息
   */
  head(
    url: string,
    options?: Partial<Omit<ITS.RequestOptions, "method" | "url" | "payload">>
  ) {
    return this.#request({ ...options, method: "HEAD", url });
  }

  /**
   * OPTIONS 请求配置
   */
  options(
    url: string,
    options?: Partial<Omit<ITS.RequestOptions, "method" | "url" | "payload">>
  ) {
    return this.#request({ ...options, method: "OPTIONS", url });
  }
}
