import { Test, TestingModule } from "@nestjs/testing";
import { ListItemService } from "./list-item.service";
import { getModelToken } from "@nestjs/mongoose";
import { ListItem, ListItemDocument } from "./schemas/list-item.schema";
import { listItemStub } from "./stubs/list-item.stub";
import mongoose, { Model } from "mongoose";
import { BadRequestException } from "@nestjs/common";
import { ListService } from "src/list/list.service";

jest.useFakeTimers().setSystemTime(new Date(listItemStub().createdAt));
const mockListItemModel = {
  findOne: jest.fn().mockResolvedValue(listItemStub()),
  find: jest.fn().mockResolvedValue([listItemStub()]),
  create: jest.fn().mockResolvedValue(listItemStub()),
  findOneAndUpdate: jest.fn().mockResolvedValue(listItemStub()),
  findOneAndDelete: jest.fn().mockResolvedValue(listItemStub()),
};

describe("ListItemService", () => {
  let listItemService: ListItemService;
  let model: Model<ListItemDocument>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListItemService, { provide: getModelToken(ListItem.name), useValue: mockListItemModel }],
    }).compile();

    listItemService = module.get<ListItemService>(ListItemService);
    model = module.get<Model<ListItemDocument>>(getModelToken(ListItem.name));
  });

  it("should be defined", () => {
    expect(listItemService).toBeDefined();
  });

  describe("findOne()", () => {
    describe("when findOne() is called", () => {
      let listItem: ListItem | null;
      beforeEach(async () => {
        listItem = await listItemService.findOne(listItemStub().createdBy, listItemStub()._id);
      });

      test("then model.findOne() is called", () => {
        // jest.spyOn(model, "findOne").mockReturnValue(listStub() as any);
        expect(model.findOne).toHaveBeenCalledWith({
          _id: listItemStub()._id,
          createdBy: listItemStub().createdBy,
        });
      });

      test("then it should return BadRequestException when invalid id is passed", () => {
        const stub = { ...listItemStub(), _id: "invalid-id" };
        const isValidObjectIdMock = jest.spyOn(mongoose, "isValidObjectId").mockReturnValue(false);
        expect(listItemService.findOne(stub.createdBy, stub._id)).rejects.toThrow(BadRequestException);
        expect(isValidObjectIdMock).toHaveBeenCalledWith(stub._id);
        isValidObjectIdMock.mockRestore();
      });

      test("then it should return ListItem", () => {
        expect(listItem).toEqual(listItemStub());
      });
    });
  });

  describe("findAll()", () => {
    describe("when findAll() is called", () => {
      let listItems: ListItem[];
      beforeEach(async () => {
        listItems = await listItemService.findAll(listItemStub().createdBy, listItemStub().listId);
      });
      test("then model.find() is called", () => {
        expect(model.find).toHaveBeenCalledWith({ createdBy: listItemStub().createdBy, listId: listItemStub().listId });
      });

      test("then it should return lists", () => {
        expect(listItems).toEqual([listItemStub()]);
      });
    });
  });

  describe("create()", () => {
    describe("when create() is called", () => {
      let listItem: ListItem;

      let createListItemDto = {
        title: listItemStub().title,
        description: listItemStub().description,
        listId: listItemStub().listId,
        createdAt: listItemStub().createdAt,
        updatedAt: listItemStub().updatedAt,
        updatedBy: listItemStub().updatedBy,
        createdBy: listItemStub().createdBy,
      };

      beforeEach(async () => {
        listItem = await listItemService.create(listItemStub().createdBy, createListItemDto);
      });
      test("then model.create() is called", () => {
        expect(model.create).toHaveBeenCalledWith(createListItemDto);
      });

      test("then it should create a new ListItem", () => {
        expect(listItem).toEqual(listItemStub());
      });
    });
  });

  describe("update()", () => {
    describe("when update() is called", () => {
      let listItem: ListItem | null;

      let updateListDto = {
        title: listItemStub().title,
        description: listItemStub().description,
        listId: listItemStub().listId,
        updatedAt: listItemStub().updatedAt,
        updatedBy: listItemStub().updatedBy,
      };

      beforeEach(async () => {
        listItem = await listItemService.update(listItemStub().createdBy, listItemStub()._id, updateListDto);
      });
      test("then model.findOneAndUpdate() is called", () => {
        expect(model.findOneAndUpdate).toHaveBeenCalledWith(
          { _id: listItemStub()._id, createdBy: listItemStub().createdBy },
          updateListDto,
          {
            new: true,
            runValidators: true,
          },
        );
      });

      test("then it should update a ListItem", () => {
        expect(listItem).toEqual(listItemStub());
      });
    });
  });

  describe("remove()", () => {
    describe("when remove() is called", () => {
      let list: ListItem | null;
      beforeEach(async () => {
        list = await listItemService.remove("", listItemStub()._id);
      });
      test("then model.findOneAndDelete() is called", () => {
        expect(model.findOneAndDelete).toHaveBeenCalledWith({ _id: listItemStub()._id, createdBy: "" });
      });

      test("then it should remove a ListItem", () => {
        expect(list).toEqual(listItemStub());
      });
    });
  });
});
