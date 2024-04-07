import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/user/schemas/user.schema";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
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
