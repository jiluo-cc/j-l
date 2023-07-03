import {
  Inject,
  Injectable,
  Optional,
  type OnModuleInit,
  type INestApplication,
  type INestMicroservice,
} from "@nestjs/common";
import { PrismaClient, type Prisma } from "@prisma/client";
import { type DBServiceOptions } from "../interface";
import { DB_SERVICE_OPTIONS } from "../constants";

@Injectable()
export class DBService
  extends PrismaClient<Prisma.PrismaClientOptions>
  implements OnModuleInit
{
  constructor(
    @Optional()
    @Inject(DB_SERVICE_OPTIONS)
    private readonly options: DBServiceOptions = {}
  ) {
    super(options.clientOptions);
  }

  async onModuleInit() {
    if (this.options.isConnectInstantly) {
      await this.$connect();
    }
  }

  async enableShutdownHooks(app: INestApplication | INestMicroservice) {
    this.$on("beforeExit", async () => {
      await app.close();
    });
  }
}
