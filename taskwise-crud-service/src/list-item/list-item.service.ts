import { Injectable, Logger } from "@nestjs/common";
import { CreateListItemDto } from "./dto/create-list-item.dto";
import { UpdateListItemDto } from "./dto/update-list-item.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ListItem, ListItemDocument } from "./schemas/list-item.schema";
@Injectable()
export class ListItemService {
  private logger: Logger = new Logger(ListItemService.name);
  constructor(@InjectModel(ListItem.name) private readonly listItemModel: Model<ListItemDocument>) {}

  async create(userId: string, createListItemDto: CreateListItemDto): Promise<ListItem> {
    const createData = {
      title: createListItemDto.title,
      description: createListItemDto.description,
      listId: createListItemDto.listId,
      createdBy: userId,
      updatedBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const createListItem = new this.listItemModel(createData);
    return createListItem.save();
  }

  async findAll(userId: string, listId: string): Promise<ListItem[]> {
    this.logger.debug(` listId: ${JSON.stringify(listId)}`);
    return await this.listItemModel
      .find({
        listId: listId,
        createdBy: userId,
      })
      .exec();
  }

  async findOne(userId: string, id: string): Promise<ListItem | null> {
    return this.listItemModel.findOne({ _id: id, createdBy: userId }).exec();
  }

  async update(userId: string, id: string, updateListItemDto: UpdateListItemDto): Promise<ListItem | null> {
    this.logger.debug(` Updatedto: ${JSON.stringify(updateListItemDto)}`);
    const updateData = {
      title: updateListItemDto.title,
      description: updateListItemDto.description,
      listId: updateListItemDto.listId,
      updatedAt: new Date(),
      updatedBy: userId,
    };
    return await this.listItemModel.findOneAndUpdate({ _id: id, createdBy: userId }, updateData, { new: true }).exec(); // return the updated document instead of the original one., { new: true}
  }

  async remove(userId: string, id: string): Promise<ListItem | null> {
    return this.listItemModel.findOneAndDelete({ _id: id, createdBy: userId }).exec();
  }
}
