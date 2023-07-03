import { type Prisma } from "@prisma/client";

export interface DBServiceOptions {
  /**
   * `PrismaClient` 配置项
   * @see: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference/#prismaclient
   */
  clientOptions?: Prisma.PrismaClientOptions;

  /**
   * 是否立即开启连接池
   * @see: https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-management
   */
  isConnectInstantly?: boolean;
}

export interface DBModuleOptions {
  /**
   * 是否注册为全局模块
   * @see: https://docs.nestjs.com/modules#global-modules
   */
  isGlobal?: boolean;

  serviceOptions?: DBServiceOptions;
}
