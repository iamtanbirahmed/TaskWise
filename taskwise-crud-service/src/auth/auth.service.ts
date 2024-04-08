import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/user/schemas/user.schema";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  private logger: Logger = new Logger(AuthService.name);
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * TODO: bcrypt + salt+ db ets
   * @param username
   * @param pass
   * @returns
   */

  async onModuleInit() {
    let usersResponse = await this.userService.findAll();
    if (usersResponse.length <= 0) {
      // this.userService.deleteAll();
      const users: any[] = [
        {
          username: "john@test.com",
          password: await this.encodedPassword("changeme"),
        },
        {
          username: "alice@test.com",
          password: await this.encodedPassword("changeme"),
        },
        {
          username: "bob@test.com",
          password: await this.encodedPassword("changeme"),
        },
      ];
      this.logger.warn("!!!**FOR TEST PURPOSE ONLY**!!!");
      this.logger.warn("Initializing users...!!");
      const response = await this.userService.createMany(users);
      this.logger.warn(`Users initialized ${JSON.stringify(response)}`);
    } else {
      this.logger.warn("Users already initialized!!!");
      this.logger.warn(JSON.stringify(usersResponse));
    }
  }

  async signIn(username: string, pass: string): Promise<any> {
    const user: User | null = await this.userService.findOne(username);

    // TODO: bcrypt + salt+ db ets
    if (user == null) {
      throw new UnauthorizedException();
    }
    const isMatch = this.comparePassword(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    // const { password, ...result } = user;
    // TODO: Generate a JWT and return it here
    // instead of the user object
    const payload = { sub: user._id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private async encodedPassword(password: string): Promise<string> {
    const SALT = bcrypt.genSaltSync();
    return bcrypt.hash(password, SALT);
  }

  // TODO: fix the access level: this should be private
  comparePassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }
}
