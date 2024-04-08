import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
  Req,
  Res,
} from "@nestjs/common";
import { ListService } from "./list.service";
import { CreateListDto } from "./dto/create-list.dto";
import { UpdateListDto } from "./dto/update-list.dto";
import { AuthGuard } from "src/guards/auth/auth.guard";
import { IResponse } from "src/@types";
import { List } from "./schemas/list.schema";

@UseGuards(AuthGuard)
@Controller("api/v1/list")
export class ListController {
  constructor(private readonly listService: ListService) {}

  /**
   * TODO: add validation
   * @param createListDto
   * const userId = req.user.sub;@
   * returns
   */

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: any, @Body() createListDto: CreateListDto): Promise<IResponse<List>> {
    const userId = req.user.sub;
    return { data: await this.listService.create(userId, createListDto), message: "Created" };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: any): Promise<IResponse<List[]>> {
    const userId = req.user.sub;
    return {
      data: await this.listService.findAll(userId),
    };
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findOne(@Req() req: any, @Param("id") id: string): Promise<IResponse<List | null>> {
    const userId = req.user.sub;
    return { data: await this.listService.findOne(userId, id) };
  }
  @Get("/details/:id")
  @HttpCode(HttpStatus.OK)
  async findDetails(@Req() req: any, @Param("id") id: string): Promise<IResponse<any>> {
    const userId = req.user.sub;
    return { data: await this.listService.findListDetails(userId, id) };
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() req: any,
    @Param("id") id: string,
    @Body() updateListDto: UpdateListDto,
  ): Promise<IResponse<List | null>> {
    const userId = req.user.sub;
    return { data: await this.listService.update(userId, id, updateListDto), message: "Updated" };
  }

  @Delete(":id")
  async remove(@Req() req: any, @Param("id") id: string) {
    const userId = req.user.sub;
    return this.listService.remove(userId, id);
  }
}
