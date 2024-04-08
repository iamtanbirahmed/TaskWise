import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "src/guards/auth/auth.guard";
import { UnauthorizedException } from "@nestjs/common";
// import { comparePassword } from "src/utils/bcrypt";

// jest.mock("src/utils/bcrypt", () => {
//   comparePassword: jest.fn().mockReturnValue(true);
// });

describe("AuthService", () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({})
      .compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe("signIn()", () => {
    describe("when signIn() is called", () => {
      test("then should sign in successfully", async () => {
        const username = "testuser";
        const password = "testpassword";
        const user = { _id: "user123", username, password };

        // Mock userService.findOne to return the user
        jest.spyOn(userService, "findOne").mockResolvedValue(user as any);

        // Mock comparePassword to return true
        jest.spyOn(authService, "comparePassword").mockReturnValue(true);
        // Mock jwtService.signAsync to return a token
        const token = "token123";
        jest.spyOn(jwtService, "signAsync").mockResolvedValue(token);

        const result = await authService.signIn(username, password);

        expect(result).toEqual({ access_token: token });
      });
      test("should throw UnauthorizedException when user is not found", async () => {
        const username = "testuser";
        const password = "testpassword";

        // Mock userService.findOne to return null
        jest.spyOn(userService, "findOne").mockResolvedValue(null);

        await expect(authService.signIn(username, password)).rejects.toThrow(UnauthorizedException);
      });

      test("should throw UnauthorizedException when password does not match", async () => {
        const username = "testuser";
        const password = "testpassword";
        const user = { _id: "user123", username, password };

        // Mock userService.findOne to return the user
        jest.spyOn(userService, "findOne").mockResolvedValue(user as any);

        // Mock comparePassword to return true
        jest.spyOn(authService, "comparePassword").mockReturnValue(false);

        await expect(authService.signIn(username, password)).rejects.toThrow(UnauthorizedException);
      });
    });
  });
});
