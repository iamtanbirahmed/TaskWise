import { Test, TestingModule } from "@nestjs/testing";
import { ListController } from "./list.controller";
import { AuthGuard } from "src/guards/auth/auth.guard";
import { ListService } from "./list.service";
import { List } from "./schemas/list.schema";
import { listStub } from "./stubs/list.stub";
import { IResponse } from "src/@types";
import { CreateListDto } from "./dto/create-list.dto";
import { UpdateListDto } from "./dto/update-list.dto";

jest.mock("./list.service");

const mockGuard = {};

describe("ListController", () => {
  let listController: ListController;
  let listService: ListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListController],
      providers: [ListService],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockGuard)
      .compile();

    listController = module.get<ListController>(ListController);
    listService = module.get<ListService>(ListService);
  });

  it("should be defined", () => {
    expect(listController).toBeDefined();
  });

  describe("findOne()", () => {
    describe("when findOne() is called", () => {
      let response: IResponse<List | null>;
      const req = { user: { sub: "" } };
      beforeEach(async () => {
        response = await listController.findOne(req, listStub()._id);
      });

      test("then it should call listService", () => {
        expect(listService.findOne).toHaveBeenCalledWith(req.user.sub, listStub()._id);
      });

      test("then it should return a list", () => {
        expect(response.data).toEqual(listStub());
      });
    });
  });

  describe("findAll()", () => {
    describe("when findAll() is called", () => {
      let response: IResponse<List[]>;
      const req = { user: { sub: "" } };
      beforeEach(async () => {
        response = await listController.findAll(req);
      });

      test("then it should call listService", () => {
        expect(listService.findAll).toHaveBeenCalledWith(req.user.sub);
      });
      test("then it should return a list", () => {
        expect(response.data).toEqual([listStub()]);
      });
    });
  });

  describe("create()", () => {
    describe("when create() is called", () => {
      let response: IResponse<List>;
      let createListDto: CreateListDto;
      const req = { user: { sub: "" } };
      beforeEach(async () => {
        createListDto = {
          title: listStub().title,
          description: listStub().description,
          status: listStub().status,
        };
        response = await listController.create(req, createListDto);
      });

      test("then it should call listService.create()", () => {
        expect(listService.create).toHaveBeenCalledWith(req.user.sub, createListDto);
      });

      test("then it should create a list", () => {
        expect(response.data).toEqual(listStub());
        expect(response.message).toEqual("Created");
      });
    });
  });

  describe("update()", () => {
    describe("when update() is called", () => {
      let response: IResponse<List | null>;
      let updateListDto: UpdateListDto;
      const req = { user: { sub: "" } };
      beforeEach(async () => {
        updateListDto = {
          title: listStub().title,
          description: listStub().description,
          status: listStub().status,
        };
        response = await listController.update(req, listStub()._id, updateListDto);
      });

      test("then it should call listService.update()", () => {
        expect(listService.update).toHaveBeenCalledWith(req.user.sub, listStub()._id, updateListDto);
      });

      test("then it should update a list", () => {
        expect(response.data).toEqual(listStub());
        expect(response.message).toEqual("Updated");
      });
    });
  });

  describe("findDetails()", () => {
    describe("when findDetails() is called", () => {
      let response: IResponse<List>;
      const req = { user: { sub: "" } };
      beforeEach(async () => {
        response = await listController.findDetails(req, listStub()._id);
      });

      test("then it should call listService", () => {
        expect(listService.findListDetails).toHaveBeenCalledWith(req.user.sub, listStub()._id);
      });

      test("then it should return a list", () => {
        expect(response.data).toEqual(listStub());
      });
    });
  });
});
