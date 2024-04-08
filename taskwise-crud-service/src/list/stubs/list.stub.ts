import mongoose from "mongoose";
import { TaskStatus } from "../dto/task-status.enum";
import { List } from "../schemas/list.schema";

const ObjectId = mongoose.Types.ObjectId;

type ListDocument = List & { _id: string };
export const listStub = (): ListDocument => {
  return {
    _id: "6609ab653d9bd8d896ad67a1",
    title: "List 1",
    description: "List 1 description",
    status: TaskStatus.DONE,
    createdAt: new Date("2024-04-06T14:30:08"),
    updatedAt: new Date("2024-04-06T14:30:08"),
    updatedBy: "660b767f8c784fed5c58e739",
    createdBy: "660b767f8c784fed5c58e739", // dummy id added for test purposes
  };
};
