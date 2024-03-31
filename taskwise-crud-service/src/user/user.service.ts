import { Injectable } from "@nestjs/common";

export type User = any;

@Injectable()
export class UserService {
  private readonly users = [
    {
      userId: 1,
      username: "john@benbria.com",
      password: "changeme",
    },
    {
      userId: 2,
      username: "maria@benbria.com",
      password: "guess",
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
