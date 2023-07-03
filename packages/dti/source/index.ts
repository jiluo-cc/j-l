export { version as VERSION } from "../package.json";

declare namespace DTI {
  /**
   * 分页查询批注，即：分页查询的条件
   */
  export type PageNote<Extra extends object = {}> = {
    /**
     * 页码
     */
    number: number;
    /**
     * 页宽，每页条数
     */
    size: number;
    /**
     * 搜索关键字
     */
    keyword: string;
    /**
     * 排序字段
     */
    sort: string;
    /**
     * 排序方向
     */
    order: string;
  } & Extra;
  /**
   * 分页数据对象
   * 如果后端不返回批注，可：type PageResult = Omit<Page, "note">
   */
  export interface Page<Record = any, PageNoteExtra extends object = {}> {
    /**
     * 所有匹配数据条数
     */
    total: number;
    /**
     * 数据列表
     */
    list: Record[];
    /**
     * 查询批注，建议格式化和补全为标准批注
     */
    note: PageNote<PageNoteExtra>;
  }
  /**
   * 数据记录（包含一些常用字段）
   */
  export type Record<Extra = unknown> = {
    id: string;
    createAt?: string;
    createBy?: string;
    updateAt?: string;
    updateBy?: string;
    removeAt?: string;
    removeBy?: string;
    deleteAt?: string;
    deleteBy?: string;
  } & Extra;
  /**
   * 树形结构子项
   */
  export type TreeItem<Extra = unknown> = {
    id: string;
    parentId: string;
    children: TreeItem<Extra>[];
  } & Extra;
  /**
   * 数据选项
   */
  export type OptionItem<Extra = unknown> = {
    id: string;
    name: string;
  } & Extra;
}
