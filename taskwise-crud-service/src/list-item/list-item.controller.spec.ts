import { Test, TestingModule } from "@nestjs/testing";
import { ListItemController } from "./list-item.controller";
import { ListItemService } from "./list-item.service";
import { AuthGuard } from "src/guards/auth/auth.guard";
import { IResponse } from "src/@types";
import { ListItem } from "./schemas/list-item.schema";
import { listItemStub } from "./stubs/list-item.stub";
import { CreateListItemDto } from "./dto/create-list-item.dto";
import { UpdateListItemDto } from "./dto/update-list-item.dto";

jest.mock("./list-item.service");
const mockGuard = {};

describe("ListItemController", () => {
  let listItemController: ListItemController;
  let listItemService: ListItemService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListItemController],
      providers: [ListItemService],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockGuard)
      .compile();

    listItemController = module.get<ListItemController>(ListItemController);
    listItemService = module.get<ListItemService>(ListItemService);
  });

  it("should be defined", () => {
    expect(listItemController).toBeDefined();
    expect(listItemService).toBeDefined();
  });

  describe("findOne()", () => {
    describe("when findOne() is called", () => {
      let response: IResponse<ListItem | null>;
      const req = { user: { sub: listItemStub().createdBy } };
      beforeEach(async () => {
        response = await listItemController.findOne(req, listItemStub()._id);
      });

      test("then it should call ListItemService", () => {
        expect(listItemService.findOne).toHaveBeenCalledWith(req.user.sub, listItemStub()._id);
      });

      test("then it should return a ListItem", () => {
        expect(response.data).toEqual(listItemStub());
      });
    });
  });

  describe("findAll()", () => {
    describe("when findAll() is called", () => {
      let response: IResponse<ListItem[]>;
      const req = { user: { sub: "" } };
      beforeEach(async () => {
        response = await listItemController.findAll(req, listItemStub().listId);
      });

      test("then it should call ListItemService.findAll", () => {
        expect(listItemService.findAll).toHaveBeenCalledWith(req.user.sub, listItemStub().listId);
      });
      test("then it should return a ListItem", () => {
        expect(response.data).toEqual([listItemStub()]);
      });
    });
  });

  describe("create()", () => {
    describe("when create() is called", () => {
      let response: IResponse<ListItem>;
      let createListItemDto: CreateListItemDto;
      const req = { user: { sub: "" } };
      beforeEach(async () => {
        createListItemDto = {
          title: listItemStub().title,
          description: listItemStub().description,
          listId: listItemStub().listId,
        };
        response = await listItemController.create(req, createListItemDto);
      });

      test("then it should call ListItemService.create()", () => {
        expect(listItemService.create).toHaveBeenCalledWith(req.user.sub, createListItemDto);
      });

      test("then it should create a listItem", () => {
        expect(response.data).toEqual(listItemStub());
        expect(response.message).toEqual("Created");
      });
    });
  });

  describe("update()", () => {
    describe("when update() is called", () => {
      let response: IResponse<ListItem | null>;
      let updateListItemDto: UpdateListItemDto;
      const req = { user: { sub: "" } };
      beforeEach(async () => {
        updateListItemDto = {
          title: listItemStub().title,
          description: listItemStub().description,
          listId: listItemStub().listId,
        };
        response = await listItemController.update(req, listItemStub()._id, updateListItemDto);
      });

      test("then it should call listService.update()", () => {
        expect(listItemService.update).toHaveBeenCalledWith(req.user.sub, listItemStub()._id, updateListItemDto);
      });

      test("then it should update a list", () => {
        expect(response.data).toEqual(listItemStub());
        expect(response.message).toEqual("Updated");
      });
    });
  });
});
