import type * as LI from "./interface";

export function mergeConfig(
  left: LI.ClientConfig,
  right: LI.ClientConfig,
  isOmitConfigOnlyFields?: false
): Required<LI.ClientConfig>;
export function mergeConfig(
  left: LI.ClientConfig,
  right: LI.ClientConfig,
  isOmitConfigOnlyFields: true
): Omit<Required<LI.ClientConfig>, "onBeforeRequest" | "onResponse">;

/**
 * 合并客户端配置项
 */
export function mergeConfig(
  left: LI.ClientConfig,
  right: LI.ClientConfig,
  isOmitConfigOnlyFields = false
) {
  return {
    base: (right.base ?? left.base) || "",
    withCredentials: right.withCredentials ?? left.withCredentials ?? false,
    timeout: (right.timeout ?? left.timeout) || 0,
    headers: {
      ...right.headers,
      ...left.headers,
    },
    contentType: right.contentType || left.contentType || "",
    responseType: (right.responseType ?? left.responseType) || "",
    ...(isOmitConfigOnlyFields
      ? {}
      : {
          // 这俩是 config 里面独有的
          onBeforeRequest: right.onBeforeRequest || left.onBeforeRequest,
          onResponse: right.onResponse || left.onResponse,
        }),
  };
}

/**
 * 合并请求配置项
 */
export const mergeRequestOptions = (
  left: Partial<LI.RequestOptions>,
  right: Partial<LI.RequestOptions>
): LI.RequestOptions => ({
  ...mergeConfig(left, right, true),
  method: right.method ?? left.method ?? "GET",
  url: right.url ?? left.url ?? "",
  search: {
    ...left.search,
    ...right.search,
  },
  payload: right.payload ?? left.payload ?? null,
  signal: right.signal || left.signal,
  onUploadProgress: right.onUploadProgress || left.onUploadProgress,
  onDownloadProgress: right.onDownloadProgress || left.onDownloadProgress,
  overrideMime: right.overrideMime || left.overrideMime,
});

/**
 * 转换查询参数
 */
const transformSearch = (
  search: unknown,
  parentKey?: string
): { key: string; value: string }[] => {
  if (
    (typeof search !== "object" && typeof search !== "function") ||
    search === null
  ) {
    return [];
  }

  const result: { key: string; value: string }[] = [];
  for (const k in search) {
    if (Object.prototype.hasOwnProperty.call(search, k)) {
      const key = parentKey ? parentKey + `[${k}]` : k;
      const value = (search as Record<string, unknown>)[k];
      if (value === "" || value === null || value === undefined) {
        result.push({
          key,
          value: "",
        });
      } else if (value instanceof Date) {
        result.push({
          key,
          value: value.toISOString(),
        });
      } else if (typeof value === "object" || typeof value === "function") {
        result.push(...transformSearch(value, key));
      } else {
        result.push({
          key,
          value: encodeURIComponent(String(value)),
        });
      }
    }
  }
  return result;
};

/**
 * 追加 URL 地址参数
 */
export const appendURLSearchParams = (
  searchParams: URLSearchParams,
  search: LI.RequestSearch
) =>
  transformSearch(search).forEach((i) => {
    searchParams.set(i.key, i.value);
  });

/**
 * 拼接 URL 字符串
 */
export const joinURLFragment = (baseURL: string, appendURL: string) => {
  const { protocol, origin } = location;
  const regular = /^https?:\/\/.+/i;
  let URLString: string;

  if (regular.test(appendURL)) {
    URLString = appendURL;
  } else if (appendURL.startsWith("//")) {
    URLString = protocol + appendURL;
  } else if (regular.test(baseURL)) {
    URLString = baseURL + appendURL;
  } else if (baseURL.startsWith("//")) {
    URLString = protocol + baseURL + appendURL;
  } else {
    URLString = origin + baseURL + appendURL;
  }
  return new URL(URLString);
};

/**
 * 获取 HTTP 头对象
 */
export const getHeaders = (headerString: string) => {
  const headers: Record<string, string> = {};
  headerString.split("\r\n").forEach((line) => {
    if (!line) {
      return;
    }

    const [key, value] = line.split(": ");
    headers[key] = value;
  });
  return headers;
};

/**
 * 为 contentType = 'json' 的请求添加默认处理
 */
export const handleJSONOptions = (options: LI.RequestOptions) => {
  if (options.contentType === "json") {
    if (options.payload && typeof options.payload === "object") {
      options.payload = JSON.stringify(options.payload);
    }
    if (!Object.keys(options.headers).some((i) => /^content-type$/i.test(i))) {
      options.headers["Content-Type"] = "application/json";
    }
  }
  return options;
};
