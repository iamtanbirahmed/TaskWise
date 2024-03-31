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

  async create(createListItemDto: CreateListItemDto) {
    const createData = {
      title: createListItemDto.title,
      description: createListItemDto.description,
      listId: createListItemDto.listId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const createListItem = new this.listItemModel(createData);
    return createListItem.save();
  }

  async findAll(listId: string) {
    this.logger.debug(` listId: ${JSON.stringify(listId)}`);
    const data = await this.listItemModel
      .find({
        listId: listId,
      })
      .exec();
    const response = {
      data: data,
      message: data.length,
    };
    return response;
  }

  async findOne(id: string) {
    return this.listItemModel.findById(id);
  }

  async update(id: string, updateListItemDto: UpdateListItemDto) {
    this.logger.debug(` Updatedto: ${JSON.stringify(updateListItemDto)}`);
    const updateData = {
      title: updateListItemDto.title,
      description: updateListItemDto.description,
      listId: updateListItemDto.listId,
      updatedAt: new Date(),
    };
    return await this.listItemModel.findByIdAndUpdate(id, updateData, { new: true }).exec(); // return the updated document instead of the original one.
  }

  async remove(id: number): Promise<ListItem | null> {
    return this.listItemModel.findByIdAndDelete(id).exec();
  }
}
