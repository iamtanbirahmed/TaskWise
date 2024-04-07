import { Test, TestingModule } from "@nestjs/testing";
import { ListService } from "./list.service";
import { getModelToken } from "@nestjs/mongoose";
import { List, ListDocument } from "./schemas/list.schema";
import mongoose, { Model } from "mongoose";
import { listStub } from "./stubs/list.stub";
import { BadRequestException } from "@nestjs/common";
import { describe } from "node:test";

const mockListModel = {
  findOne: jest.fn().mockResolvedValue(listStub()),
  find: jest.fn().mockResolvedValue([listStub()]),
  create: jest.fn().mockResolvedValue(listStub()),
  findOneAndUpdate: jest.fn().mockResolvedValue(listStub()),
  findOneAndDelete: jest.fn().mockResolvedValue(listStub()),
};

jest.useFakeTimers().setSystemTime(new Date(listStub().createdAt));

describe("ListService", () => {
  let listService: ListService;
  let model: Model<ListDocument>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListService, { provide: getModelToken(List.name), useValue: mockListModel }],
    }).compile();

    listService = module.get<ListService>(ListService);
    model = module.get<Model<ListDocument>>(getModelToken(List.name));
  });

  it("should be defined", () => {
    expect(listService).toBeDefined();
  });

  describe("findOne()", () => {
    describe("when findOne() is called", () => {
      let list: List | null;
      beforeEach(async () => {
        list = await listService.findOne("", listStub()._id);
      });

      test("then model.findOne() is called", () => {
        // jest.spyOn(model, "findOne").mockReturnValue(listStub() as any);
        expect(model.findOne).toHaveBeenCalledWith({ _id: listStub()._id, createdBy: "" });
      });

      test("then it should return BadRequestException when invalid id is passed", () => {
        const stub = { ...listStub(), _id: "invalid-id" };
        const isValidObjectIdMock = jest.spyOn(mongoose, "isValidObjectId").mockReturnValue(false);
        expect(listService.findOne("", stub._id)).rejects.toThrow(BadRequestException);
        expect(isValidObjectIdMock).toHaveBeenCalledWith(stub._id);
        isValidObjectIdMock.mockRestore();
      });

      test("then it should return list", () => {
        expect(list).toEqual(listStub());
      });
    });
  });

  describe("findAll()", () => {
    describe("when findAll() is called", () => {
      let lists: List[];
      beforeEach(async () => {
        lists = await listService.findAll(listStub().createdBy);
      });
      test("then model.find() is called", () => {
        expect(model.find).toHaveBeenCalledWith({ createdBy: listStub().createdBy });
      });

      test("then it should return lists", () => {
        expect(lists).toEqual([listStub()]);
      });
    });
  });

  describe("create()", () => {
    describe("when create() is called", () => {
      let list: List;

      let createListDto = {
        title: listStub().title,
        description: listStub().description,
        status: listStub().status,
        createdAt: listStub().createdAt,
        updatedAt: listStub().updatedAt,
        updatedBy: listStub().updatedBy,
        createdBy: listStub().createdBy,
      };

      beforeEach(async () => {
        list = await listService.create("", createListDto);
      });
      test("then model.create() is called", () => {
        expect(model.create).toHaveBeenCalledWith(createListDto);
      });

      test("then it should create a newlist", () => {
        expect(list).toEqual(listStub());
      });
    });
  });

  describe("update()", () => {
    describe("when update() is called", () => {
      let list: List | null;

      let updateListDto = {
        title: listStub().title,
        description: listStub().description,
        status: listStub().status,
        updatedAt: new Date(),
        updatedBy: listStub().updatedBy,
      };

      beforeEach(async () => {
        list = await listService.update("", listStub()._id, updateListDto);
      });
      test("then model.findOneAndUpdate() is called", () => {
        expect(model.findOneAndUpdate).toHaveBeenCalledWith({ _id: listStub()._id, createdBy: "" }, updateListDto, {
          new: true,
          runValidators: true,
        });
      });

      test("then it should update a list", () => {
        expect(list).toEqual(listStub());
      });
    });
  });

  describe("remove()", () => {
    describe("when remove() is called", () => {
      let list: List | null;
      beforeEach(async () => {
        list = await listService.remove("", listStub()._id);
      });
      test("then model.findOneAndDelete() is called", () => {
        expect(model.findOneAndDelete).toHaveBeenCalledWith({ _id: listStub()._id, createdBy: "" });
      });

      test("then it should remove a list", () => {
        expect(list).toEqual(listStub());
      });
    });
  });
});
