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
  method: RequestMethod;
  url: string;
  search: RequestSearch;
  payload?: unknown;
  onProgress?(event: ProgressEvent): unknown;
  base: ConfigOptions["base"];
  headers: ConfigOptions["headers"];
  withCredentials: ConfigOptions["withCredentials"];
  timeout: ConfigOptions["timeout"];
  contentType: ConfigOptions["contentType"];
  responseType: ConfigOptions["responseType"];
};

export type ResponseType = XMLHttpRequestResponseType;

export type Response = {
  status: number;
  headers: Record<string, string>;
  body: unknown;
  options: RequestOptions;
  xhr: XMLHttpRequest;
  error?: unknown;
};
