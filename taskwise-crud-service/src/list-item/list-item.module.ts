import { Module } from "@nestjs/common";
import { ListItemService } from "./list-item.service";
import { ListItemController } from "./list-item.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { ListItem, ListItemSchema } from "./schemas/list-item.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: ListItem.name, schema: ListItemSchema }])],
  controllers: [ListItemController],
  providers: [ListItemService],
})
export class ListItemModule {}