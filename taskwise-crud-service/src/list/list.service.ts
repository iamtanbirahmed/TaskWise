import { BadRequestException, Injectable, Logger, Request } from "@nestjs/common";
import { CreateListDto } from "./dto/create-list.dto";
import { UpdateListDto } from "./dto/update-list.dto";
import { InjectModel } from "@nestjs/mongoose";
import { List, ListDocument } from "./schemas/list.schema";
import mongoose, { Aggregate, Model } from "mongoose";
import { IResponse } from "src/@types";

@Injectable()
export class ListService {
  private logger: Logger = new Logger(ListService.name);
  constructor(@InjectModel(List.name) private readonly listModel: Model<ListDocument>) {}

  /**
   * Create new list document
   * @param createListDto
   * @returns
   */
  async create(userId: string, createListDto: CreateListDto): Promise<List> {
    const createData = {
      title: createListDto.title,
      description: createListDto.description,
      status: createListDto.status,
      createdBy: userId,
      updatedBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return this.listModel.create(createData);
  }

  async findAll(userId: string): Promise<List[]> {
    this.logger.debug(`UserId: ${JSON.stringify(userId)}`);
    return await this.listModel.find({ createdBy: userId });
  }

  async findOne(userId: string, id: string): Promise<List | null> {
    const validListId = mongoose.isValidObjectId(id);
    if (!validListId) {
      throw new BadRequestException(`id: ${id} is not a valid`);
    }

    return await this.listModel.findOne({ _id: id, createdBy: userId });
  }

  async update(userId: string, id: string, updateListDto: UpdateListDto): Promise<List | null> {
    this.logger.debug(` Updatedto${JSON.stringify(updateListDto)}`);
    const updateData = {
      title: updateListDto.title,
      description: updateListDto.description,
      status: updateListDto.status,
      updatedAt: new Date(),
      updatedBy: userId, // add the updatedBy field to the updateData object.
    };
    return await this.listModel.findOneAndUpdate({ _id: id, createdBy: userId }, updateData, {
      new: true,
      runValidators: true,
    }); // return the updated document instead of the original one.
  }

  async findListDetails(userId: string, listId: string): Promise<any> {
    // aggregation pipeline to find all items
    const ObjectId = mongoose.Types.ObjectId;
    const data = await this.listModel
      .aggregate([
        { $match: { _id: new ObjectId(listId), createdBy: userId } },
        {
          $addFields: {
            key: { $toString: "$_id" },
          },
        },
        {
          $lookup: {
            from: "listitems", // Collection name of List Items
            localField: "key",
            foreignField: "listId",
            as: "items",
          },
        },
        {
          $project: {
            items: 1,
            title: 1,
            description: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            createdBy: 1,
            updatedBy: 1,
            _id: 1,
          },
        },
      ])
      .exec();
    if (data.length > 1) throw new Error("Multiple documents with the same Id");
    return data[0];
  }

  async remove(userId: string, id: string): Promise<List | null> {
    return await this.listModel.findOneAndDelete({ _id: id, createdBy: userId });
  }
}
