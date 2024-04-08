import { Controller, Get, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { AuthGuard } from "./guards/auth/auth.guard";

@Controller("api/v1")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/health/check")
  getHello(): string {
    return this.appService.healthCheck();
  }

  @UseGuards(AuthGuard)
  @Get("/secured")
  checkSecurity(): string {
    return this.appService.checkAuthentication();
  }
}
