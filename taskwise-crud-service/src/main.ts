import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  });
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());

  const PORT: string | number = configService.get<number>("PORT") ?? 3000;
  const SERVICE_NAME: string = configService.get<string>("SERVICE_NAME") ?? "TaskWiseCrudService";
  const BASE_PATH: string = configService.get<string>("BASE_URL") ?? "/";
  const logger: Logger = new Logger(SERVICE_NAME);
  app.setGlobalPrefix(BASE_PATH);
  app.listen(PORT).then(() => {
    logger.debug(`Started ${SERVICE_NAME} at ${PORT}`);
  });
}
bootstrap();
