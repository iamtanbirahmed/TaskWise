import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { Connection } from "mongoose";
import { DatabaseService } from "src/database/database.service";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "src/auth/constants";
import { listItemStub } from "./stubs/list-item.e2e.stub";
import { listStub } from "./stubs/list.e2e.stub";
import { CreateListItemDto } from "src/list-item/dto/create-list-item.dto";
const { omit } = require("lodash");

describe("ListItemController (e2e)", () => {
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
    await dbConnection.collection("listitems").deleteMany({});
    const response = await request(app.getHttpServer()).post("/api/v1/auth/login").send({
      username: "john@test.com",
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
    await dbConnection.collection("listitemss").deleteMany({});
    await dbConnection.collection("users").deleteMany({});
    app.close();
  });

  describe("/list-item (GET)", () => {
    let queryListId: string;
    beforeEach(async () => {
      const { _id, ...insertStub } = listStub();
      insertStub.createdBy = currentUserId;
      const listInsertResponse = await dbConnection.collection("lists").insertOne(insertStub);

      let listItemInsertStub = omit(listItemStub(), "_id");
      listItemInsertStub.listId = listInsertResponse.insertedId.toString();
      queryListId = listInsertResponse.insertedId.toString();
      listItemInsertStub.createdBy = currentUserId;
      await dbConnection.collection("listitems").insertOne(listItemInsertStub);
    });

    // TODO: clean this up to run for all endpoints
    it("should return 401 Unauthorized error when no access token added", () => {
      return request(app.getHttpServer()).get("/api/v1/list-item").expect(401);
    });

    it("should return 200 OK when access token is added to the header", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/list-item")
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ listId: queryListId })
        .expect(200);
    });

    it("should return one list", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/list-item")
        .set("Authorization", `Bearer ${accessToken}`)
        .query({ listId: queryListId });
      expect(response.body.data.length).toEqual(1);
      expect(response.body.data[0].createdBy).toEqual(currentUserId);
      expect(response.body.data[0].listId).toEqual(queryListId);
    });
  });

  describe("/list-item (POST)", () => {
    let queryListId: string;
    beforeEach(async () => {
      const { _id, ...insertStub } = listStub();
      insertStub.createdBy = currentUserId;
      const listInsertResponse = await dbConnection.collection("lists").insertOne(insertStub);
      queryListId = listInsertResponse.insertedId.toString();
    });

    it("should create new listItem", async () => {
      const createListItem: CreateListItemDto = {
        title: listItemStub().title,
        description: listItemStub().description,
        listId: queryListId,
      };

      const response = await request(app.getHttpServer())
        .post("/api/v1/list-item")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(createListItem);
      expect(response.body.data.createdBy).toEqual(currentUserId);
      expect(response.body.data.listId).toEqual(queryListId);
      expect(response.status).toEqual(201);
    });

    it("should return 400 for invalid list-id", async () => {
      const createListItem: CreateListItemDto = {
        title: listItemStub().title,
        description: listItemStub().description,
        listId: "invalid-list-id",
      };

      const response = await request(app.getHttpServer())
        .post("/api/v1/list-item")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(createListItem);
      expect(response.status).toEqual(400);
    });
  });
});
