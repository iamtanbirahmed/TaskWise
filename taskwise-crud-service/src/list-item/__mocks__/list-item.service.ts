import { listItemStub } from "../stubs/list-item.stub";

export const ListItemService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(listItemStub()),
  findAll: jest.fn().mockResolvedValue([listItemStub()]),
  findOne: jest.fn().mockResolvedValue(listItemStub()),
  update: jest.fn().mockResolvedValue(listItemStub()),
});
