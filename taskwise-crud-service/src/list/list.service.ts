import { Injectable, Logger } from "@nestjs/common";
import { CreateListDto } from "./dto/create-list.dto";
import { UpdateListDto } from "./dto/update-list.dto";
import { InjectModel } from "@nestjs/mongoose";
import { List, ListDocument } from "./schemas/list.schema";
import { Model } from "mongoose";

@Injectable()
export class ListService {
  private logger: Logger = new Logger(ListService.name);
  constructor(@InjectModel(List.name) private readonly listModel: Model<ListDocument>) {}

  /**
   * Create new list document
   * @param createListDto
   * @returns
   */
  async create(createListDto: CreateListDto) {
    const createData = {
      title: createListDto.title,
      description: createListDto.description,
      status: createListDto.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const createList = new this.listModel(createData);
    return createList.save();
  }

  async findAll(): Promise<any> {
    const data = await this.listModel.find().exec();
    const response = {
      data: data,
      message: data.length,
    };
    return response;
  }

  async findOne(id: string): Promise<List | null> {
    return this.listModel.findById(id).exec();
  }

  async update(id: string, updateListDto: UpdateListDto): Promise<List | null> {
    this.logger.debug(` Updatedto${JSON.stringify(updateListDto)}`);
    const updateData = {
      title: updateListDto.title,
      description: updateListDto.description,
      status: updateListDto.status,
      updatedAt: new Date(),
    };
    return this.listModel.findByIdAndUpdate(id, updateData, { new: true }).exec(); // return the updated document instead of the original one.
  }

  async remove(id: string): Promise<List | null> {
    return this.listModel.findByIdAndDelete(id).exec();
  }
}
