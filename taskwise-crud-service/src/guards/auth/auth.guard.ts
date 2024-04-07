import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { ILocals } from "src/@types";
import { jwtConstants } from "src/auth/constants";

@Injectable()
export class AuthGuard implements CanActivate {
  private logger: Logger = new Logger(AuthGuard.name);
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    this.logger.debug("AuthGuard is activated");
    // this.logger.debug(`Response: ${JSON.stringify(response)}`);
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants["secret"],
      });
      request.user = payload;
    } catch (e) {
      //   console.log(e);
      throw new UnauthorizedException();
    }
    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
