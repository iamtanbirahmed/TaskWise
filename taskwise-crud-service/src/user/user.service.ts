import { Injectable } from "@nestjs/common";
import { User, UserDocument } from "./schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async findOne(username: string): Promise<User | null> {
    return this.userModel.findOne({ username: username }).exec();
  }

  async createMany(users: any[]): Promise<any> {
    return await this.userModel.insertMany(users);
  }

  async deleteAll(): Promise<any> {
    return await this.userModel.deleteMany({});
  }
}
