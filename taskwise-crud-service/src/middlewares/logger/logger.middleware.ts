import { Injectable, Logger, NestMiddleware } from "@nestjs/common";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: Logger = new Logger(LoggerMiddleware.name);
  use(req: any, res: any, next: () => void) {
    this.logger.debug(`Requesting ${req.method} ${req.path}`);
    next();
  }
}
