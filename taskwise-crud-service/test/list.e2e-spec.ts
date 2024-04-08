import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { Connection } from "mongoose";
import { DatabaseService } from "src/database/database.service";
import { listStub } from "./stubs/list.e2e.stub";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "src/auth/constants";
import { CreateListDto } from "src/list/dto/create-list.dto";
import { listItemStub } from "./stubs/list-item.e2e.stub";
const { omit } = require("lodash");

describe("ListController (e2e)", () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let accessToken: string;
  let jwtService: JwtService;
  let currentUserId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [JwtService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    dbConnection = moduleFixture.get<DatabaseService>(DatabaseService).getDbHandle();
    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  beforeEach(async () => {
    // Making sure no other data is present before test
    await dbConnection.collection("lists").deleteMany({});
    const response = await request(app.getHttpServer()).post("/api/v1/auth/login").send({
      username: "john@benbria.com",
      password: "changeme",
    });
    accessToken = response.body.access_token;
    const payload = await jwtService.verifyAsync(accessToken, {
      secret: jwtConstants["secret"],
    });
    currentUserId = payload.sub;
  });

  afterAll(async () => {
    // clean up after the test
    await dbConnection.collection("lists").deleteMany({});
    await dbConnection.collection("users").deleteMany({});
    app.close();
  });

  // TODO: clean this up to run for all endpoints
  it("should return 401 Unauthorized error when no access token added", () => {
    return request(app.getHttpServer()).get("/api/v1/list").expect(401);
  });

  it("should return 200 OK when access token is added to the header", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/v1/list")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });
  describe("/list (GET)", () => {
    beforeEach(async () => {
      const { _id, ...insertStub } = listStub();
      insertStub.createdBy = currentUserId;
      await dbConnection.collection("lists").insertOne(insertStub);
    });

    it("should return one list", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/list")
        .set("Authorization", `Bearer ${accessToken}`);
      expect(response.body.data.length).toEqual(1);
      expect(response.body.data[0].createdBy).toEqual(currentUserId);
    });
  });

  describe("/create (POST)", () => {
    it("should create a new list", async () => {
      const createListDto: CreateListDto = {
        title: listStub().title,
        description: listStub().description,
        status: listStub().status,
      };
      const response = await request(app.getHttpServer())
        .post("/api/v1/list")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(createListDto);

      expect(response.status).toBe(201);
      expect(response.body.data.createdBy).toEqual(currentUserId);
    });

    it("should return 400 BadRequest response for missing params", async () => {
      const createListDto = {
        description: listStub().description,
        status: listStub().status,
      };
      const response = await request(app.getHttpServer())
        .post("/api/v1/list")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(createListDto);
      expect(response.status).toBe(400);
      expect(response.body.message.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("/list/:id", () => {
    let queryId: string;

    beforeEach(async () => {
      const { _id, ...insertStub } = listStub();
      insertStub.createdBy = currentUserId;
      const response = await dbConnection.collection("lists").insertOne(insertStub);
      queryId = response.insertedId.toString();
    });

    it("should return 400 for searching with invalid id", async () => {
      let invalidId = "invalid-id";
      const response = await request(app.getHttpServer())
        .get("/api/v1/list/" + invalidId)
        .set("Authorization", `Bearer ${accessToken}`);
      expect(response.status).toBe(400);
    });

    it("should return the correct list with the given id", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/list/" + queryId)
        .set("Authorization", `Bearer ${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.data.createdBy).toEqual(currentUserId);
      expect(response.body.data._id).toEqual(queryId);
    });
  });

  describe("/list/details/:id", () => {
    let queryListId: string;
    let expectedListItemId: string;

    beforeEach(async () => {
      // insert dummy lists
      const { _id, ...insertStub } = listStub();
      insertStub.createdBy = currentUserId;
      const listInsertResponse = await dbConnection.collection("lists").insertOne(insertStub);
      queryListId = listInsertResponse.insertedId.toString();
      // add dummy list-item
      let listItemInsertStub = omit(listItemStub(), "_id");
      listItemInsertStub.listId = queryListId;
      listItemInsertStub.createdBy = currentUserId;
      let listItemInserResponse = await dbConnection.collection("listitems").insertOne(listItemInsertStub);
      expectedListItemId = listItemInserResponse.insertedId.toString();
    });

    it("should return 400 for searching with invalid id", async () => {
      let invalidId = "invalid-id";
      const response = await request(app.getHttpServer())
        .get("/api/v1/list/details/" + invalidId)
        .set("Authorization", `Bearer ${accessToken}`);
      expect(response.status).toBe(400);
    });

    it("should return the correct list with the given id", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/list/details/" + queryListId)
        .set("Authorization", `Bearer ${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.data.createdBy).toEqual(currentUserId);
      expect(response.body.data._id).toEqual(queryListId);
    });

    it("should return an items with correct list-item-id", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/list/details/" + queryListId)
        .set("Authorization", `Bearer ${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.data.createdBy).toEqual(currentUserId);
      expect(response.body.data.items.length).toEqual(1);
      expect(response.body.data.items[0]._id).toEqual(expectedListItemId);
    });
  });
});
