import type * as ITS from "./interface";

export const composeOptions = (
  ...args: Partial<ITS.RequestOptions>[]
): ITS.RequestOptions => {
  const [left, right, ...rest] = args;
  const options: ITS.RequestOptions = {
    method: right.method ?? left.method ?? "GET",
    url: right.url ?? left.url ?? "",
    search: {
      ...left.search,
      ...right.search,
    },
    headers: {
      ...left.headers,
      ...right.headers,
    },
    payload: right.payload ?? left.payload ?? null,
    onProgress: right.onProgress ?? left.onProgress,
    base: right.base ?? left.base ?? "",
    withCredentials: right.withCredentials ?? left.withCredentials,
    timeout: right.timeout ?? left.timeout,
    contentType: right.contentType ?? left.contentType,
    responseType: right.responseType ?? left.responseType ?? "",
  };
  if (rest.length) {
    return composeOptions(options, ...rest);
  }
  return options;
};

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

export const appendURLSearchParams = (
  searchParams: URLSearchParams,
  search: ITS.RequestSearch
) =>
  transformSearch(search).forEach((i) => {
    searchParams.set(i.key, i.value);
  });

export const joinURLFragment = (baseURL: string, appendURL: string) => {
  const { protocol, origin } = location;
  const regular = /^https?:\/\/.+/i;
  let urlString: string;

  if (regular.test(appendURL)) {
    urlString = appendURL;
  } else if (appendURL.startsWith("//")) {
    urlString = protocol + appendURL;
  } else if (regular.test(baseURL)) {
    urlString = baseURL + appendURL;
  } else if (baseURL.startsWith("//")) {
    urlString = protocol + baseURL + appendURL;
  } else {
    urlString = origin + baseURL + appendURL;
  }
  return new URL(urlString);
};

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
