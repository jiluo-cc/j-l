import type * as LI from "./interface";
import {
  appendURLSearchParams,
  getHeaders,
  handleJSONOptions,
  joinURLFragment,
  mergeConfig,
  mergeRequestOptions,
} from "./utils";

export class Client {
  #config: LI.ClientConfig = {};

  /**
   * 客户端 HTTP 请求库
   * @param config 客户端配置项
   */
  constructor(config?: LI.ClientConfig) {
    this.config(config);
  }

  #request<UserResponse = unknown>(options: Partial<LI.RequestOptions>) {
    return new Promise<UserResponse>(async (resolve, reject) => {
      // 构建请求配置
      const compoundedOptions = mergeRequestOptions(this.#config, options);

      let endOptions = compoundedOptions;
      if (this.#config.onBeforeRequest) {
        endOptions = await this.#config.onBeforeRequest?.(compoundedOptions);
      }

      handleJSONOptions(endOptions);

      const xhr = new XMLHttpRequest();

      // 添加监听器
      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.ontimeout = reject;
      xhr.onprogress = endOptions.onDownloadProgress ?? null;

      if (options.signal) {
        const { signal } = options;
        const onAbort = () => {
          signal.removeEventListener("abort", onAbort);
          xhr.abort();
        };
        signal.addEventListener("abort", onAbort);
      }

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
      if (endOptions.overrideMime) {
        xhr.overrideMimeType(endOptions.overrideMime);
      }
      if (endOptions.onUploadProgress) {
        xhr.upload.onprogress = endOptions.onUploadProgress;
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === xhr.DONE) {
          const response: LI.Response = {
            status: xhr.status,
            headers: getHeaders(xhr.getAllResponseHeaders()),
            body: xhr.response,
            options: endOptions,
          };
          if (xhr.status < 100) {
            reject(response);
          }
          try {
            const { onResponse } = this.#config;

            resolve(
              (onResponse ? onResponse(response) : response) as UserResponse
            );
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
   * 配置请求客户端
   * @param config 客户端配置项
   */
  config(config?: LI.ClientConfig) {
    if (config) {
      this.#config = mergeConfig(this.#config, config);
    }
  }

  /**
   * PUT 增加，添加，创建，保存操作
   * @param url 请求路径
   * @param payload 请求负载
   * @param options 请求额外配置
   */
  put<Response = unknown, Payload = unknown>(
    url: string,
    payload?: Payload,
    options?: Partial<Omit<LI.RequestOptions, "method" | "url" | "payload">>
  ) {
    return this.#request<Response>({ ...options, method: "PUT", url, payload });
  }

  /**
   * DELETE 删除，不建议删除使用使用请求体（Body），删除的参数默认放在查询参数中
   * @param url 请求路径
   * @param search 请求查询参数
   * @param options 请求额外配置
   */
  delete<
    Response = unknown,
    Search extends LI.RequestSearch = LI.RequestSearch
  >(
    url: string,
    search?: Search,
    options?: Partial<Omit<LI.RequestOptions, "method" | "url" | "search">>
  ) {
    return this.#request<Response>({
      ...options,
      method: "DELETE",
      url,
      search,
    });
  }

  /**
   * PATCH 更新，编辑
   * @param url 请求路径
   * @param payload 请求负载
   * @param options 请求额外配置
   */
  patch<Response = unknown, Payload = unknown>(
    url: string,
    payload?: Payload,
    options?: Partial<Omit<LI.RequestOptions, "method" | "url" | "payload">>
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
  get<Response = unknown, Search extends LI.RequestSearch = LI.RequestSearch>(
    url: string,
    search?: Search,
    options?: Partial<
      Omit<LI.RequestOptions, "method" | "url" | "search" | "payload">
    >
  ) {
    return this.#request<Response>({ ...options, method: "GET", url, search });
  }

  /**
   * POST 传递其它信息
   * @param url 请求路径
   * @param payload 请求负载
   * @param options 请求额外配置
   */
  post<Response = unknown, Payload = unknown>(
    url: string,
    payload?: Payload,
    options?: Partial<Omit<LI.RequestOptions, "method" | "url" | "payload">>
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
   * @param url 请求路径
   * @param search 请求查询参数
   * @param options 请求额外配置
   */
  head<Response = unknown, Search extends LI.RequestSearch = LI.RequestSearch>(
    url: string,
    search?: Search,
    options?: Partial<Omit<LI.RequestOptions, "method" | "url" | "payload">>
  ) {
    return this.#request<Response>({ ...options, method: "HEAD", url, search });
  }

  /**
   * OPTIONS 请求配置
   * @param url 请求路径
   * @param search 请求查询参数
   * @param options 请求额外配置
   */
  options<
    Response = unknown,
    Search extends LI.RequestSearch = LI.RequestSearch
  >(
    url: string,
    search?: Search,
    options?: Partial<Omit<LI.RequestOptions, "method" | "url" | "payload">>
  ) {
    return this.#request<Response>({
      ...options,
      method: "OPTIONS",
      url,
      search,
    });
  }
}
