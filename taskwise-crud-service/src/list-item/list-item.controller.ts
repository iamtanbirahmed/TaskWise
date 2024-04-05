import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from "@nestjs/common";
import { ListItemService } from "./list-item.service";
import { CreateListItemDto } from "./dto/create-list-item.dto";
import { UpdateListItemDto } from "./dto/update-list-item.dto";
import { AuthGuard } from "src/guards/auth/auth.guard";
import { IResponse } from "src/@types";
import { ListItem } from "./schemas/list-item.schema";

@UseGuards(AuthGuard)
@Controller("api/v1/list-item")
export class ListItemController {
  constructor(private readonly listItemService: ListItemService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: any, @Body() createListItemDto: CreateListItemDto): Promise<IResponse<ListItem>> {
    const userId = req.user.sub;
    return { data: await this.listItemService.create(userId, createListItemDto), message: "Created" };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: any, @Query("listId") listId: string): Promise<IResponse<ListItem[]>> {
    const userId = req.user.sub;
    return { data: await this.listItemService.findAll(userId, listId) };
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findOne(@Req() req: any, @Param("id") id: string): Promise<IResponse<ListItem | null>> {
    const userId = req.user.sub;
    return { data: await this.listItemService.findOne(userId, id) };
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() req: any,
    @Param("id") id: string,
    @Body() updateListItemDto: UpdateListItemDto,
  ): Promise<IResponse<ListItem | null>> {
    const userId = req.user.sub;
    return { data: await this.listItemService.update(userId, id, updateListItemDto), message: "Updated" };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async remove(@Req() req: any, @Param("id") id: string): Promise<IResponse<ListItem | null>> {
    const userId = req.user.sub;
    return { data: await this.listItemService.remove(userId, id), message: "Deleted" };
  }
}
