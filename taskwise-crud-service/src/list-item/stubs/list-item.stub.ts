import { ListItem } from "../schemas/list-item.schema";

type ListItemDocument = ListItem & { _id: string };
export const listItemStub = (): ListItemDocument => {
  return {
    _id: "6609ab653d9bd8d896ad67a1",
    title: "List 1",
    description: "List 1 description",
    listId: "66115c508b598e2826e56595", // fixed ids for test purposes`
    createdAt: new Date("2024-04-06T14:30:08"),
    updatedAt: new Date("2024-04-06T14:30:08"),
    updatedBy: "660b767f8c784fed5c58e739",
    createdBy: "660b767f8c784fed5c58e739",
  };
};
