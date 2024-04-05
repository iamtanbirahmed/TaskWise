import { Module } from "@nestjs/common";
import { ListService } from "./list.service";
import { ListController } from "./list.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { List, ListSchema } from "./schemas/list.schema";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [MongooseModule.forFeature([{ name: List.name, schema: ListSchema }])],
  controllers: [ListController],
  providers: [ListService, JwtService],
})
export class ListModule {}
