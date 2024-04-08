import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  healthCheck(): string {
    return "Service is Healthy!!";
  }

  checkAuthentication(): string {
    return "Hello World!";
  }
}
