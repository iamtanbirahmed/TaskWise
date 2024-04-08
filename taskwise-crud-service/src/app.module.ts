import { Logger, MiddlewareConsumer, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ListModule } from "./list/list.module";
import { ListItemModule } from "./list-item/list-item.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { LoggerMiddleware } from "./middlewares/logger/logger.middleware";
import { JwtService } from "@nestjs/jwt";
import { DatabaseModule } from "./database/database.module";

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
    }),
    ListModule,
    ListItemModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, JwtService],
})
export class AppModule {
  logger: Logger = new Logger(AppModule.name);
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("/");
  }
}
