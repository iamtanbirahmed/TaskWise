import { Module } from "@nestjs/common";
import { ListItemService } from "./list-item.service";
import { ListItemController } from "./list-item.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { ListItem, ListItemSchema } from "./schemas/list-item.schema";
import { JwtService } from "@nestjs/jwt";
import { ListService } from "src/list/list.service";
import { ListModule } from "src/list/list.module";

@Module({
  imports: [MongooseModule.forFeature([{ name: ListItem.name, schema: ListItemSchema }])],
  controllers: [ListItemController],
  providers: [ListItemService, JwtService],
})
export class ListItemModule {}
