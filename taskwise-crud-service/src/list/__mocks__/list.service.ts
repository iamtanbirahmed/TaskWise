import { listStub } from "../stubs/list.stub";

export const ListService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(listStub()),
  findAll: jest.fn().mockResolvedValue([listStub()]),
  findOne: jest.fn().mockResolvedValue(listStub()),
  update: jest.fn().mockResolvedValue(listStub()),
  // TODO: listDetials stubs
  findListDetails: jest.fn().mockResolvedValue(listStub()),
});
