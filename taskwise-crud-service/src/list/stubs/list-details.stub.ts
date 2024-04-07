import { List } from "../schemas/list.schema";
import { listStub } from "./list.stub";

type ListDetails = List & { items: [] };

export const listDetailsStub = (): ListDetails => {
  return {
    ...listStub(),
    items: [],
  };
};
