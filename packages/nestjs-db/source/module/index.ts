import { type DynamicModule, Module } from "@nestjs/common";
import { DBService } from "../service";
import { type DBModuleOptions } from "../interface";
import { DB_SERVICE_OPTIONS } from "../constants";

@Module({
  providers: [DBService],
  exports: [DBService],
})
export class DBModule {
  static forRoot(options?: DBModuleOptions): DynamicModule {
    return {
      global: options?.isGlobal,
      module: DBModule,
      providers: [
        {
          provide: DB_SERVICE_OPTIONS,
          useValue: options?.serviceOptions,
        },
      ],
    };
  }
}
