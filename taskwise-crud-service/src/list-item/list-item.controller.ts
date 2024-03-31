import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query } from "@nestjs/common";
import { ListItemService } from "./list-item.service";
import { CreateListItemDto } from "./dto/create-list-item.dto";
import { UpdateListItemDto } from "./dto/update-list-item.dto";

@Controller("api/v1/list-item")
export class ListItemController {
  constructor(private readonly listItemService: ListItemService) {}

  @Post()
  async create(@Body() createListItemDto: CreateListItemDto) {
    return this.listItemService.create(createListItemDto);
  }

  @Get()
  async findAll(@Query("listId") listId: string) {
    return this.listItemService.findAll(listId);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.listItemService.findOne(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateListItemDto: UpdateListItemDto) {
    return this.listItemService.update(id, updateListItemDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.listItemService.remove(+id);
  }
}
