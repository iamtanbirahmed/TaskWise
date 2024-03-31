import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { ListService } from "./list.service";
import { CreateListDto } from "./dto/create-list.dto";
import { UpdateListDto } from "./dto/update-list.dto";
import { List } from "./schemas/list.schema";

@Controller("api/v1/list")
export class ListController {
  constructor(private readonly listService: ListService) {}

  /**
   * TODO: add validation
   * @param createListDto
   * @returns
   */
  @Post()
  async create(@Body() createListDto: CreateListDto) {
    return this.listService.create(createListDto);
  }

  @Get()
  async findAll(): Promise<any> {
    return this.listService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.listService.findOne(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateListDto: UpdateListDto) {
    return this.listService.update(id, updateListDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.listService.remove(id);
  }
}
